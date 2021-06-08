import english from "./english.ts";
import german from "./german.ts";

const languages: Record<string, Language> = {
  english,
  german,
};

export default languages;

export type Language = Record<
  string,
  // deno-lint-ignore no-explicit-any
  string | string[] | ((options?: Record<string, any>) => string)
>;
