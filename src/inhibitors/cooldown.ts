import bot from "../../bot.ts";
import { InteractionResponseTypes, sendInteractionResponse, snowflakeToBigint } from "../../deps.ts";
import { isInteraction } from "../types/type_guards/is_interaction.ts";
import { log } from "../utils/logger.ts";
import { humanizeMilliseconds } from "../utils/time.ts";

const membersInCooldown = new Map<string, Cooldown>();

export interface Cooldown {
  used: number;
  timestamp: number;
}

bot.inhibitors.set("cooldown", async function (data, command) {
  if (!command.cooldown) return false;

  const key = `${data.user.id}-${command.name}`;
  const cooldown = membersInCooldown.get(key);
  if (cooldown) {
    if (cooldown.used >= (command.cooldown.allowedUses || 1)) {
      const now = Date.now();
      if (cooldown.timestamp > now) {
        if (isInteraction(data)) {
          await sendInteractionResponse(snowflakeToBigint(data.id), data.token, {
            type: InteractionResponseTypes.DeferredChannelMessageWithSource,
            data: {
              content: `Hey, you are on cooldown please wait another **${humanizeMilliseconds(
                cooldown.timestamp - now
              )}** until you can use the command again`,
            },
          }).catch(log.error);

          return true;
        }

        await data
          .reply(
            `Hey, you are on cooldown please wait another **${humanizeMilliseconds(
              cooldown.timestamp - now
            )}** until you can use the command again`
          )
          .catch(console.error);

        return true;
      }

      cooldown.used = 0;
    }

    membersInCooldown.set(key, {
      used: cooldown.used + 1,
      timestamp: Date.now() + command.cooldown.seconds * 1000,
    });
    return false;
  }

  membersInCooldown.set(key, {
    used: 1,
    timestamp: Date.now() + command.cooldown.seconds * 1000,
  });
  return false;
});

setInterval(() => {
  const now = Date.now();

  membersInCooldown.forEach((cooldown, key) => {
    if (cooldown.timestamp > now) return;
    membersInCooldown.delete(key);
  });
}, 30000);
