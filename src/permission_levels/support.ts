import { configs } from "../../configs.ts";
import bot from "../../bot.ts";
import { PermissionLevels } from "../types/commands.ts";
import { isInteraction } from "../types/type_guards/is_interaction.ts";
import { snowflakeToBigint } from "../../deps.ts";

// The member using the command must be one of the bots support team
bot.permissionLevels.set(PermissionLevels.BotSupporter, (data) =>
  configs.userIds.botSupporters.includes(
    isInteraction(data) ? snowflakeToBigint(data.member?.user?.id || "") : data.authorId
  )
);
