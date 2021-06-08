import { ApplicationCommandOption, DiscordenoMessage, Interaction, Permission } from "../../deps.ts";
import { InteractionCommandArgs } from "./interactions.ts";
import { CommandInfo } from "../utils/command_info.ts";

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
  execute?: (data: CommandInfo, args: InteractionCommandArgs) => unknown;
  subcommands?: Map<string, Command>;
  /** Whether the command should have a cooldown */
  cooldown?: {
    /** How long the user needs to wait after the first execution until he can use the command again */
    seconds: number;
    /** How often the user is allowed to use the command until he is in cooldown */
    allowedUses?: number;
  };
  nsfw?: boolean;
  /** By default true */
  guildOnly?: boolean;
  /** Dm only by default false */
  dmOnly?: boolean;

  permissionLevels?:
    | PermissionLevels[]
    | ((data: DiscordenoMessage | Interaction, command: Command<T>) => boolean | Promise<boolean>);
  botServerPermissions?: Permission[];
  botChannelPermissions?: Permission[];
  userServerPermissions?: Permission[];
  userChannelPermissions?: Permission[];
}

export enum PermissionLevels {
  Member,
  Moderator,
  Admin,
  ServerOwner,
  BotSupporter,
  BotDev,
  BotOwner,
}
