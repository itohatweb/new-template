import { ApplicationCommandOption, DiscordenoMessage } from "../../deps.ts";
import { InteractionCommandArgs } from "./interactions.ts";

export interface Command<T = any> {
  /** The name of the command, used for both slash and message commands. */
  name: string;
  /** The aliases for the command, only used for message commands. */
  aliases?: string[];
  // TODO: consider type being a string like "number" | "user" for better ux
  /** The options for the command, used for both slash and message commands. */
  options?: (ApplicationCommandOption & {
    /** The function to execute when the argument is missing. Only useful for message commands. */
    missing?: (message: DiscordenoMessage) => unknown;
  })[];
  execute?: (args: InteractionCommandArgs) => unknown;
  subcommands?: Map<string, Command>;
}
