import { ApplicationCommandOption, DiscordApplicationCommandOptionTypes, Permission } from "../../deps.ts";
import {
  BetterChannel,
  BetterRole,
  BetterUser,
  InteractionCommandArgs,
  InteractionMemberValue,
} from "./interactions.ts";
import { CommandInfo } from "../utils/command_info.ts";

// deno-lint-ignore no-explicit-any
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

type Identity<T> = { [P in keyof T]: T[P] };

// TODO: make required by default true
// Define each of the types here
type BaseDefinition = {
  description: string;
};
// String
type StringArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: DiscordApplicationCommandOptionTypes.String;
};
type StringOptionalArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: DiscordApplicationCommandOptionTypes.String;
  required: false;
};

// Integer
type IntegerArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: DiscordApplicationCommandOptionTypes.Integer;
};
type IntegerOptionalArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: DiscordApplicationCommandOptionTypes.Integer;
  required: false;
};

// BOOLEAN
type BooleanArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: DiscordApplicationCommandOptionTypes.Boolean;
};
type BooleanOptionalArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: DiscordApplicationCommandOptionTypes.Boolean;
  required: false;
};

// USER
type UserArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: DiscordApplicationCommandOptionTypes.User;
};
type UserOptionalArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: DiscordApplicationCommandOptionTypes.User;
  required: false;
};

// CHANNEL
type ChannelArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: DiscordApplicationCommandOptionTypes.Channel;
};
type ChannelOptionalArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: DiscordApplicationCommandOptionTypes.Channel;
  required: false;
};

// ROLE
type RoleArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: DiscordApplicationCommandOptionTypes.Role;
};
type RoleOptionalArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: DiscordApplicationCommandOptionTypes.Role;
  required: false;
};

// MENTIONABLE
type MentionableArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: DiscordApplicationCommandOptionTypes.Mentionable;
};
type MentionableOptionalArgumentDefinition<N extends string = string> = BaseDefinition & {
  name: N;
  type: DiscordApplicationCommandOptionTypes.Mentionable;
  required: false;
};

// Add each of known ArgumentDefinitions to this union.
export type ArgumentDefinition =
  | StringArgumentDefinition
  | StringOptionalArgumentDefinition
  | IntegerArgumentDefinition
  | IntegerOptionalArgumentDefinition
  | BooleanArgumentDefinition
  | BooleanOptionalArgumentDefinition
  | UserArgumentDefinition
  | UserOptionalArgumentDefinition
  | ChannelArgumentDefinition
  | ChannelOptionalArgumentDefinition
  | RoleArgumentDefinition
  | RoleOptionalArgumentDefinition
  | MentionableArgumentDefinition
  | MentionableOptionalArgumentDefinition;

// OPTIONALS MUST BE FIRST!!!
export type ConvertArgumentDefinitionsToArgs<T extends readonly ArgumentDefinition[]> = Identity<
  UnionToIntersection<
    {
      [P in keyof T]: T[P] extends StringOptionalArgumentDefinition<infer N> // STRING
        ? { [_ in N]?: string }
        : T[P] extends StringArgumentDefinition<infer N>
        ? { [_ in N]: string }
        : // INTEGER
        T[P] extends IntegerOptionalArgumentDefinition<infer N>
        ? { [_ in N]?: number }
        : T[P] extends IntegerArgumentDefinition<infer N>
        ? { [_ in N]: number }
        : // BOOLEAN
        T[P] extends BooleanOptionalArgumentDefinition<infer N>
        ? { [_ in N]?: boolean }
        : T[P] extends BooleanArgumentDefinition<infer N>
        ? { [_ in N]: boolean }
        : // USER
        T[P] extends UserOptionalArgumentDefinition<infer N>
        ? { [_ in N]?: InteractionMemberValue }
        : T[P] extends UserArgumentDefinition<infer N>
        ? { [_ in N]: InteractionMemberValue }
        : // CHANNEL
        T[P] extends ChannelOptionalArgumentDefinition<infer N>
        ? { [_ in N]?: BetterChannel }
        : T[P] extends ChannelArgumentDefinition<infer N>
        ? { [_ in N]: BetterChannel }
        : // ROLE
        T[P] extends RoleOptionalArgumentDefinition<infer N>
        ? { [_ in N]?: BetterRole }
        : T[P] extends RoleArgumentDefinition<infer N>
        ? { [_ in N]: BetterRole }
        : // MENTIONABLE
        T[P] extends MentionableOptionalArgumentDefinition<infer N>
        ? { [_ in N]?: BetterRole | InteractionMemberValue }
        : T[P] extends MentionableArgumentDefinition<infer N>
        ? { [_ in N]: BetterRole | InteractionMemberValue }
        : never;
    }[number]
  >
>;

export interface Command<T extends readonly ArgumentDefinition[]> {
  /** The name of the command, used for both slash and message commands. */
  name: string;
  /** The aliases for the command, only used for message commands. */
  aliases?: string[];
  // TODO: consider type being a string like "number" | "user" for better ux
  /** The options for the command, used for both slash and message commands. */
  // options?: ApplicationCommandOption[];
  options?: T;
  execute?: (data: CommandInfo, args: ConvertArgumentDefinitionsToArgs<T>) => unknown;
  subcommands?: Map<string, Command<any>>;
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

  permissionLevels?: PermissionLevels[] | ((data: CommandInfo, command: Command<T>) => boolean | Promise<boolean>);
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

// type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

// type Identity<T> = { [P in keyof T]: T[P] };

// // Define each of the types here
// type BaseDefinition = {
//   description: string;
// };
// type BooleanArgumentDefinition<N extends string = string> = BaseDefinition & {
//   name: N;
//   type: DiscordApplicationCommandOptionTypes.Boolean;
// };
// type BooleanOptionalArgumentDefinition<N extends string = string> = BaseDefinition & {
//   name: N;
//   type: DiscordApplicationCommandOptionTypes.Boolean;
//   required: false;
// };

// // Add each of known ArgumentDefinitions to this union.
// export type ArgumentDefinition = BooleanArgumentDefinition | BooleanOptionalArgumentDefinition;

// // OPTIONALS MUST BE FIRST!!!
// export type ConvertArgumentDefinitionsToArgs<T extends readonly ArgumentDefinition[]> = Identity<
//   UnionToIntersection<
//     {
//       [P in keyof T]: T[P] extends BooleanOptionalArgumentDefinition<infer N>
//         ? { [_ in N]?: boolean }
//         : T[P] extends BooleanArgumentDefinition<infer N>
//         ? { [_ in N]: boolean }
//         : never;
//     }[number]
//   >
// >;
