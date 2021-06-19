import bot from "./bot.ts";
import configs from "./configs.ts";
import { createSlashCommand, startBot, upsertSlashCommand } from "./deps.ts";
import { buildCommands } from "./src/utils/commands.ts";
import { fileLoader, importDirectory } from "./src/utils/file_loader.ts";
import { log } from "./src/utils/logger.ts";

log.info("Beginning Bot Startup Process. This can take a little bit depending on your system. Loading now...");

// Forces deno to read all the files which will fill the commands/inhibitors cache etc.
await Promise.all(
  [
    "./src/commands",
    "./src/inhibitors",
    "./src/events",
    "./src/arguments",
    "./src/monitors",
    "./src/tasks",
    "./src/permission_levels",
  ].map((path) => importDirectory(Deno.realPathSync(path)))
);
await fileLoader();

buildCommands();

startBot({
  token: configs.token,
  eventHandlers: bot.eventHandlers,
  intents: ["Guilds", "GuildMessages"],
});
