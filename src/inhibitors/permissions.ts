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
import { CommandInfo } from "../utils/command_info.ts";

/** This function can be overriden to handle when a command has a mission permission. */
async function missingCommandPermission(
  data: CommandInfo,
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

  const guild = cache.guilds.get(data.guildId);
  const channel = cache.channels.get(data.channelId);
  const member = cache.members.get(data.user.id);
  if (!guild || !channel || !member) return false;

  // Check if the data author has the necessary channel permissions to run this command
  if (command.userChannelPermissions?.length) {
    const missingPermissions = await getMissingChannelPermissions(channel, member, command.userChannelPermissions);

    if (missingPermissions.length) {
      missingCommandPermission(data, missingPermissions, "framework/core:USER_CHANNEL_PERM");
      return true;
    }
  }

  // Check if the data author has the necessary permissions to run this command
  if (command.userServerPermissions?.length) {
    const missingPermissions = await getMissingGuildPermissions(guild, member, command.userServerPermissions);

    if (missingPermissions.length) {
      missingCommandPermission(data, missingPermissions, "framework/core:USER_SERVER_PERM");
      return true;
    }
  }

  // Check if the bot has the necessary channel permissions to run this command in this channel.
  if (command.botChannelPermissions?.length) {
    const missingPermissions = await getMissingChannelPermissions(channel, botId, command.botChannelPermissions);

    if (missingPermissions.length) {
      missingCommandPermission(data, missingPermissions, "framework/core:BOT_CHANNEL_PERM");
      return true;
    }
  }

  // Check if the bot has the necessary permissions to run this command
  if (command.botServerPermissions?.length) {
    const missingPermissions = await getMissingGuildPermissions(guild, botId, command.botServerPermissions);

    if (missingPermissions.length) {
      missingCommandPermission(data, missingPermissions, "framework/core:BOT_CHANNEL_PERM");
      return true;
    }
  }

  return false;
});
