import {
  DiscordInteractionResponseTypes,
  DiscordInteractionTypes,
  sendInteractionResponse,
  snowflakeToBigint,
} from "../../deps.ts";
import { bot } from "../../bot.ts";
import { executeCommand } from "../utils/slash_commands.ts";

bot.eventHandlers.interactionCreate = function (data, member) {
  // A SLASH COMMAND WAS USED
  if (data.type === DiscordInteractionTypes.ApplicationCommand) {
    // const command = data.data?.name ? bot.commands.get(data.data.name) : undefined;
    // if (!command) return;

    // command?.execute(data, member);

    executeCommand(data);
  }

  // TODO: add button collectors
  // A BUTTON WAS CLICKED
  // if (data.type === DiscordInteractionTypes.Button) {
  //   processButtonCollectors(data, member);
  // }
};
