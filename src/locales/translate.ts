import bot from "../../bot.ts";
import { snowflakeToBigint } from "../../deps.ts";
import languages from "./mod.ts";

export function translate(guildId: bigint | string, key: string, args?: Record<string, unknown>): string {
  const language =
    bot.serverLanguages.get(typeof guildId === "string" ? snowflakeToBigint(guildId) : guildId) || "english";
  let value = languages[language][key];

  if (Array.isArray(value)) return value.join("\n");

  if (typeof value === "function") return value(args);
  // Was not able to be translated
  if (!value) {
    // Check if this key is available in english
    if (language !== "english") {
      value = languages.english[key];
    }

    // Still not found in english so default to using the KEY_ITSELF
    if (!value) value = key;
  }

  return value as string;
}

export default translate;
