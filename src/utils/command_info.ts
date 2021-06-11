import {
  createNewProp,
  deleteSlashResponse,
  DiscordenoEditWebhookMessage,
  DiscordenoMember,
  DiscordenoMessage,
  editSlashResponse,
  Embed,
  InteractionApplicationCommandCallbackData,
  InteractionResponseTypes,
  sendInteractionResponse,
} from "../../deps.ts";
import { BetterSlashCommandInteraction, BetterUser } from "../types/interactions.ts";

const baseCommandInfo: Partial<CommandInfo> = {
  async reply(data) {
    if (typeof data === "string") data = { content: data };

    return await sendInteractionResponse(this.id!, this.token!, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      private: data.private,
      data,
    });
  },

  async editResponse(options) {
    return await editSlashResponse(this.token!, options);
  },

  async deleteResponse(messageId) {
    return await deleteSlashResponse(this.token!, messageId);
  },

  async think() {
    return await sendInteractionResponse(this.id!, this.token!, {
      type: InteractionResponseTypes.DeferredChannelMessageWithSource,
    });
  },
};

export function createCommandInfo(data: BetterSlashCommandInteraction) {
  const props: Record<string, ReturnType<typeof createNewProp>> = {};

  (Object.keys(data) as (keyof typeof data)[]).forEach((key) => {
    props[key] = createNewProp(data[key]);
  });

  if (props["member"]) {
    props["user"] = createNewProp(data.member!.user);
    props["member"] = createNewProp({ ...data.member, user: undefined });
  }

  const commandInfo: CommandInfo = Object.create(baseCommandInfo, props);

  return commandInfo;
}
export interface CommandInfo {
  /** The id of the interaction */
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

  /** Reply to an interaction command */
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

  /** If the command takes longer than a few seconds to process then use this to indicate the user that the bot is thinking */
  think: (typing?: boolean) => Promise<undefined>;
}
