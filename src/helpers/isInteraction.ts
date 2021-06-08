import { Interaction, DiscordenoMessage } from "../../deps.ts";

/** A type guard function to tell if it is a action row component */
export function isInteraction(data: Interaction | DiscordenoMessage): data is Interaction {
  return Reflect.has(data, "token");
}
