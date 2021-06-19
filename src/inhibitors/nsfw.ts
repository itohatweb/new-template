import bot from "../../bot.ts";
import { cache } from "../../deps.ts";

bot.inhibitors.set("nsfw", function (data, command) {
  // If this command does not need nsfw the inhibitor returns false so the command can run
  if (!command.nsfw) return false;

  // DMs are not considered NSFW channels by Discord so we return true to cancel nsfw commands on dms
  if (!data.guildId) return true;

  return !cache.channels.get(data.channelId)?.nsfw;
});
