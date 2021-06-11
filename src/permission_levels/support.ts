import { configs } from "../../configs.ts";
import bot from "../../bot.ts";
import { PermissionLevels } from "../types/commands.ts";

// The member using the command must be one of the bots support team
bot.permissionLevels.set(PermissionLevels.BotSupporter, (data) => configs.userIds.botSupporters.includes(data.user.id));
