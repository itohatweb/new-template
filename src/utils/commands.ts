import bot from "../../bot.ts";
import { Collection, CreateGlobalApplicationCommand, DiscordApplicationCommandOptionTypes } from "../../deps.ts";
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

// TODO: remove this
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

  if (!command._subcommands) {
    command._subcommands = new Collection();
  }

  if ((command.options?.length ?? 0 + command._subcommands.size) >= 25)
    return log.warn("Max options length for options exeeded", commandName, subcommand.name);

  log.debug("Creating subcommand", command.name, subcommand.name);
  command._subcommands.set(subcommand.name, subcommand);
}

export function buildCommands() {
  const commands: CreateGlobalApplicationCommand[] = [];

  // @ts-ignore object will be filled up later
  let tmp: CreateGlobalApplicationCommand = {};

  for (const command of bot.commands.values()) {
    // @ts-ignore object will be filled up later
    tmp = {};
    tmp.name = command.name;
    tmp.description = command.description;
    tmp.options = command.subcommands ? [] : command.options;

    if (command.subcommands) {
      for (const subcommand of command.subcommands.values()) {
        tmp.options!.push({ ...subcommand, type: DiscordApplicationCommandOptionTypes.SubCommand });
      }
    }

    commands.push(tmp);
  }

  console.log(commands);
}

// users.sort(function(a, b){
//   if(a.firstname < b.firstname) { return -1; }
//   if(a.firstname > b.firstname) { return 1; }
//   return 0;
// })
