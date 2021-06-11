import { configs } from "../../configs.ts";
import bot from "../../bot.ts";
import { PermissionLevels } from "../types/commands.ts";

// The member using the command must be one of the bots dev team
bot.permissionLevels.set(PermissionLevels.BotDev, (data) => configs.userIds.botDevs.includes(data.user.id));
