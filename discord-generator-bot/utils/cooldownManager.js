const fs = require("fs");
const path = require("path");

const COOLDOWNS_DIR = path.join(__dirname, "..", "cooldowns");
if (!fs.existsSync(COOLDOWNS_DIR)) fs.mkdirSync(COOLDOWNS_DIR, { recursive: true });

function getFilePath(userId) {
  return path.join(COOLDOWNS_DIR, `${userId}.txt`);
}

/**
 * Checks whether a user is currently on cooldown for generating.
 * Each user gets their own /cooldowns/<userId>.txt file containing
 * only the millisecond timestamp of their last successful generation.
 *
 * @returns {{onCooldown: boolean, remainingMs: number}}
 */
function checkCooldown(userId, cooldownMinutes) {
  const filePath = getFilePath(userId);
  if (!fs.existsSync(filePath)) return { onCooldown: false, remainingMs: 0 };

  const lastUsed = parseInt(fs.readFileSync(filePath, "utf-8").trim(), 10);
  if (isNaN(lastUsed)) return { onCooldown: false, remainingMs: 0 };

  const cooldownMs = cooldownMinutes * 60 * 1000;
  const remainingMs = cooldownMs - (Date.now() - lastUsed);

  return { onCooldown: remainingMs > 0, remainingMs: Math.max(remainingMs, 0) };
}

/** Marks "right now" as the user's last successful generation time. */
function setCooldown(userId) {
  fs.writeFileSync(getFilePath(userId), `${Date.now()}`, "utf-8");
}

/** Formats milliseconds into a friendly "Xm Ys" string for embeds. */
function formatRemaining(ms) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

module.exports = { checkCooldown, setCooldown, formatRemaining };
