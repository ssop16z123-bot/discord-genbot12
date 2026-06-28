const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../utils/embeds");
const { clearStock, serviceExists } = require("../utils/stockManager");
const { serviceAutocomplete } = require("../utils/autocomplete");

module.exports = {
  ownerOnly: true,
  data: new SlashCommandBuilder()
    .setName("clearstock")
    .setDescription("Clear all stock for a service (owner only)")
    .addStringOption((opt) =>
      opt
        .setName("service")
        .setDescription("The service to clear")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    await serviceAutocomplete(interaction);
  },

  async execute(interaction) {
    const service = interaction.options.getString("service");

    if (!serviceExists(service)) {
      return interaction.reply({
        embeds: [errorEmbed("Not Found", `No service named **${service}** exists.`)],
        ephemeral: true,
      });
    }

    clearStock(service);

    return interaction.reply({
      embeds: [successEmbed("Stock Cleared", `All stock for **${service}** has been cleared.`)],
      ephemeral: true,
    });
  },
};
