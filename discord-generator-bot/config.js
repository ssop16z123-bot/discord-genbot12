module.exports = {
  TOKEN: process.env.TOKEN || "YOUR_BOT_TOKEN_HERE",
  CLIENT_ID: process.env.CLIENT_ID || "YOUR_CLIENT_ID_HERE",
  GUILD_ID: process.env.GUILD_ID || "YOUR_GUILD_ID_HERE",
  OWNER_ID: process.env.OWNER_ID || "YOUR_USER_ID_HERE",
  GEN_ROLE_ID: process.env.GEN_ROLE_ID || "YOUR_GEN_ROLE_ID_HERE",
  LOG_CHANNEL_ID: process.env.LOG_CHANNEL_ID || "YOUR_LOG_CHANNEL_ID_HERE",

  COOLDOWN_TIME: Number(process.env.COOLDOWN_TIME) || 30,

  COLORS: {
    SUCCESS: 0x57f287,
    ERROR: 0xed4245,
    INFO: 0x5865f2,
    MAIN: 0x2b2d31,
  },

  EMBED_FOOTER: {
    text: "Generator Bot • All Rights Reserved",
    iconURL: null,
  },

  EMBED_AUTHOR: {
    name: "Generator System",
    iconURL: null,
  },
};
