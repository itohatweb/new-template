import {
  DiscordInteractionResponseTypes,
  DiscordInteractionTypes,
  sendInteractionResponse,
  snowflakeToBigint,
} from "../../deps.ts";
import { bot } from "../../bot.ts";
import { executeCommand } from "../utils/slash_commands.ts";

bot.eventHandlers.interactionCreate = function (data) {
  // A SLASH COMMAND WAS USED
  if (data.type === DiscordInteractionTypes.ApplicationCommand) {
    executeCommand(data);
  }

  // TODO: add button collectors
  // A BUTTON WAS CLICKED
  // if (data.type === DiscordInteractionTypes.Button) {
  //   processButtonCollectors(data, member);
  // }

  // TODO: add dropdown collectors?
};
