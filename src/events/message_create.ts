import bot from "../../bot.ts";
import {
  botId,
  DiscordChannelTypes,
  hasChannelPermissions,
  hasGuildPermissions,
  botHasChannelPermissions,
  botHasGuildPermissions,
} from "../../deps.ts";

// deno-lint-ignore require-await
bot.eventHandlers.messageCreate = async function (message) {
  bot.monitors.forEach(async (monitor) => {
    // The !== false is important because when not provided we default to true
    if (monitor.ignoreBots !== false && message.isBot) return;

    if (monitor.ignoreDM !== false && message.channel?.type === DiscordChannelTypes.DM) {
      return;
    }

    if (monitor.ignoreEdits && message.editedTimestamp) return;
    if (monitor.ignoreOthers && message.authorId !== botId) return;

    // Permission checks

    // No permissions are required
    if (
      !monitor.botChannelPermissions?.length &&
      !monitor.botServerPermissions?.length &&
      !monitor.userChannelPermissions?.length &&
      !monitor.userServerPermissions?.length
    ) {
      return monitor.execute(message);
    }

    // If some permissions is required it must be in a guild
    if (!message.guildId) return;

    const member = message.member;
    if (!member) return;

    const permissionCheckResults = await Promise.all([
      // Check if the message author has the necessary channel permissions to run this monitor
      monitor.userChannelPermissions
        ? hasChannelPermissions(message.channelId, member, monitor.userChannelPermissions)
        : undefined,
      // Check if the message author has the necessary guild permissions to run this monitor
      monitor.userServerPermissions
        ? hasGuildPermissions(message.guildId, member, monitor.userServerPermissions)
        : undefined,
      // Check if the bot has the necessary channel permissions to run this monitor in this channel.
      monitor.botChannelPermissions
        ? botHasChannelPermissions(message.channelId, monitor.botChannelPermissions)
        : undefined,
      // Check if the bot has the necessary guild permissions to run this monitor
      monitor.botServerPermissions ? botHasGuildPermissions(message.guildId, monitor.botServerPermissions) : undefined,
    ]);

    if (permissionCheckResults.includes(false)) return;

    return monitor.execute(message);
  });
};
