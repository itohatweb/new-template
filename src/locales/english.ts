import { Language } from "./mod.ts";

const english: Language = {
  // COMMON STRINGS

  ANSWER: "Answer",
  BROKE_DISCORD: "You just broke Discord! Congrats!",
  MISSING_MEMBER: "No member was found.",
  MISSING_PERM_LEVEL: "You do not have the necessary permissions to use this command.",
  NICKNAME: "Nickname",
  CREATED_ON: "Created On",
  JOINED_ON: "Joined On",
  PERMISSIONS: "Permissions",
  USER_ID: "User ID",
  ROLES: "Roles",
  USER_NOT_ADMIN: "You do not have the necessary permissions. You must be an administrator.",

  // COMMANDS STRINGS

  // Avatar Command
  AVATAR_NAME: "avatar",
  AVATAR_DESCRIPTION: "🖼️ Shows the avatar of a user or yourself.",
  AVATAR_USER_NAME: "user",
  AVATAR_USER_DESCRIPTION: "Provide a @user to view their avatar.",
  AVATAR_DOWNLOAD_LINK: "🔗 Download Link",

  // Gifs Command
  GIFS_NAME: "gifs",
  GIFS_DESCRIPTION: "Sends a random gif.",
  GIF_TYPE_NAME: "type",
  GIF_TYPE_DESCRIPTION: "The type of gif such as hug, kiss, cuddle, etc...",
  GIFS_INVALID_TYPE: (options) => `This type of gif is not available. The valid types are: **${options?.types}**`,

  // Invite Command
  INVITE_NAME: "invite",
  INVITE_DESCRIPTION: "🔗 Invite the bot to your server or get help in the support server.",
  INVITE_BOT: "Invite The Bot",
  INVITE_NEED_SUPPORT: "Need Help?",

  // Language Command
  LANGUAGE_NAME: "language",
  LANGUAGE_DESCRIPTION: "⚙️ Change the bots language.",
  LANGUAGE_KEY_NAME: "name",
  LANGUAGE_KEY_DESCRIPTION: "What language would you like to set?",
  LANGUAGE_MISSING_KEY: "No language was provided.",
  LANGUAGE_INVALID_KEY: (options) =>
    `I could not find a language with that name. Valid languages are: ${options?.languages.join(" ") || "english"}`,
  LANGUAGE_UPDATED: (options) => `The language has been updated to ${options?.name}`,

  // Ping Command
  PING_NAME: "ping",
  PING_DESCRIPTION: "🏓 Check whether the bot is online and responsive.",
  PING_RESPONSE: "🏓 Pong! I am online and responsive! :clock10:",

  // Info Command
  INFO_NAME: "info",
  INFO_USER_NAME: "user",
  INFO_USER_DESCRIPTION: "Get the info of an user",
  INFO_SERVER_NAME: "server",
  INFO_SERVER_DESCRIPTION: "Get the info of this server",
  INFO_ADMIN: "Administrator",

  // Random Command
  RANDOM_NAME: "random",
  RANDOM_DESCRIPTION: "🔢 Pick a random number, send a random advice or ask 8ball a random question.",
  RANDOM_NUMBER_TYPE_NAME: "number",
  RANDOM_NUMBER_TYPE_DESCRIPTION: "🔢 Pick a random number",
  RANDOM_NUMBER_MIN_NAME: "minimum",
  RANDOM_NUMBER_MIN_DESCRIPTION: "🔢 The random number will be higher than this minimum.",
  RANDOM_NUMBER_MAX_NAME: "maximum",
  RANDOM_NUMBER_MAX_DESCRIPTION: "🔢 The random number will be lower than this maximum.",
  RANDOM_8BALL_NAME: "8ball",
  RANDOM_8BALL_DESCRIPTION: "🔮 Get answers to your questions!",
  RANDOM_8BALL_QUESTION_NAME: "question",
  RANDOM_8BALL_QUESTION_DESCRIPTION: "🔮 What question would you like to ask?",
  RANDOM_ADVICE_NAME: "advice",
  RANDOM_ADVICE_DESCRIPTION: "🗨️ Receive random advice in the chat.",
  RANDOM_ADVICE_QUOTES: [
    "**Take time to know yourself.** `Know thyself` said Aristotle. When you know who you are, you can be wise about your goals, your dreams, your standards, your convictions. Knowing who you are allows you to live your life with purpose and meaning.",
    "**A narrow focus brings big results.** The number one reason people give up so fast is because they tend to look at how far they still have to go instead of how far they have come. But it's a series of small wins that can give us the most significant success.",
    "**Show up fully.** Don't dwell on the past, and don't daydream about the future, but concentrate on showing up fully in the present moment.",
    "**Don't make assumptions.** If you don't know the situation fully, you can't offer an informed opinion.",
    "**Be patient and persistent.** Life is not so much what you accomplish as what you overcome.",
    "**In order to get, you have to give.** If you support, guide, and lead others, if you make contributions to their lives, you will reap the best rewards.",
    "**Luck comes from hard work.** Luck happens when hard work and timing and talent intersect.",
    "**Be your best at all times.** You never know what the future will bring, so always make the best use of the present.",
    "**Don't try to impress everyone.** The unhappiest people are those who care the most about what other people think.",
    "**Don't be afraid of being afraid.** Sometimes the one thing you need for growth is the one thing you are most afraid to do.",
    "**Listen to learn. Learn how to listen.** You can't learn anything when you're talking.",
    "**Life's good, but it's not fair.** The delusion that life's supposed to be fair is the source of much unhappiness.",
    "**No task is beneath you.** Don't put yourself above anyone or anything; work hard in silence and let success make the noise.",
    "**You can't always get what you want.** But, as the song says, if you try you may find you get what you need.",
    "**Don't make decisions when you are angry or ecstatic.** The best decisions are made with a clear conscious mind, not in the throes of any emotion - positive or negative.",
    "**Don't worry what other people think.** Personality begins where comparison leaves off. Be unique. Be memorable. Be confident. Be proud.",
    "**Use adversity as an opportunity.** Every loss leads to an opportunity, and every adversity leads to new possibilities.",
    "**Do what is right, not what is easy.** Strength of character leads us to do the right thing, even when there are easier options.",
    "**Dreams remain dreams until you take action.** Without action, an idea is just a dream.",
    "**Treat others the way you want to be treated.** Do right. Do your best. Treat others as you would want them to treat you.",
    "**When you quit, you fail.** The surest way to lose at any endeavor is to quit. But fatigue, discomfort, and discouragement are merely symptoms of effort.",
    "**Trust your instincts.** What good is intuition if you let second-guessing drown it out? The worst enemy of success is self-doubt.",
    "**Learn something new every day.** Have the mindset of a student. Never think you are too old to ask questions or know too much to learn something new.",
    "**Make what is valuable important.** Instead of thinking about what is profitable, think about what is valuable. Invest in others and you will grow your portfolio.",
    "**Believe in yourself.** The way you see yourself is the way you will treat yourself, and the way you treat yourself is what you become.",
    "**Don’t look at the calendar.** Just keep celebrating every day.",
    "**Invest in quality pieces,** they never go out of style.",
    "**I make myself go out every day,** even if it’s only to walk around the block. The key to staying young is to keep moving.",
  ].join("\n"),
  RANDOM_8BALL_QUOTES: [
    "Totally!",
    "Yes!",
    "Definitely!",
    "Probably.",
    "Very likely.",
    "Likely.",
    "Unlikely.",
    "I wouldn't count on it.",
    "No!",
    "Definitely not!",
    "Nope!",
    "No way!",
  ].join("\n"),
};

export default english;
