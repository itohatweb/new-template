import { PermissionLevels } from "../types/commands.ts";
import { hasGuildPermissions, snowflakeToBigint } from "../../deps.ts";
import bot from "../../bot.ts";
import { isInteraction } from "../types/type_guards/is_interaction.ts";

// The member using the command must be a moderator. (Usually has MANAGE_GUILD perm)
bot.permissionLevels.set(PermissionLevels.Moderator, (data) => {
  const guildId = isInteraction(data) ? snowflakeToBigint(data.guildId || "") : data.guildId;
  const memberId = isInteraction(data) ? snowflakeToBigint(data.member?.user.id || "") : data.authorId;

  if (!guildId || !memberId) return false;

  return hasGuildPermissions(guildId, memberId, ["MANAGE_GUILD"]);
});
