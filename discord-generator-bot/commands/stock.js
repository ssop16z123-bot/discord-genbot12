const { SlashCommandBuilder } = require("discord.js");
const { infoEmbed, errorEmbed } = require("../utils/embeds");
const { getStockCount, listServices, serviceExists } = require("../utils/stockManager");
const { serviceAutocomplete } = require("../utils/autocomplete");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stock")
    .setDescription("Show current stock for one service, or all services")
    .addStringOption((opt) =>
      opt
        .setName("service")
        .setDescription("Leave empty to see every service")
        .setRequired(false)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    await serviceAutocomplete(interaction);
  },

  async execute(interaction) {
    const service = interaction.options.getString("service");

    if (service) {
      if (!serviceExists(service)) {
        return interaction.reply({
          embeds: [errorEmbed("Not Found", `No service named **${service}** exists.`)],
          ephemeral: true,
        });
      }

      const count = getStockCount(service);
      return interaction.reply({
        embeds: [infoEmbed(`Stock: ${service}`, `**${count}** account(s) in stock.`)],
        ephemeral: true,
      });
    }

    const services = listServices();
    if (services.length === 0) {
      return interaction.reply({
        embeds: [infoEmbed("No Services", "No services have been created yet.")],
        ephemeral: true,
      });
    }

    const lines = services.map((s) => `**${s}** — ${getStockCount(s)} in stock`).join("\n");

    return interaction.reply({
      embeds: [infoEmbed("Stock Overview", lines)],
      ephemeral: true,
    });
  },
};
