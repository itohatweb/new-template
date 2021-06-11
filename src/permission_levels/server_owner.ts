import bot from "../../bot.ts";
import { cache } from "../../deps.ts";
import { PermissionLevels } from "../types/commands.ts";

// The member using the command must be an server owner.
bot.permissionLevels.set(PermissionLevels.ServerOwner, (data) => {
  const guild = cache.guilds.get(data.guildId);
  if (!guild) return false;

  return guild.ownerId === data.user.id;
});
