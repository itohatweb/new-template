import { PermissionLevels } from "../types/commands.ts";
import { hasGuildPermissions } from "../../deps.ts";
import bot from "../../bot.ts";

// The member using the command must be a moderator. (Usually has MANAGE_GUILD perm)
bot.permissionLevels.set(PermissionLevels.Moderator, (data) => {
  if (!data.guildId || !data.user.id) return false;

  return hasGuildPermissions(data.guildId, data.user.id, ["MANAGE_GUILD"]);
});
