import bot from "../../bot.ts";
import { cache, snowflakeToBigint } from "../../deps.ts";
import { PermissionLevels } from "../types/commands.ts";
import { isInteraction } from "../types/type_guards/is_interaction.ts";

// The member using the command must be an server owner.
bot.permissionLevels.set(PermissionLevels.ServerOwner, (data) => {
  if (isInteraction(data)) {
    if (!data.guildId) return false;

    const guild = cache.guilds.get(snowflakeToBigint(data.guildId));
    if (!guild) return false;

    return guild.ownerId === snowflakeToBigint(data.member?.user.id || "");
  }

  return data.guild?.ownerId === data.authorId;
});
