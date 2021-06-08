import bot from "../../bot.ts";
import { cache, snowflakeToBigint } from "../../deps.ts";
import { isInteraction } from "../types/type_guards/is_interaction.ts";

bot.inhibitors.set("nsfw", function (data, command) {
  // If this command does not need nsfw the inhibitor returns false so the command can run
  if (!command.nsfw) return false;

  // DMs are not considered NSFW channels by Discord so we return true to cancel nsfw commands on dms
  if (!data.guildId) return true;

  return isInteraction(data) ? !cache.channels.get(snowflakeToBigint(data.channelId || ""))?.nsfw : !data.channel?.nsfw;
});
