import { DiscordenoMessage, Interaction } from "../../../deps.ts";

/** A type guard function to tell if it is a button component */
export function isInteraction(data: DiscordenoMessage | Interaction): data is Interaction {
  return Reflect.has(data, "token");
}
