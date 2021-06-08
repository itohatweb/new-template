import { Language } from "./mod.ts";

const german: Language = {
  // COMMON STRINGS

  MISSING_MEMBER: "Es wurde kein Nutzer gefunden.",
  MISSING_PERM_LEVEL: "Du hast nicht die nötigen Berechtigungen für diesen Befehl.",
  BROKE_DISCORD: "Du hast Discord kaputt gemacht! Glückwunsch! <:blamewolf:814955268123000832>",
  ANSWER: "Antwort",
  NICKNAME: "Nickname",
  CREATED_ON: "Erstellt am",
  JOINED_ON: "Beigetreten am",
  PERMISSIONS: "Rechte",
  USER_ID: "Benutzer ID",
  ROLES: "Rollen",

  // COMMANDS STRINGS

  // Avatar Command
  AVATAR_NAME: "avatar",
  AVATAR_DESCRIPTION: "🖼️ Zeigt den Avatar eines Benutzers oder von dir selbst an.",
  AVATAR_USER_NAME: "Beutzer",
  AVATAR_USER_DESCRIPTION: "Erwähnen einen Benutzer mit @name um den Avatar anzuzeigen.",
  AVATAR_DOWNLOAD_LINK: "🔗 Download Link",

  // Gifs Command
  GIFS_NAME: "gifs",
  GIFS_DESCRIPTION: "Schickt ein zufälliges GIF.",
  GIF_TYPE_NAME: "keyword",
  GIF_TYPE_DESCRIPTION: "Ein keyword für das GIF, z. B. hug, kiss, cuddle, etc...",
  GIFS_INVALID_TYPE: (options) => `Diese Art GIF unterstützen wir nicht. Gültige keywords sind: **${options?.valid}**`,

  // Invite Command
  INVITE_NAME: "invite",
  INVITE_DESCRIPTION: "🔗 Lade den Bot auf deinen Server ein oder hole dir Hilfe vom support Server.",
  INVITE_BOT: "Lade den Bot ein.",
  INVITE_NEED_SUPPORT: "Brauchst du Hilfe?",

  // Language Command
  LANGUAGE_NAME: "Sprache",
  LANGUAGE_DESCRIPTION: "⚙️ Ändere die Sprache des Bots.",
  LANGUAGE_KEY_NAME: "name",
  LANGUAGE_KEY_DESCRIPTION: "Auf welche Sprache möchtest du wechseln?",
  LANGUAGE_MISSING_KEY: "Es wurde keine Ausgabesprache angegeben.",
  LANGUAGE_INVALID_KEY: (options) =>
    `Ich konnte die Sprache nicht finden. Gültige Sprachen sind: ${options?.languages.join(" ") || "english"}`,
  LANGUAGE_UPDATED: (options) => `Die Sprache wurde auf ${options?.language} geändert!`,

  // Ping Command
  PING_NAME: "ping",
  PING_DESCRIPTION: "🏓 Prüfe die Reaktionszeit des Bots und ob er online ist.",
  PING_RESPONSE: "🏓 Pong! Ich bin online! :clock10:",

  // Info Command
  INFO_USER_NAME: "Benutzer",
  INFO_USER_DESCRIPTION: "Erhalte die Info eines Benutzers",
  INFO_SERVER_NAME: "Server",
  INFO_SERVER_DESCRIPTION: "Erhalte die Info dieses Servers",
  INFO_ADMIN: "Administrator",

  // Random Command
  RANDOM_NAME: "random",
  RANDOM_DESCRIPTION: "🔢 Wähle oder sende eine zufällige Nummer oder stelle 8ball eine Frage.",
  RANDOM_NUMBER_TYPE_NAME: "number",
  RANDOM_NUMBER_TYPE_DESCRIPTION: "🔢 Wähle eine zufällige Nummer.",
  RANDOM_NUMBER_MIN_NAME: "minimum",
  RANDOM_NUMBER_MIN_DESCRIPTION: "🔢 Die zufällige Nummer wird höher als dieses minimum sein.",
  RANDOM_NUMBER_MAX_NAME: "maximum",
  RANDOM_NUMBER_MAX_DESCRIPTION: "🔢 Die zufällige Nummer wird niedriger als dieses maximum sein.",
  RANDOM_8BALL_NAME: "8ball",
  RANDOM_8BALL_DESCRIPTION: "🔮 Erhalte Antworten auf deine Fragen!",
  RANDOM_8BALL_QUESTION_NAME: "question",
  RANDOM_8BALL_QUESTION_DESCRIPTION: "🔮 Welche Frage möchtest du stellen?",
  RANDOM_ADVICE_NAME: "advice",
  RANDOM_ADVICE_DESCRIPTION: "🗨️ Erhalte einen zufälligen Ratschlag oder Weisheit.",
  RANDOM_ADVICE_QUOTES: [
    "Eigenlob stinkt, Freundes Lob hinkt, Fremdes Lob klingt.",
    "Ein Lächeln ist die schönste Sprache der Welt.",
    "Worten sollten Taten folgen.",
    "Was du nicht willst, dass man dir tu', das füg' auch keinem andern zu.",
    "Wer den Pfennig nicht ehrt, ist des Talers nicht wert.",
    "Man beißt nicht die Hand, die einen füttert.",
    "Reden ist Silber, Schweigen ist Gold.",
    "Sage nicht immer, was du weißt, aber wisse immer, was du sagst.",
    "Wer einmal lügt, dem glaubt man nicht, und wenn er auch die Wahrheit spricht.",
    "Ein reines Gewissen ist ein sanftes Ruhekissen.",
    "Ein jeder ist seines Glückes Schmied.",
    "Einsicht ist der erste Weg zur Besserung.",
    "Man muss die Suppe auslöffeln, die man sich eingebrockt hat.",
    "Es ist noch kein Meister vom Himmel gefallen.",
    "Wer keine Freude an der Welt hat, an dem hat die Welt auch keine Freude.",
    "Fröhliche Menschen sind nicht bloß glücklich, sondern in der Regel auch gute Menschen.",
    "Mit Kummer kann man allein fertig werden, aber um sich aus vollem Herzen freuen zu können, muss man die Freude teilen.",
    "Die Lebensspanne ist die selbe, ob man sie lachend oder weinend verbringt.",
    "Die Summe unseres Lebens sind die Stunden, in denen wir liebten.",
    "Träume nicht dein Leben, sondern lebe deine Träume.",
    "Mit dem Leben ist es wie mit einem Theaterstück, es kommt nicht darauf an wie lange es dauert, sondern wie bunt es ist.",
    "Am Ende gilt doch nur, was wir getan und gelebt, und nicht was wir ersehnt haben.",
    "Nur wer die Kunst des Vergessens erlernte, hat Lebenskunst gelernt.",
    "Man muss lernen, Schmerz und Enttäuschung als Teil des Lebens zu akzeptieren.",
  ].join("\n"),
  RANDOM_8BALL_QUOTES: [
    "Aber sowas von!",
    "Ja!",
    "Definitiv.",
    "Wahrscheinlich.",
    "Höchst wahrscheinlich.",
    "Eventuell.",
    "Unwahrscheinlich.",
    "Ich würde nicht darauf wetten.",
    "Nein!",
    "Definitiv nicht!",
    "Nope!",
    "Niemals!",
  ].join("\n"),
};

export default german;
