import {
  cache,
  createNewProp,
  deleteMessage,
  deleteSlashResponse,
  DiscordenoEditWebhookMessage,
  DiscordenoMember,
  DiscordenoMessage,
  editMessage,
  editSlashResponse,
  Embed,
  hasOwnProperty,
  InteractionApplicationCommandCallbackData,
  InteractionResponseTypes,
  sendInteractionResponse,
  sendMessage,
  startTyping,
} from "../../deps.ts";
import { BetterSlashCommandInteraction, BetterUser } from "../types/interactions.ts";

const baseCommandInfo: Partial<CommandInfo> = {
  isThinking: false,

  get isInteraction() {
    return Boolean(this.token);
  },

  async reply(data) {
    if (typeof data === "string") data = { content: data };

    if (!this.isInteraction) {
      if (this.isThinking) {
        this.isThinking = false;
        return await editMessage(this.channelId!, this.originalResponseId!, { ...data, flags: undefined });
      }

      // TODO: not so satisfied with that one
      // if (data.private) return await sendDirectMessage(this.user!.id, data);

      return await sendMessage(this.channelId!, data);
    }

    this.isThinking = false;
    return await sendInteractionResponse(this.id!, this.token!, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      private: data.private,
      data,
    });
  },

  async editResponse(options) {
    if (!this.isInteraction && !this.originalResponseId) return undefined;

    options.embeds = [options.embed!, ...(options.embeds ?? [])].filter((e) => e);

    if (this.isInteraction) return await editSlashResponse(this.token!, options);

    return await editMessage(this.channelId!, options.messageId ?? this.originalResponseId!, {
      ...options,
      /** Embedded `rich` content */
      embed: options.embeds?.[0],
    });
  },

  async deleteResponse(messageId) {
    return this.isInteraction
      ? await deleteSlashResponse(this.token!, messageId)
      : await deleteMessage(this.channelId!, messageId ?? this.originalResponseId!);
  },

  async think(typing) {
    this.isThinking = true;

    if (this.isInteraction) {
      return await sendInteractionResponse(this.id!, this.token!, {
        type: InteractionResponseTypes.DeferredChannelMessageWithSource,
      });
    }

    if (typing === false) {
      return (this.originalResponseId = (
        await sendMessage(this.channelId!, "<a:loading:830724168823734274>  I am thinking")
      ).id);
    }

    return await startTyping(this.channelId!);
  },
};

export function createCommandInfo(data: DiscordenoMessage | BetterSlashCommandInteraction) {
  const props: Record<string, ReturnType<typeof createNewProp>> = {};

  (Object.keys(data) as (keyof typeof data)[]).forEach((key) => {
    props[key] = createNewProp(data[key]);
  });

  // TODO: cover dms somehow
  if (!hasOwnProperty(data, "token")) {
    const member = cache.members.get(data.authorId);
    const guildMember = member?.guilds.get(data.guildId);

    if (!member) return undefined;

    props["user"] = createNewProp({
      /** The user's id */
      id: member.id,
      /** The user's username, not unique across the platform */
      username: member.username,
      /** The user's 4-digit discord-tag */
      discriminator: member.discriminator,
      /** The user's avatar hash */
      avatar: member.avatar,
      /** Whether the user belongs to an OAuth2 application */
      bot: member.bot,
      /** Whether the user is an Official Discord System user (part of the urgent message system) */
      system: member.system,
      /** Whether the user has two factor enabled on their account */
      mfaEnabled: member.mfaEnabled,
      /** The user's chosen language option */
      locale: member.locale,
      /** Whether the email on this account has been verified */
      verified: member.verified,
      /** The user's email */
      email: member.email,
      /** The flags on a user's account */
      flags: member.flags,
      /** The type of Nitro subscription on a user's account */
      premiumType: member.premiumType,
      /** The public flags on a user's account */
      publicFlags: member.publicFlags,
    });

    props["member"] = createNewProp(guildMember);
  } else {
    props["user"] = createNewProp(data.member!.user);
    props["member"] = createNewProp({ ...data.member, user: undefined });
  }

  const commandInfo: CommandInfo = Object.create(baseCommandInfo, props);

  return commandInfo;
}
export interface CommandInfo {
  /** The id of the message/interaction */
  id: bigint;
  /** The token if it is an interaction */
  token?: string;
  /** The id of the channel where this command has been triggered */
  channelId: bigint;
  /** The id of the guild where this command has been triggered */
  guildId: bigint;
  /** The member who executed this command if it was in a guild */
  member?: DiscordenoMember;
  /** The user who executed this command if it was in a dm */
  user: BetterUser;
  /** The messageId of the original response if it is a message command */
  originalResponseId?: bigint;
  /** Whether the bot is currently thinking */
  isThinking: boolean;

  // GETTERS
  /** Whether this command comes from an interaction */
  isInteraction: boolean;

  /** Reply to an interaction or message command.
   * @param private if it is a message command a dm gets send
   */
  reply: (
    content:
      | string
      | (InteractionApplicationCommandCallbackData & {
          /** Set to true if the response should be private, only works with slash commands */
          private?: boolean;
        })
  ) => Promise<DiscordenoMessage | undefined>;
  /** Edit a response. If no messageId is provided the original reply will be edited. */
  editResponse: (
    options: DiscordenoEditWebhookMessage & { flags?: 4; embed?: Embed }
  ) => Promise<DiscordenoMessage | undefined>;
  /** Delete a response. */
  deleteResponse: (messageId?: bigint) => Promise<undefined>;

  /** If the command takes longer than a few seconds to process then use this to indicate the user that the bot is thinking.
   * @param long whether the typing indicator should be triggered or an actuall message should be send defaults to true
   * @param long = true Typing indicator will be triggered WARNING: It lasts for max 10 seconds
   * @param long = false A loading message will be send and then edited on reply
   */
  think: (typing?: boolean) => Promise<undefined>;
}
