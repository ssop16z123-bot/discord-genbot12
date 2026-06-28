/**
 * =============================================
 *  ENTRY POINT
 * =============================================
 * Boots the Discord client, ensures storage folders exist,
 * loads commands & events, then logs in.
 */

const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const loadCommands = require("./handlers/commandHandler");
const loadEvents = require("./handlers/eventHandler");

// Only the intents we actually need.
// "Guilds" is enough — slash commands deliver their data directly in the
// interaction payload, and sending DMs doesn't require any extra intent.
const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

// Collection that holds all loaded slash commands: name -> command module
client.commands = new Collection();

// Make sure every folder the bot relies on exists before anything runs.
// This means a fresh clone of the project works with zero manual setup.
const requiredDirs = ["stocks", "cooldowns", "logs", "data"];
for (const dir of requiredDirs) {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`[SETUP] Created missing directory: /${dir}`);
  }
}

loadCommands(client);
loadEvents(client);

client.login(config.TOKEN).catch((err) => {
  console.error("[FATAL] Failed to log in. Double-check TOKEN in config.js");
  console.error(err);
  process.exit(1);
});

// Global safety nets so one bad promise/error never crashes the whole bot.
process.on("unhandledRejection", (err) => {
  console.error("[UNHANDLED REJECTION]", err);
});
process.on("uncaughtException", (err) => {
  console.error("[UNCAUGHT EXCEPTION]", err);
});

module.exports = client;
