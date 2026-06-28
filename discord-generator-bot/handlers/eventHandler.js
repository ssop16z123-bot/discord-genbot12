const fs = require("fs");
const path = require("path");

/**
 * Loads every event file inside /events and binds it to the client.
 * Each event file must export { name, execute, once? }.
 */
function loadEvents(client) {
  const eventsPath = path.join(__dirname, "..", "events");
  const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    delete require.cache[require.resolve(filePath)];
    const event = require(filePath);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }

  console.log(`[EVENT HANDLER] Loaded ${eventFiles.length} event(s).`);
}

module.exports = loadEvents;
