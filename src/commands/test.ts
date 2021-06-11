import { DiscordApplicationCommandOptionTypes } from "../../deps.ts";
import { createCommand } from "../utils/commands.ts";

createCommand({
  name: "test",
  options: [
    {
      type: DiscordApplicationCommandOptionTypes.Boolean,
      name: "bools",
      description: "some test",
      // required: true,
    },
    {
      type: DiscordApplicationCommandOptionTypes.Channel,
      name: "channelones",
      description: "some test",
      required: false,
    },
    {
      type: DiscordApplicationCommandOptionTypes.Integer,
      name: "numberus",
      description: "some test",
      // required: false,
    },
    {
      type: DiscordApplicationCommandOptionTypes.User,
      name: "user",
      description: "some test",
      required: true,
    },
  ] as const,
  async execute(data, args) {
    const foo = args.user;
    return await data.reply("FOO");
  },
});
