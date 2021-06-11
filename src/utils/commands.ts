import { bgYellow, black, bgBlack, red, green, white, bgGreen, bgMagenta, cache } from "../../deps.ts";
import { CommandInfo } from "./command_info.ts";
import { log } from "./logger.ts";

export function logCommand(
  info: CommandInfo,
  type: "Failure" | "Success" | "Trigger" | "Slowmode" | "Missing" | "Inhibit",
  commandName: string
) {
  const command = `[COMMAND: ${bgYellow(black(commandName || "Unknown"))} - ${bgBlack(
    ["Failure", "Slowmode", "Missing"].includes(type) ? red(type) : type === "Success" ? green(type) : white(type)
  )}]`;

  // TODO: pretty log - NAME - ID
  const user = bgGreen(
    black(`${info.user.username}#${info.user.discriminator.toString().padStart(4, "0")}(${info.id})`)
  );
  const guild = bgMagenta(
    black(`${cache.guilds.get(info.guildId)?.name || "DM"}${info.guildId ? `(${info.guildId})` : ""}`)
  );

  log.info(`${command} by ${user} in ${guild} with MessageID: ${info.id}`);
}
