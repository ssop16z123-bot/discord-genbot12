const fs = require("fs");
const path = require("path");
const config = require("../config");
const { baseEmbed } = require("./embeds");

const LOGS_DIR = path.join(__dirname, "..", "logs");
if (!fs.existsSync(LOGS_DIR)) fs.mkdirSync(LOGS_DIR, { recursive: true });

/** Appends a single line to logs/generations.txt — a permanent flat-file audit trail. */
function logToFile(line) {
  const filePath = path.join(LOGS_DIR, "generations.txt");
  const timestamp = new Date().toISOString();
  fs.appendFileSync(filePath, `[${timestamp}] ${line}\n`, "utf-8");
}

/**
 * Logs a successful generation both to disk and to the configured
 * Discord log channel as a formatted embed.
 */
async function logGeneration(client, { user, service, stockRemaining }) {
  logToFile(
    `User ${user.tag} (${user.id}) generated "${service}" | Stock remaining: ${stockRemaining}`
  );

  if (!config.LOG_CHANNEL_ID) return;

  try {
    const channel = await client.channels.fetch(config.LOG_CHANNEL_ID);
    if (!channel) return;

    const embed = baseEmbed(config.COLORS.INFO)
      .setTitle("📦 Account Generated")
      .addFields(
        { name: "User", value: `<@${user.id}> (\`${user.id}\`)`, inline: true },
        { name: "Service", value: service, inline: true },
        { name: "Stock Remaining", value: `${stockRemaining}`, inline: true }
      );

    await channel.send({ embeds: [embed] });
  } catch (err) {
    console.error("[LOGGER] Failed to send log to log channel:", err.message);
  }
}

module.exports = { logToFile, logGeneration };
