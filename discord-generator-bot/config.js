/**
 * =============================================
 *  CONFIGURATION FILE
 * =============================================
 * Fill in every value below before starting the bot.
 *
 * SECURITY NOTE: This file contains your bot token. Never commit it
 * to a public repository or share it with anyone. The included
 * .gitignore already excludes this file from git.
 */

module.exports = {
  // Your Discord bot token (Discord Developer Portal -> Bot -> Token)
  TOKEN: "YOUR_BOT_TOKEN_HERE",

  // Your bot's Application ID (Discord Developer Portal -> General Information)
  CLIENT_ID: "YOUR_CLIENT_ID_HERE",

  // The server (guild) ID to register slash commands to.
  // Guild-scoped commands update almost instantly, which is ideal for this bot.
  GUILD_ID: "YOUR_GUILD_ID_HERE",

  // The Discord User ID of the bot owner.
  // The owner automatically bypasses role checks AND cooldowns everywhere.
  OWNER_ID: "YOUR_USER_ID_HERE",

  // The role ID allowed to use /gen by default.
  // Additional roles can be granted access at runtime via /addgenrole
  // without touching this file or restarting the bot.
  GEN_ROLE_ID: "YOUR_GEN_ROLE_ID_HERE",

  // The channel ID where every generation will be logged.
  LOG_CHANNEL_ID: "YOUR_LOG_CHANNEL_ID_HERE",

  // Default cooldown between generations, in MINUTES, applied per user.
  COOLDOWN_TIME: 30,

  // ---------------------------------------------
  // EMBED STYLING — tweak these to match your server's branding
  // ---------------------------------------------
  COLORS: {
    SUCCESS: 0x57f287, // green
    ERROR: 0xed4245, // red
    INFO: 0x5865f2, // blurple
    MAIN: 0x2b2d31, // dark neutral, used for the generated account DM
  },

  EMBED_FOOTER: {
    text: "Generator Bot • All Rights Reserved",
    iconURL: null, // optional, e.g. "https://yourcdn.com/icon.png"
  },

  EMBED_AUTHOR: {
    name: "Generator System",
    iconURL: null, // optional
  },
};
