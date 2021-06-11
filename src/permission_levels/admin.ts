import { hasGuildPermissions } from "../../deps.ts";
import { PermissionLevels } from "../types/commands.ts";
import bot from "../../bot.ts";

// The member using the command must be an admin. (Required ADMIN server perm.)
bot.permissionLevels.set(PermissionLevels.Admin, (data) => {
  if (!data.guildId || !data.user.id) return false;

  return hasGuildPermissions(data.guildId, data.user.id, ["ADMINISTRATOR"]);
});
