const { ActivityType } = require("discord.js");

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    console.log(`[READY] Logged in as ${client.user.tag}`);

    client.user.setPresence({
      activities: [{ name: "Generating accounts | /gen", type: ActivityType.Watching }],
      status: "online",
    });
  },
};
