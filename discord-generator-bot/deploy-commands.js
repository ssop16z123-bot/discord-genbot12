/**
 * =============================================
 *  SLASH COMMAND DEPLOYMENT SCRIPT
 * =============================================
 * Run this with `npm run deploy` any time you add, remove, or
 * change the definition (name/options/description) of a command.
 *
 * This registers commands as GUILD commands (instant updates, great
 * for development and single-server bots). If you ever need the bot
 * in many servers, switch the route below to:
 *   Routes.applicationCommands(config.CLIENT_ID)
 * Note global commands can take up to an hour to propagate.
 */

const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");
const config = require("./config");

const commands = [];
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter((f) => f.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if (command?.data) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`[DEPLOY] Skipping invalid command file: ${file}`);
  }
}

const rest = new REST().setToken(config.TOKEN);

(async () => {
  try {
    console.log(`[DEPLOY] Deploying ${commands.length} slash command(s)...`);

    await rest.put(Routes.applicationGuildCommands(config.CLIENT_ID, config.GUILD_ID), {
      body: commands,
    });

    console.log("[DEPLOY] ✅ Successfully deployed slash commands.");
  } catch (err) {
    console.error("[DEPLOY] ❌ Failed to deploy commands:", err);
  }
})();
