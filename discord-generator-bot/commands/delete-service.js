const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../utils/embeds");
const { deleteService, serviceExists } = require("../utils/stockManager");
const { serviceAutocomplete } = require("../utils/autocomplete");

module.exports = {
  ownerOnly: true,
  data: new SlashCommandBuilder()
    .setName("delete-service")
    .setDescription("Delete a service and its stock file (owner only)")
    .addStringOption((opt) =>
      opt
        .setName("service")
        .setDescription("The service to delete")
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

    deleteService(service);

    return interaction.reply({
      embeds: [successEmbed("Service Deleted", `Deleted **${service}** and its stock file.`)],
      ephemeral: true,
    });
  },
};
