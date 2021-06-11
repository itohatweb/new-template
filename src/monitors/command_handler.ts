import { configs } from "../../configs.ts";
import bot from "../../bot.ts";
import {
  ApplicationCommandOptionTypes,
  bgBlack,
  bgGreen,
  bgMagenta,
  bgYellow,
  black,
  botId,
  cache,
  DiscordenoMessage,
  green,
  Interaction,
  red,
  white,
} from "../../deps.ts";
import { log } from "../utils/logger.ts";
import { Command } from "../types/commands.ts";
import { CommandInfo, createCommandInfo } from "../utils/command_info.ts";
import { logCommand } from "../utils/commands.ts";

export function parsePrefix(guildId: bigint | undefined) {
  const prefix = guildId ? bot.serverPrefixes.get(guildId) : configs.prefix;
  return prefix || configs.prefix;
}

export function parseCommand(commandName: string) {
  const command = bot.commands.get(commandName);
  if (command) return command;

  // Check aliases if the command wasn't found
  return bot.commands.find((cmd) => Boolean(cmd.aliases?.includes(commandName)));
}

/** Parses all the arguments for the command based on the message sent by the user. */
async function parseArguments(
  data: CommandInfo,
  // deno-lint-ignore no-explicit-any
  command: Command<any>,
  parameters: string[]
) {
  const args: { [key: string]: unknown } = {};
  if (!command.options) return args;

  let missingRequiredArg = false;

  // Clone the parameters so we can modify it without editing original array
  const params = [...parameters];

  // Loop over each argument and validate
  for (const option of command.options) {
    const resolver = bot.options.get(option.type);
    if (!resolver) continue;

    const result = await resolver.execute(option, params);
    if (result !== undefined) {
      // Assign the valid option
      args[option.name] = result;
      // This will use up all args so immediately exist the loop.
      if (
        option.type &&
        [ApplicationCommandOptionTypes.SubCommandGroup, ApplicationCommandOptionTypes.SubCommand].includes(option.type)
      ) {
        break;
      }
      // Remove a param for the next option
      params.shift();
      continue;
    }

    // Invalid arg provided.
    if (option.required === true) {
      missingRequiredArg = true;
      // TODO: maybe add a dynamic default data
      option.missing?.(data);
      break;
    }
  }

  // If an arg was missing then return false so we can error out as an object {} will always be truthy
  return missingRequiredArg ? false : args;
}

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

export async function executeCommand(
  data: CommandInfo,
  // deno-lint-ignore no-explicit-any
  command: Command<any>,
  parameters: string[]
) {
  try {
    if (!command || !parameters) return;
    // bot.slowmode.set(data.author.id, data.timestamp);

    // Parsed args and validated
    const args = await parseArguments(data, command, parameters);
    // Some arg that was required was missing and handled already
    if (!args) {
      return logCommand(data, "Missing", command.name);
    }

    // If no subcommand execute the command
    const [option] = command.options || [];
    const subcommand = option
      ? // deno-lint-ignore no-explicit-any
        (args[option.name] as Command<any>)
      : undefined;

    if (
      !option ||
      (option.type !== ApplicationCommandOptionTypes.SubCommand &&
        option.type !== ApplicationCommandOptionTypes.SubCommandGroup) ||
      !subcommand
    ) {
      // Check subcommand permissions and options
      if (!(await commandAllowed(data, command))) return;

      // @ts-ignore -
      await command.execute?.(data, args);
      return logCommand(data, "Success", command.name);
    }

    // A subcommand was asked for in this command
    if (![subcommand.name, ...(subcommand.aliases || [])].includes(parameters[0])) {
      executeCommand(data, subcommand, parameters);
    } else {
      const subParameters = parameters.slice(1);
      executeCommand(data, subcommand, subParameters);
    }
  } catch (error) {
    log.error(error);
    logCommand(data, "Failure", command.name);
    handleError(data, error);
  }
}

async function messageMonitor(message: DiscordenoMessage) {
  // If the message was sent by a bot we can just ignore it
  if (message.isBot) return;

  let prefix = parsePrefix(message.guildId);
  const botMention = `<@!${botId}>`;
  const botPhoneMention = `<@${botId}>`;

  // TODO allow commands like `<@!botId> commandName`
  // If the message is not using the valid prefix or bot mention cancel the command
  if ([botMention, botPhoneMention].includes(message.content)) {
    return await message.reply(parsePrefix(message.guildId)).catch(log.error);
  } else if (message.content.startsWith(botMention)) prefix = botMention;
  else if (message.content.startsWith(botPhoneMention)) {
    prefix = botPhoneMention;
  } else if (!message.content.startsWith(prefix)) return;

  // Get the first word of the message without the prefix so it is just command name. `!ping testing` becomes `ping`
  const [commandName, ...parameters] = message.content.substring(prefix.length).split(" ");

  // Check if this is a valid command
  const command = parseCommand(commandName);
  if (!command) return;

  const info = createCommandInfo(message);
  if (!info) return;

  logCommand(info, "Trigger", commandName);

  // const lastUsed = bot.slowmode.get(message.author.id);
  // Check if this user is spamming by checking slowmode
  // if (lastUsed && message.timestamp - lastUsed < 2000) {
  //   if (message.guildId) {
  //     await deleteMessage(
  //       message,
  //       translate(message.guildId, "strings:CLEAR_SPAM"),
  //     ).catch(log.error);
  //   }

  //   return logCommand(message, guild?.name || "DM", "Slowmode", commandName);
  // }

  executeCommand(info, command, parameters);
}

// The monitor itself for this file. Above is helper functions for this monitor.
bot.monitors.set("commandHandler", {
  name: "commandHandler",
  ignoreDM: false,
  /** The main code that will be run when this monitor is triggered. */
  execute(message) {
    messageMonitor(message).catch(log.error);
  },
});

// TODO: new-template implement handle error
function handleError(data: CommandInfo, error: any) {
  throw new Error("Function not implemented.");
}
