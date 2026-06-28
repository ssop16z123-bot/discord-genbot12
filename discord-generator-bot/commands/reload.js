const { SlashCommandBuilder } = require("discord.js");
const { successEmbed } = require("../utils/embeds");
const loadCommands = require("../handlers/commandHandler");
const { listServices } = require("../utils/stockManager");

module.exports = {
  ownerOnly: true,
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("Reload commands and refresh the services list (owner only)"),

  async execute(interaction, client) {
    // Stock/service data is always read live from disk (no cache), so the
    // services list is already "live" — this mainly re-reads command files,
    // which is useful after editing a command without restarting the bot.
    loadCommands(client);
    const services = listServices();

    return interaction.reply({
      embeds: [
        successEmbed(
          "Reloaded",
          `Reloaded **${client.commands.size}** command(s).\nDetected **${services.length}** service(s): ${
            services.length ? services.map((s) => `\`${s}\``).join(", ") : "none"
          }`
        ),
      ],
      ephemeral: true,
    });
  },
};
