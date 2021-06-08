import bot from "../../bot.ts";
import {
  ApplicationCommandInteractionDataResolved,
  ApplicationCommandOptionTypes,
  Interaction,
  snowflakeToBigint,
  ApplicationCommandInteractionDataOptionWithValue,
  iconHashToBigInt,
  ApplicationCommandOption,
  sendInteractionResponse,
  InteractionResponseTypes,
  SlashCommandInteraction,
} from "../../deps.ts";
import { Command } from "../types/commands.ts";
import {
  BetterApplicationCommandInteractionDataResolved,
  BetterSlashCommandInteraction,
  InteractionCommandArgs,
} from "../types/interactions.ts";
import { log } from "./logger.ts";
import { translate } from "../locales/translate.ts";
import { createCommandInfo } from "./command_info.ts";

/** Parse the options to a nice object.
 * NOTE: this does not work with subcommands
 */
function optionParser(
  options?: ApplicationCommandInteractionDataOptionWithValue[],
  resolved?: BetterApplicationCommandInteractionDataResolved,
  translateOptions?: Record<string, string>
): InteractionCommandArgs | false {
  const parsed: InteractionCommandArgs = {};
  if (!options) return parsed;

  for (const option of options) {
    if (option.type === ApplicationCommandOptionTypes.Channel) {
      const channel = resolved?.channels?.[option.value];
      if (!channel) return false;

      parsed[translateOptions?.[option.name] ?? option.name] = channel;
      continue;
    }

    if (option.type === ApplicationCommandOptionTypes.Role) {
      const role = resolved?.roles?.[option.value];
      if (!role) return false;

      parsed[translateOptions?.[option.name] ?? option.name] = role;
      continue;
    }

    if (option.type === ApplicationCommandOptionTypes.User) {
      const user = resolved?.users?.[option.value];
      if (!user) return false;

      const member = resolved?.members?.[option.value];

      parsed[translateOptions?.[option.name] ?? option.name] = {
        member: member || undefined,
        user,
      };
      continue;
    }

    if (option.type === ApplicationCommandOptionTypes.Mentionable) {
      const role = resolved?.roles?.[option.value];
      const user = resolved?.users?.[option.value];
      const member = resolved?.members?.[option.value];

      if (!user && !role) return false;

      const final = user ? { user, member: member || undefined } : role;
      if (!final) return false;

      parsed[translateOptions?.[option.name] ?? option.name] = final;
      continue;
    }

    parsed[translateOptions?.[option.name] ?? option.name] = option.value;
  }

  return parsed;
}

function translateOptionNames(guildId: bigint | string, options: ApplicationCommandOption[]) {
  const translated: Record<string, string> = {};

  for (const option of options) {
    translated[translate(guildId, option.name).toLowerCase()] = option.name;
  }

  return translated;
}

const convertables = ["id", "permissions", "botId", "integrationId", "applicationId", "channelId", "guildId"];

// deno-lint-ignore ban-types
export function convertToBigint<T extends {}>(
  // deno-lint-ignore ban-types
  data: {}
) {
  const props: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (key === "avatar") {
      const transformed = value ? iconHashToBigInt(value as string) : undefined;
      props.avatar = transformed?.bigint;
      continue;
    }

    if (key === "joinedAt" || key === "premiumSince") {
      props[key] = value ? Date.parse(value as string) : undefined;
      continue;
    }

    if (key === "roles") {
      props[key] = (value as string[])?.map((id) => snowflakeToBigint(id)) ?? [];
      continue;
    }

    if (key === "discriminator") {
      props[key] = Number(value);
      continue;
    }

    props[key] = convertables.includes(key)
      ? value
        ? snowflakeToBigint(value as string)
        : undefined
      : value === Object(value) && !Array.isArray(value)
      ? // deno-lint-ignore ban-types
        convertToBigint(value as {})
      : value;
  }

  return props as T;
}

function getCommand(interaction: SlashCommandInteraction): Command | undefined {
  const name = interaction.data?.name;
  if (!name) return;

  let command = bot.commands.get(name);
  if (!command) return;

  // TODO: maybe make these translatable too?
  // check if it is a subcommand group
  if (interaction.data?.options?.[0].type === ApplicationCommandOptionTypes.SubCommandGroup) {
    command = command.subcommands?.get(interaction.data?.options?.[0].name);
    if (!command) return;
    // If it is a group we need to get the real command
    return command.subcommands?.get(interaction.data.options[0].options?.[0].name || "");
  }

  // check if it is a normal subcommand
  if (interaction.data?.options?.[0].type === ApplicationCommandOptionTypes.SubCommand) {
    return command.subcommands?.get(interaction.data?.options?.[0].name);
  }

  return command;
}

export async function executeCommand(interaction: SlashCommandInteraction) {
  try {
    const command = getCommand(interaction);
    if (!command?.execute)
      return await sendInteractionResponse(snowflakeToBigint(interaction.id), interaction.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        private: true,
        data: {
          content: "Something went wrong. The command could not be found.",
        },
      }).catch(log.error);

    const converted = convertToBigint<BetterSlashCommandInteraction>(interaction);

    const options =
      converted.data?.options?.[0].type === ApplicationCommandOptionTypes.SubCommandGroup
        ? converted.data?.options?.[0].options?.[0].options
        : converted.data?.options?.[0].type === ApplicationCommandOptionTypes.SubCommand
        ? converted.data?.options[0].options
        : converted.data?.options;

    const translatedOptionNames =
      interaction.guildId && command.options ? translateOptionNames(interaction.guildId, command.options) : {};

    const parsedArguments = optionParser(
      options as ApplicationCommandInteractionDataOptionWithValue[] | undefined,
      converted.data?.resolved,
      translatedOptionNames
    );

    if (parsedArguments === false)
      return await sendInteractionResponse(snowflakeToBigint(interaction.id), interaction.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        private: true,
        data: {
          content: "Something went wrong. Some of the specified options could not be parsed.",
        },
      }).catch(log.error);

    const info = createCommandInfo(converted);

    if (!info)
      return await sendInteractionResponse(snowflakeToBigint(interaction.id), interaction.token, {
        type: InteractionResponseTypes.ChannelMessageWithSource,
        private: true,
        data: {
          content: "Something went wrong. The command data could not be created.",
        },
      }).catch(log.error);

    await command.execute(info, parsedArguments);
  } catch (error) {
    console.error(error);

    return await sendInteractionResponse(snowflakeToBigint(interaction.id), interaction.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: "Something went wrong. The command execution has thrown an error.",
      },
    }).catch(log.error);
  }
}
