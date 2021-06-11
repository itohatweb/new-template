import { configs } from "../../configs.ts";
import bot from "../../bot.ts";
import { PermissionLevels } from "../types/commands.ts";

// The member using the command must be one of the bots dev team
bot.permissionLevels.set(PermissionLevels.BotOwner, (data) => configs.userIds.botOwners.includes(data.user.id));
