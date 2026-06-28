const config = require("../config");
const { getAllGenRoles } = require("./genRoleManager");

function isOwner(userId) {
  return userId === config.OWNER_ID;
}

/** Checks if a guild member is allowed to use /gen. The owner always bypasses this. */
function canGenerate(member) {
  if (isOwner(member.id)) return true;
  const allowedRoles = getAllGenRoles();
  return member.roles.cache.some((role) => allowedRoles.includes(role.id));
}

module.exports = { isOwner, canGenerate };
