import { ApplicationCommandOption, ApplicationCommandOptionTypes } from "../../deps.ts";

export interface Argument {
  // TODO: consider using strings like "number" | "member" for better ux
  /** The type of the argument. */
  type: ApplicationCommandOptionTypes;
  execute(option: ApplicationCommandOption, data: string[]): unknown;
}
