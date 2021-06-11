import { DiscordApplicationCommandOptionTypes } from "../../deps.ts";
import { createCommand } from "../utils/commands.ts";

createCommand({
  name: "test",
  options: [
    {
      type: DiscordApplicationCommandOptionTypes.Mentionable,
      name: "mention",
      description: "some test",
      required: true,
    },
  ] as const,
  async execute(data, args) {
    console.log(args.mention);
    return await data.reply("FOO");
  },
});
