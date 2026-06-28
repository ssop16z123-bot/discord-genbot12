const { SlashCommandBuilder } = require("discord.js");
const { mainEmbed } = require("../utils/embeds");
const config = require("../config");

module.exports = {
  data: new SlashCommandBuilder().setName("help").setDescription("Show all available commands"),

  async execute(interaction) {
    const isOwner = interaction.user.id === config.OWNER_ID;

    const memberCommands = ["/gen", "/services", "/stock", "/help"].map((c) => `\`${c}\``).join(", ");

    const ownerCommands = [
      "/create-service",
      "/delete-service",
      "/restock",
      "/clearstock",
      "/addgenrole",
      "/removegenrole",
      "/reload",
    ]
      .map((c) => `\`${c}\``)
      .join(", ");

    const embed = mainEmbed(
      "📖 Command List",
      "Here are all the commands available to you."
    ).addFields({ name: "👤 Member Commands", value: memberCommands });

    if (isOwner) {
      embed.addFields({ name: "👑 Owner Commands", value: ownerCommands });
    }

    return interaction.reply({ embeds: [embed], ephemeral: true });
  },
};
