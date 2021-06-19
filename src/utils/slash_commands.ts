import bot from "../../bot.ts";
import {
  ApplicationCommandOptionTypes,
  snowflakeToBigint,
  ApplicationCommandInteractionDataOptionWithValue,
  iconHashToBigInt,
  ApplicationCommandOption,
  sendInteractionResponse,
  InteractionResponseTypes,
  SlashCommandInteraction,
  bgYellow,
  bgBlack,
  bgGreen,
  bgMagenta,
  black,
  cache,
  green,
  red,
  white,
} from "../../deps.ts";
import { Command, ConvertArgumentDefinitionsToArgs } from "../types/commands.ts";
import {
  BetterApplicationCommandInteractionDataResolved,
  BetterSlashCommandInteraction,
  InteractionCommandArgs,
} from "../types/interactions.ts";
import { log } from "./logger.ts";
import { translate } from "../locales/translate.ts";
import { CommandInfo, createCommandInfo } from "./command_info.ts";

/** Runs the inhibitors to see if a command is allowed to run. */
export async function commandAllowed(
  data: CommandInfo,
  // deno-lint-ignore no-explicit-any
  command: Command<any>
) {
  const inhibitorResults = await Promise.all([...bot.inhibitors.values()].map((inhibitor) => inhibitor(data, command)));

  if (inhibitorResults.includes(true)) {
    logCommand(data, "Inhibit", command.name);
    return false;
  }

  return true;
}

export function logCommand(
  info: CommandInfo,
  type: "Failure" | "Success" | "Trigger" | "Slowmode" | "Missing" | "Inhibit",
  commandName: string
) {
  const command = `[COMMAND: ${bgYellow(black(commandName || "Unknown"))} - ${bgBlack(
    ["Failure", "Slowmode", "Missing"].includes(type) ? red(type) : type === "Success" ? green(type) : white(type)
  )}]`;

  const user = bgGreen(
    black(`${info.user.username}#${info.user.discriminator.toString().padStart(4, "0")}(${info.id})`)
  );
  const guild = bgMagenta(
    black(`${cache.guilds.get(info.guildId)?.name || "DM"}${info.guildId ? `(${info.guildId})` : ""}`)
  );

  log.info(`${command} by ${user} in ${guild} with MessageID: ${info.id}`);
}

/** Parse the options to a nice object.
 * NOTE: this does not work with subcommands
 */
function optionParser(
  options?: ApplicationCommandInteractionDataOptionWithValue[],
  resolved?: BetterApplicationCommandInteractionDataResolved,
  translateOptions?: Record<string, string>
): InteractionCommandArgs | false {
  const parsed: InteractionCommandArgs = {};
  // Options can be undefined so we just return an empty object
  if (!options) return parsed;

  for (const option of options) {
    if (option.type === ApplicationCommandOptionTypes.Channel) {
      const channel = resolved?.channels?.[option.value];
      // If the channel is somehow undefined return false
      if (!channel) return false;

      // Save the argument with the correct name
      parsed[translateOptions?.[option.name] ?? option.name] = channel;
      continue;
    }

    if (option.type === ApplicationCommandOptionTypes.Role) {
      const role = resolved?.roles?.[option.value];
      // If the role is somehow undefined return false
      if (!role) return false;

      // Save the argument with the correct name
      parsed[translateOptions?.[option.name] ?? option.name] = role;
      continue;
    }

    if (option.type === ApplicationCommandOptionTypes.User) {
      const user = resolved?.users?.[option.value];
      // If the user is somehow undefined return false
      if (!user) return false;

      const member = resolved?.members?.[option.value];

      // Save the argument with the correct name
      parsed[translateOptions?.[option.name] ?? option.name] = {
        member: member || undefined,
        user,
      };
      continue;
    }

    if (option.type === ApplicationCommandOptionTypes.Mentionable) {
      const role = resolved?.roles?.[option.value];
      const user = resolved?.users?.[option.value];

      // If user and role are somehow undefined return false
      if (!user && !role) return false;

      const member = resolved?.members?.[option.value];
      const final = user ? { user, member: member || undefined } : role!;

      // Save the argument with the correct name
      parsed[translateOptions?.[option.name] ?? option.name] = final;
      continue;
    }

    // Save the argument with the correct name
    parsed[translateOptions?.[option.name] ?? option.name] = option.value;
  }

  return parsed;
}

/** Translates all options of the command to an object: translatedOptionName: optionName */
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

    if (key === "roles" && Array.isArray(props[key])) {
      props[key] = ((value as string[]) ?? []).map((id) => snowflakeToBigint(id));
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

// deno-lint-ignore no-explicit-any
function getCommand(interaction: SlashCommandInteraction): Command<any> | undefined {
  const name = interaction.data?.name;
  if (!name) return;

  let command = bot.commands.get(name);
  if (!command) return;

  // TODO: maybe make these translatable too?
  // check if it is a subcommand group
  if (interaction.data?.options?.[0].type === ApplicationCommandOptionTypes.SubCommandGroup) {
    command = command._subcommands?.get(interaction.data?.options?.[0].name);
    if (!command) return;
    // If it is a group we need to get the real command
    return command._subcommands?.get(interaction.data.options[0].options?.[0].name || "");
  }

  // check if it is a normal subcommand
  if (interaction.data?.options?.[0].type === ApplicationCommandOptionTypes.SubCommand) {
    return command._subcommands?.get(interaction.data?.options?.[0].name);
  }

  return command;
}

export async function executeCommand(interaction: SlashCommandInteraction) {
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

  const info = createCommandInfo(converted);
  if (!info)
    return await sendInteractionResponse(snowflakeToBigint(interaction.id), interaction.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      private: true,
      data: {
        content: "Something went wrong. The command data could not be created.",
      },
    }).catch(log.error);

  try {
    logCommand(info, "Trigger", command.name);

    const options =
      converted.data?.options?.[0].type === ApplicationCommandOptionTypes.SubCommandGroup
        ? converted.data?.options?.[0].options?.[0].options
        : converted.data?.options?.[0].type === ApplicationCommandOptionTypes.SubCommand
        ? converted.data?.options[0].options
        : converted.data?.options;

    // Check subcommand permissions and options
    if (!(await commandAllowed(info, command))) return;

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

    // deno-lint-ignore no-explicit-any
    await command.execute(info, parsedArguments as ConvertArgumentDefinitionsToArgs<any>);
    logCommand(info, "Success", command.name);
  } catch (error) {
    console.error(error);

    logCommand(info, "Failure", command.name);

    return await sendInteractionResponse(snowflakeToBigint(interaction.id), interaction.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: "Something went wrong. The command execution has thrown an error.",
      },
    }).catch(log.error);
  }
}
