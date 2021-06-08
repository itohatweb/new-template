import {
  botId,
  cache,
  DiscordenoMessage,
  getMissingChannelPermissions,
  getMissingGuildPermissions,
  Interaction,
  InteractionResponseTypes,
  PermissionStrings,
  sendInteractionResponse,
  snowflakeToBigint,
} from "../../deps.ts";
import bot from "../../bot.ts";
import { isInteraction } from "../types/type_guards/is_interaction.ts";
import { log } from "../utils/logger.ts";

/** This function can be overriden to handle when a command has a mission permission. */
async function missingCommandPermission(
  data: DiscordenoMessage | Interaction,
  missingPermissions: PermissionStrings[],
  type:
    | "framework/core:USER_SERVER_PERM"
    | "framework/core:USER_CHANNEL_PERM"
    | "framework/core:BOT_SERVER_PERM"
    | "framework/core:BOT_CHANNEL_PERM"
) {
  const perms = missingPermissions.join(", ");
  const response =
    type === "framework/core:BOT_CHANNEL_PERM"
      ? `I am missing the following permissions in this channel: **${perms}**`
      : type === "framework/core:BOT_SERVER_PERM"
      ? `I am missing the following permissions in this server from my roles: **${perms}**`
      : type === "framework/core:USER_CHANNEL_PERM"
      ? `You are missing the following permissions in this channel: **${perms}**`
      : `You are missing the following permissions in this server from your roles: **${perms}**`;

  if (missingPermissions.find((perm) => perm === "SEND_MESSAGES" || perm === "VIEW_CHANNEL")) {
    return;
  }

  if (isInteraction(data)) {
    return await sendInteractionResponse(snowflakeToBigint(data.id), data.token, {
      type: InteractionResponseTypes.ChannelMessageWithSource,
      data: {
        content: response,
      },
      private: true,
    }).catch(log.error);
  }

  return await data.reply(response).catch(log.error);
}

bot.inhibitors.set("permissions", async function (data, command) {
  // No permissions are required
  if (
    !command.botChannelPermissions?.length &&
    !command.botServerPermissions?.length &&
    !command.userChannelPermissions?.length &&
    !command.userServerPermissions?.length
  ) {
    return false;
  }

  const guild = cache.guilds.get(isInteraction(data) ? snowflakeToBigint(data.guildId || "") : data.guildId);
  if (!guild) return false;
  const channelId = isInteraction(data) ? snowflakeToBigint(data.channelId || "") : data.channelId;
  const memberId = isInteraction(data) ? snowflakeToBigint(data.member?.user.id || data.user?.id || "") : data.authorId;

  // Check if the data author has the necessary channel permissions to run this command
  if (command.userChannelPermissions?.length) {
    const missingPermissions = await getMissingChannelPermissions(channelId, memberId, command.userChannelPermissions);

    if (missingPermissions.length) {
      missingCommandPermission(data, missingPermissions, "framework/core:USER_CHANNEL_PERM");
      return true;
    }
  }

  const member = guild.members.get(memberId);

  // Check if the data author has the necessary permissions to run this command
  if (member && command.userServerPermissions?.length) {
    const missingPermissions = await getMissingGuildPermissions(guild.id, memberId, command.userServerPermissions);

    if (missingPermissions.length) {
      missingCommandPermission(data, missingPermissions, "framework/core:USER_SERVER_PERM");
      return true;
    }
  }

  // Check if the bot has the necessary channel permissions to run this command in this channel.
  if (command.botChannelPermissions?.length) {
    const missingPermissions = await getMissingChannelPermissions(channelId, botId, command.botChannelPermissions);

    if (missingPermissions.length) {
      missingCommandPermission(data, missingPermissions, "framework/core:BOT_CHANNEL_PERM");
      return true;
    }
  }

  // Check if the bot has the necessary permissions to run this command
  if (command.botServerPermissions?.length) {
    const missingPermissions = await getMissingGuildPermissions(guild.id, botId, command.botServerPermissions);

    if (missingPermissions.length) {
      missingCommandPermission(data, missingPermissions, "framework/core:BOT_CHANNEL_PERM");
      return true;
    }
  }

  return false;
});
