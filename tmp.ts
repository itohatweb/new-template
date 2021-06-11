import { ArgumentsParser } from "https://deno.land/x/arguments_parser/mod.ts";

const parser = new ArgumentsParser({
  message: {
    names: ["-m", "--message"],
    parser: String,
  },
});
const args = parser.parseArgs("-m 'foo bar'".split(" "));
console.log(args);
