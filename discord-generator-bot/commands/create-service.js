const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../utils/embeds");
const { createService, serviceExists, sanitizeServiceName } = require("../utils/stockManager");

module.exports = {
  ownerOnly: true,
  data: new SlashCommandBuilder()
    .setName("create-service")
    .setDescription("Create a new generator service (owner only)")
    .addStringOption((opt) =>
      opt.setName("name").setDescription("Service name, e.g. Netflix").setRequired(true)
    ),

  async execute(interaction) {
    const name = interaction.options.getString("name");
    const key = sanitizeServiceName(name);

    if (serviceExists(key)) {
      return interaction.reply({
        embeds: [errorEmbed("Service Exists", `A service named **${key}** already exists.`)],
        ephemeral: true,
      });
    }

    createService(key);

    return interaction.reply({
      embeds: [
        successEmbed(
          "Service Created",
          `Created the **${key}** service.\nA stock file was created at \`/stocks/${key}.txt\`.\n\nUse \`/restock\` to add accounts.`
        ),
      ],
      ephemeral: true,
    });
  },
};
