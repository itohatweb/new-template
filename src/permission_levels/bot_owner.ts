import { configs } from "../../configs.ts";
import bot from "../../bot.ts";
import { PermissionLevels } from "../types/commands.ts";
import { snowflakeToBigint } from "../../deps.ts";
import { isInteraction } from "../types/type_guards/is_interaction.ts";

// The member using the command must be one of the bots dev team
bot.permissionLevels.set(PermissionLevels.BotOwner, (data) =>
  configs.userIds.botOwners.includes(
    isInteraction(data) ? snowflakeToBigint(data.member?.user?.id || "") : data.authorId
  )
);
