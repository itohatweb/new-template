import bot from "../../bot.ts";
import { Collection } from "../../deps.ts";
import { ArgumentDefinition, Command } from "../types/commands.ts";
import { Milliseconds } from "../types/time.ts";
import { log } from "./logger.ts";

export function createCommand<T extends readonly ArgumentDefinition[]>(command: Command<T>) {
  command.botChannelPermissions = [
    "ADD_REACTIONS",
    "USE_EXTERNAL_EMOJIS",
    "READ_MESSAGE_HISTORY",
    "VIEW_CHANNEL",
    "SEND_MESSAGES",
    "EMBED_LINKS",
    ...(command.botChannelPermissions ?? []),
  ];

  bot.commands.set(command.name, command);
}

export function createSubcommand<T extends readonly ArgumentDefinition[]>(
  commandName: string,
  subcommand: Command<T>,
  retries = 0
) {
  const names = commandName.split("-");

  if (names.length > 2) return log.warn("Cannot create too nested command", commandName);

  let command: Command<T> = bot.commands.get(names[0])!;

  if (names.length > 1) {
    for (const name of names) {
      const validCommand = command ? command.subcommands?.get(name) : bot.commands.get(name);

      if (!validCommand) {
        if (retries === 20) break;
        setTimeout(createSubcommand, Milliseconds.Second * 10, commandName, subcommand, retries + 1);
        return;
      }

      command = validCommand;
    }
  }

  if (!command) {
    // If 10 minutes have passed something must have been wrong
    if (retries >= 20) {
      return log.warn(`Subcommand ${subcommand} unable to be created for ${commandName}`);
    }

    // Try again in 10 seconds in case this command file just has not been loaded yet.
    setTimeout(createSubcommand, Milliseconds.Second * 10, commandName, subcommand, retries + 1);
    return;
  }

  if (!command.subcommands) {
    command.subcommands = new Collection();
  }

  if ((command.options?.length ?? 0 + command.subcommands.size) >= 25)
    return log.warn("Max options length for options exeeded", commandName, subcommand.name);

  log.debug("Creating subcommand", command.name, subcommand.name);
  command.subcommands.set(subcommand.name, subcommand);
}
