import { bot } from "../../bot.ts";
import { log } from "../utils/logger.ts";

bot.eventHandlers.ready = function () {
  log.info("The bot is online");
};
