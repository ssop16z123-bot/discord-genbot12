const fs = require("fs");
const path = require("path");

/**
 * Loads every command file inside /commands into client.commands.
 * Each command file must export at minimum { data, execute }.
 * Optionally a command can export { ownerOnly, autocomplete }.
 *
 * Re-runnable: the require cache is cleared first so this also
 * powers the /reload command without needing to restart the process.
 */
function loadCommands(client) {
  const commandsPath = path.join(__dirname, "..", "commands");
  client.commands.clear();

  const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);

    // Clear require cache so edited files are picked up on /reload
    delete require.cache[require.resolve(filePath)];

    const command = require(filePath);

    if (!command?.data || !command?.execute) {
      console.warn(`[COMMAND HANDLER] Skipping invalid command file: ${file}`);
      continue;
    }

    client.commands.set(command.data.name, command);
  }

  console.log(`[COMMAND HANDLER] Loaded ${client.commands.size} command(s).`);
}

module.exports = loadCommands;
