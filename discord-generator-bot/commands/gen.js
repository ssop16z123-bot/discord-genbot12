const { SlashCommandBuilder } = require("discord.js");
const config = require("../config");
const { successEmbed, errorEmbed, mainEmbed } = require("../utils/embeds");
const { popStock, addStock, serviceExists, getStockCount } = require("../utils/stockManager");
const { checkCooldown, setCooldown, formatRemaining } = require("../utils/cooldownManager");
const { canGenerate, isOwner } = require("../utils/permissions");
const { logGeneration } = require("../utils/logger");
const { serviceAutocomplete } = require("../utils/autocomplete");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gen")
    .setDescription("Generate an account from a service")
    .addStringOption((opt) =>
      opt
        .setName("service")
        .setDescription("The service to generate from")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async autocomplete(interaction) {
    await serviceAutocomplete(interaction);
  },

  async execute(interaction, client) {
    const service = interaction.options.getString("service");

    // ---- 1. The service has to exist ----
    if (!serviceExists(service)) {
      return interaction.reply({
        embeds: [errorEmbed("Not Found", `No service named **${service}** exists.`)],
        ephemeral: true,
      });
    }

    // ---- 2. Permission check — the owner always bypasses this ----
    if (!canGenerate(interaction.member)) {
      return interaction.reply({
        embeds: [
          errorEmbed(
            "Access Denied",
            "You need the generator role to use this command.\nAsk a server admin for access."
          ),
        ],
        ephemeral: true,
      });
    }

    // ---- 3. Cooldown check — the owner always bypasses this ----
    if (!isOwner(interaction.user.id)) {
      const { onCooldown, remainingMs } = checkCooldown(interaction.user.id, config.COOLDOWN_TIME);
      if (onCooldown) {
        return interaction.reply({
          embeds: [
            errorEmbed(
              "On Cooldown",
              `You need to wait **${formatRemaining(remainingMs)}** before generating again.`
            ),
          ],
          ephemeral: true,
        });
      }
    }

    // ---- 4. Stock check ----
    if (getStockCount(service) <= 0) {
      return interaction.reply({
        embeds: [errorEmbed("Out of Stock", `**${service}** currently has no stock available.`)],
        ephemeral: true,
      });
    }

    await interaction.deferReply({ ephemeral: true });

    // ---- 5. Pop one account out of the stock file ----
    const account = popStock(service);
    if (!account) {
      return interaction.editReply({
        embeds: [errorEmbed("Out of Stock", `**${service}** currently has no stock available.`)],
      });
    }

    // ---- 6. DM the account to the user ----
    const dmEmbed = mainEmbed(
      "📦 Your Account Is Ready",
      `Here is your generated **${service}** account:\n\n\`\`\`${account}\`\`\``
    ).addFields({ name: "Service", value: service, inline: true });

    try {
      await interaction.user.send({ embeds: [dmEmbed] });
    } catch (err) {
      // DMs are closed — put the account back so stock isn't lost, then tell the user.
      addStock(service, [account]);
      return interaction.editReply({
        embeds: [
          errorEmbed(
            "DMs Closed",
            "I couldn't send you a DM. Please enable DMs from server members and try again."
          ),
        ],
      });
    }

    // ---- 7. Set cooldown, log, and confirm ----
    if (!isOwner(interaction.user.id)) {
      setCooldown(interaction.user.id);
    }

    const stockRemaining = getStockCount(service);
    await logGeneration(client, { user: interaction.user, service, stockRemaining });

    return interaction.editReply({
      embeds: [
        successEmbed("Account Generated", `Check your DMs for your **${service}** account! 📬`),
      ],
    });
  },
};
