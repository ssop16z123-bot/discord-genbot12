const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../utils/embeds");
const { addStock, serviceExists, getStockCount } = require("../utils/stockManager");
const { serviceAutocomplete } = require("../utils/autocomplete");

module.exports = {
  ownerOnly: true,
  data: new SlashCommandBuilder()
    .setName("restock")
    .setDescription("Add stock to a service (owner only)")
    .addStringOption((opt) =>
      opt
        .setName("service")
        .setDescription("The service to restock")
        .setRequired(true)
        .setAutocomplete(true)
    )
    .addStringOption((opt) =>
      opt
        .setName("lines")
        .setDescription("One account per line — you can paste multiple lines at once")
        .setRequired(false)
    )
    .addAttachmentOption((opt) =>
      opt
        .setName("file")
        .setDescription("A .txt file with one account per line (best for large restocks)")
        .setRequired(false)
    ),

  async autocomplete(interaction) {
    await serviceAutocomplete(interaction);
  },

  async execute(interaction) {
    const service = interaction.options.getString("service");
    const rawLines = interaction.options.getString("lines");
    const file = interaction.options.getAttachment("file");

    if (!serviceExists(service)) {
      return interaction.reply({
        embeds: [errorEmbed("Not Found", `No service named **${service}** exists.`)],
        ephemeral: true,
      });
    }

    if (!rawLines && !file) {
      return interaction.reply({
        embeds: [
          errorEmbed(
            "Missing Data",
            "Provide either the `lines` option or attach a `.txt` file with the `file` option."
          ),
        ],
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    const allLines = [];

    // Pasted text option — Discord preserves newlines even though the
    // input box renders as a single line.
    if (rawLines) {
      allLines.push(...rawLines.split("\n"));
    }

    // Attachment option — better for bulk restocks since Discord string
    // options are capped at 6000 characters.
    if (file) {
      try {
        const response = await fetch(file.url);
        const text = await response.text();
        allLines.push(...text.split("\n"));
      } catch (err) {
        return interaction.editReply({
          embeds: [errorEmbed("File Error", "Couldn't download or read the attached file.")],
        });
      }
    }

    const added = addStock(service, allLines);
    const newCount = getStockCount(service);

    return interaction.editReply({
      embeds: [
        successEmbed(
          "Stock Added",
          `Added **${added}** account(s) to **${service}**.\nNew stock count: **${newCount}**`
        ),
      ],
    });
  },
};
