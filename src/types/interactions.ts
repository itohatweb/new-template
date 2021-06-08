import {
  ApplicationCommandInteractionDataOption,
  ChannelTypes,
  GuildMember,
  OverwriteTypes,
  Role,
  SlashCommandInteraction,
  User,
} from "../../deps.ts";
export interface InteractionMemberValue {
  member?: Omit<BetterMember, "user">;
  user: BetterUser;
}

/** The interaction arguments.
 * Important the members `deaf` and `mute` properties will always be false.
 */
export type InteractionCommandArgs = Record<
  string,
  InteractionMemberValue | BetterRole | BetterChannel | boolean | string | number
>;

export interface BetterUser extends Omit<User, "id" | "discriminator" | "avatar"> {
  /** The user's id */
  id: bigint;
  /** The user's 4-digit discord-tag */
  discriminator: number;
  /** The user's avatar hash */
  avatar?: bigint;
}

export interface BetterMember
  extends Omit<GuildMember, "user" | "roles" | "joinedAt" | "premiumSince" | "deaf" | "mute" | "permissions"> {
  /** The user this guild member represents */
  user: BetterUser;
  /** Array of role object ids */
  roles: bigint[];
  /** When the user joined the guild */
  joinedAt: number;
  /** When the user started boosing the guild */
  premiumSince?: number;
  /** Whether the user is deafened in voice channels */
  deaf?: boolean;
  /** Whether the user is muted in voice channels */
  mute?: boolean;
  /** Total permissions of the member in the channel, including overwrites, returned when in the interaction object */
  permissions: bigint;
}

export interface BetterRole extends Omit<Role, "id" | "permissions"> {
  /** Role id */
  id: bigint;
  /** Permission bit set */
  permissions: bigint;
}

export interface BetterSlashCommandInteraction
  extends Omit<SlashCommandInteraction, "id" | "applicationId" | "guildId" | "channelId" | "member" | "user" | "data"> {
  /** Id of the interaction */
  id: bigint;
  /** Id of the application this interaction is for */
  applicationId: bigint;
  /** The guild it was Discord sent from */
  guildId?: bigint;
  /** The channel it was sent from */
  channelId?: bigint;
  /** Guild member data for the invoking user, including permissions */
  member?: BetterMember;
  /** User object for the invoking user, if invoked in a DM */
  user?: BetterUser;

  data: BetterApplicationCommandInteractionData;
}

export interface BetterApplicationCommandInteractionData {
  /** The Id of the invoked command */
  id?: bigint;
  /** The name of the invoked command */
  name?: string;
  /** Converted users + roles + channels */
  resolved?: BetterApplicationCommandInteractionDataResolved;
  /** The params + values from the user */
  options?: ApplicationCommandInteractionDataOption[];
}

export interface BetterApplicationCommandInteractionDataResolved {
  /** The Ids and User objects */
  users?: Record<string, BetterUser>;
  /** The Ids and partial Member objects */
  members?: Record<string, Omit<BetterMember, "user">>;
  /** The Ids and Role objects */
  roles?: Record<string, BetterRole>;
  /** The Ids and partial Channel objects */
  channels?: Record<string, BetterChannel>;
}

export interface BetterChannel {
  id: bigint;
  name: string;
  type: ChannelTypes;
  permissionOverwrites: BetterOverwrite[];
}

export interface BetterOverwrite {
  /** Role or user id */
  id: bigint;
  /** Either 0 (role) or 1 (member) */
  type: OverwriteTypes;
  /** Permission bit set */
  allow: bigint;
  /** Permission bit set */
  deny: bigint;
}
