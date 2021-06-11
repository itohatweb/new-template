import { ApplicationCommandOptionTypes, Collection, DiscordenoMessage, EventHandlers, Interaction } from "./deps.ts";
import { Argument } from "./src/types/argument.ts";
import { PermissionLevels, Command } from "./src/types/commands.ts";
import { Monitor } from "./src/types/monitors.ts";
import { CommandInfo } from "./src/utils/command_info.ts";

export const bot = {
  eventHandlers: {} as EventHandlers,
  monitors: new Collection<string, Monitor>(),

  // deno-lint-ignore no-explicit-any
  commands: new Collection<string, Command<any>>(),
  options: new Collection<ApplicationCommandOptionTypes, Argument>(),
  inhibitors: new Collection<
    string,
    (
      data: CommandInfo,
      // deno-lint-ignore no-explicit-any
      command: Command<any>
    ) => Promise<boolean> | boolean
  >(),
  permissionLevels: new Collection<
    PermissionLevels,
    (
      data: CommandInfo,
      // deno-lint-ignore no-explicit-any
      command: Command<any>
    ) => Promise<boolean> | boolean
  >(),

  serverPrefixes: new Collection<bigint, string>(),
  /** This should hold the language names per guild id. <guildId, language> */
  serverLanguages: new Collection<bigint, string>(),
};

export default bot;
