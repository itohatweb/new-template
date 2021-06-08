import bot from "../../bot.ts";
import {
  ApplicationCommandInteractionDataResolved,
  ApplicationCommandOptionTypes,
  Interaction,
  snowflakeToBigint,
  ApplicationCommandInteractionDataOptionWithValue,
  iconHashToBigInt,
} from "../../deps.ts";
import { Command } from "../types/command.ts";
import {
  interactionChannel,
  InteractionCommandArgs,
  interactionMember,
  interactionRole,
  interactionUser,
} from "../types/interactions.ts";

/** Parse the options to a nice object.
 * NOTE: this does not work with subcommands
 */
function optionParser(
  options?: ApplicationCommandInteractionDataOptionWithValue[],
  resolved?: ApplicationCommandInteractionDataResolved,
  dm = false
): InteractionCommandArgs | false {
  const parsed: InteractionCommandArgs = {};
  if (!options) return parsed;

  for (const option of options) {
    if (option.type === ApplicationCommandOptionTypes.Channel) {
      const channel = convertToBigint<interactionChannel>(resolved?.channels?.[option.value], ["id"]);
      if (!channel) return false;

      parsed[option.name] = channel;
      continue;
    }

    if (option.type === ApplicationCommandOptionTypes.Role) {
      const role = convertToBigint<interactionRole>(resolved?.roles?.[option.value], [
        "id",
        "permissions",
        "botId",
        "integrationId",
      ]);
      if (!role) return false;

      parsed[option.name] = role;
      continue;
    }

    if (option.type === ApplicationCommandOptionTypes.User) {
      const user = convertToBigint<interactionUser>(resolved?.users?.[option.value], ["id"], {
        transformAvatar: true,
        transformDiscriminator: true,
      });
      if (!user) return false;

      if (dm) {
        parsed[option.name] = user;
        continue;
      }

      const member = convertToBigint<interactionMember>(resolved?.members?.[option.value], ["permissions"], {
        transformJoinedAt: true,
        transformPremiumSince: true,
        transformRoles: true,
      });

      if (!member) return false;

      parsed[option.name] = {
        ...member,
        user,
      };
      continue;
    }

    if (option.type === ApplicationCommandOptionTypes.Mentionable) {
      const role = convertToBigint<interactionRole>(resolved?.roles?.[option.value], [
        "id",
        "permissions",
        "botId",
        "integrationId",
      ]);
      const user = convertToBigint<interactionUser>(resolved?.users?.[option.value], ["id"], {
        transformAvatar: true,
        transformDiscriminator: true,
      });
      const member = convertToBigint<interactionMember>(resolved?.members?.[option.value], ["permissions"], {
        transformJoinedAt: true,
        transformPremiumSince: true,
        transformRoles: true,
      });

      if ((member && !user) || (!user && !role)) return false;

      const final = member
        ? {
            ...member,
            user,
          }
        : user
        ? user
        : role;

      // @ts-ignore -
      parsed[option.name] = final;
      continue;
    }

    parsed[option.name] = option.value;
  }

  return parsed;
}

// TODO: put this whole thing in a nice try catch so bot does not crash
async function executeCommand(interaction: Interaction) {
  const command = getCommand(interaction);
  // TODO: maybe nice error?
  if (!command?.execute) return;

  const options =
    interaction.data?.options?.[0].type === ApplicationCommandOptionTypes.SubCommandGroup
      ? interaction.data?.options?.[0].options?.[0].options
      : interaction.data?.options?.[0].type === ApplicationCommandOptionTypes.SubCommand
      ? interaction.data?.options[0].options
      : interaction.data?.options;

  const parsedArguments = optionParser(
    options as ApplicationCommandInteractionDataOptionWithValue[] | undefined,
    interaction.data?.resolved,
    !!interaction.guildId
  );

  // TODO: nice error here
  if (parsedArguments === false) return;

  // TODO: maybe removoe this and use the top level error catch
  try {
    await command?.execute?.(parsedArguments);
  } catch (error) {
    console.error(error);
    // TODO: respond to interaction or just let it fail
  }
}

function getCommand(interaction: Interaction): Command | undefined {
  const name = interaction.data?.name;
  if (!name) return;

  let command = bot.commands.get(name);
  if (!command) return;

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

// deno-lint-ignore ban-types
function convertToBigint<T extends {}>(
  // deno-lint-ignore ban-types
  data: {} | undefined,
  keys: string[],
  options?: {
    transformAvatar?: boolean;
    transformJoinedAt?: boolean;
    transformPremiumSince?: boolean;
    transformRoles?: boolean;
    transformDiscriminator?: boolean;
  }
) {
  if (data === undefined) return false;

  const props: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(data)) {
    if (key === "avatar" && options?.transformAvatar) {
      const transformed = value ? iconHashToBigInt(value as string) : undefined;
      props.avatar = transformed?.bigint;
      continue;
    }

    if (
      (key === "joinedAt" && options?.transformJoinedAt) ||
      (key === "premiumSince" && options?.transformPremiumSince)
    ) {
      props[key] = value ? Date.parse(value as string) : undefined;
      continue;
    }

    if (key === "roles" && options?.transformRoles) {
      props[key] = (value as string[])?.map((id) => snowflakeToBigint(id)) || [];
      continue;
    }

    if (key === "discriminator" && options?.transformDiscriminator) {
      props[key] = Number(value);
      continue;
    }

    props[key] = keys.includes(key)
      ? value
        ? snowflakeToBigint(value as string)
        : undefined
      : value === Object(value) && !Array.isArray(value)
      ? // deno-lint-ignore ban-types
        convertToBigint(value as {}, keys, options)
      : value;
  }

  return props as T;
}
