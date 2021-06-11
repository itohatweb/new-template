import configs from "./configs.ts";
import { startBot } from "./deps.ts";

startBot({
  token: configs.token,
  intents: ["Guilds", "GuildMessages"],
  eventHandlers: {
    ready() {
      console.log("READY");
    },
    messageCreate(message) {
      console.log(message);
    },
  },
});
