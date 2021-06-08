import { Milliseconds } from "../types/time.ts";

/** This function should be used when you want to convert milliseconds to a human readable format like 1d5h. */
export function humanizeMilliseconds(milliseconds: number) {
  // Gets ms into seconds
  const time = milliseconds / 1000;
  if (time < 1) return "1s";

  const years = Math.floor(time / 31104000);
  const months = Math.floor((time % 31104000) / 2592000);
  const weeks = Math.floor(((time % 31104000) % 2592000) / 604800);
  const days = Math.floor((((time % 31104000) % 2592000) % 604800) / 86400);
  const hours = Math.floor((((time % 31104000) % 2592000) % 86400) / 3600);
  const minutes = Math.floor(((((time % 31104000) % 2592000) % 86400) % 3600) / 60);
  const seconds = Math.floor(((((time % 31104000) % 2592000) % 86400) % 3600) % 60);

  const yearStrings = years ? `${years}y ` : "";
  const monthStrings = months ? `${months}mo ` : "";
  const weekStrings = weeks ? `${weeks}w ` : "";
  const dayString = days ? `${days}d ` : "";
  const hourString = hours ? `${hours}h ` : "";
  const minuteString = minutes ? `${minutes}m ` : "";
  const secondString = seconds ? `${seconds}s ` : "";

  return `${yearStrings}${weekStrings}${monthStrings}${dayString}${hourString}${minuteString}${secondString}`;
}

/** This function helps convert a string like 1d5h to milliseconds. */
export function stringToMilliseconds(text: string) {
  const matches = text.match(/\d+(y|mo|w|d|m|s){1}/gi);
  if (!matches) return;

  let total = 0;

  for (const match of matches) {
    // Finds the first of these letters
    const validMatch = /(y|mo|w|d|h|m|s)/.exec(match);
    // if none of them were found cancel
    if (!validMatch) return;
    // Get the number which should be before the index of that match
    const number = match.substring(0, validMatch.index);
    // Get the letter that was found
    const [letter] = validMatch;
    if (!number || !letter) return;

    let multiplier = Milliseconds.Second;
    switch (letter.toLowerCase()) {
      case "y":
        multiplier = Milliseconds.Year;
        break;
      case "mo":
        multiplier = Milliseconds.Month;
        break;
      case "w":
        multiplier = Milliseconds.Week;
        break;
      case "d":
        multiplier = Milliseconds.Day;
        break;
      case "h":
        multiplier = Milliseconds.Hour;
        break;
      case "m":
        multiplier = Milliseconds.Minute;
        break;
    }

    const amount = number ? parseInt(number, 10) : undefined;
    if (!amount) return;

    total += amount * multiplier;
  }

  return total;
}
