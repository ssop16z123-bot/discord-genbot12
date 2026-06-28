const fs = require("fs");
const path = require("path");
const config = require("../config");

const DATA_DIR = path.join(__dirname, "..", "data");
const GEN_ROLES_FILE = path.join(DATA_DIR, "genroles.txt");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(GEN_ROLES_FILE)) fs.writeFileSync(GEN_ROLES_FILE, "", "utf-8");

/** Returns extra role IDs added at runtime via /addgenrole (one per line in the file). */
function getExtraGenRoles() {
  return fs
    .readFileSync(GEN_ROLES_FILE, "utf-8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

/** Returns config.GEN_ROLE_ID + every extra role, deduplicated. This is the full allow-list for /gen. */
function getAllGenRoles() {
  const roles = new Set(getExtraGenRoles());
  if (config.GEN_ROLE_ID) roles.add(config.GEN_ROLE_ID);
  return [...roles];
}

function addGenRole(roleId) {
  const roles = getExtraGenRoles();
  if (roles.includes(roleId)) return false;
  roles.push(roleId);
  fs.writeFileSync(GEN_ROLES_FILE, roles.join("\n") + "\n", "utf-8");
  return true;
}

function removeGenRole(roleId) {
  const roles = getExtraGenRoles();
  if (!roles.includes(roleId)) return false;
  const updated = roles.filter((r) => r !== roleId);
  fs.writeFileSync(GEN_ROLES_FILE, updated.length ? updated.join("\n") + "\n" : "", "utf-8");
  return true;
}

module.exports = { getExtraGenRoles, getAllGenRoles, addGenRole, removeGenRole };
