const { SlashCommandBuilder } = require("discord.js");
const { infoEmbed } = require("../utils/embeds");
const { listServices, getStockCount } = require("../utils/stockManager");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("services")
    .setDescription("List all available generator services"),

  async execute(interaction) {
    const services = listServices();

    if (services.length === 0) {
      return interaction.reply({
        embeds: [infoEmbed("No Services", "No services are currently available.")],
        ephemeral: true,
      });
    }

    const lines = services
      .map((s) => {
        const count = getStockCount(s);
        const status = count > 0 ? "🟢" : "🔴";
        return `${status} **${s}** — ${count} in stock`;
      })
      .join("\n");

    return interaction.reply({
      embeds: [infoEmbed("Available Services", lines)],
      ephemeral: true,
    });
  },
};
