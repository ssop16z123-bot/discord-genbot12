const { EmbedBuilder } = require("discord.js");
const config = require("../config");

/**
 * Builds a base embed with consistent styling: color, timestamp,
 * footer, and author — all pulled from config.js so the whole bot's
 * look can be re-themed in one place.
 */
function baseEmbed(color) {
  const embed = new EmbedBuilder().setColor(color).setTimestamp();

  if (config.EMBED_FOOTER?.text) {
    const footer = { text: config.EMBED_FOOTER.text };
    if (config.EMBED_FOOTER.iconURL) footer.iconURL = config.EMBED_FOOTER.iconURL;
    embed.setFooter(footer);
  }

  if (config.EMBED_AUTHOR?.name) {
    const author = { name: config.EMBED_AUTHOR.name };
    if (config.EMBED_AUTHOR.iconURL) author.iconURL = config.EMBED_AUTHOR.iconURL;
    embed.setAuthor(author);
  }

  return embed;
}

function successEmbed(title, description) {
  return baseEmbed(config.COLORS.SUCCESS).setTitle(`✅ ${title}`).setDescription(description);
}

function errorEmbed(title, description) {
  return baseEmbed(config.COLORS.ERROR).setTitle(`❌ ${title}`).setDescription(description);
}

function infoEmbed(title, description) {
  return baseEmbed(config.COLORS.INFO).setTitle(`ℹ️ ${title}`).setDescription(description);
}

function mainEmbed(title, description) {
  return baseEmbed(config.COLORS.MAIN).setTitle(title).setDescription(description);
}

module.exports = { baseEmbed, successEmbed, errorEmbed, infoEmbed, mainEmbed };
