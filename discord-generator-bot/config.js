require("dotenv").config();

module.exports = {
  TOKEN: process.env.TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID,
  OWNER_ID: process.env.OWNER_ID,
  GEN_ROLE_ID: process.env.GEN_ROLE_ID,
  LOG_CHANNEL_ID: process.env.LOG_CHANNEL_ID,

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
