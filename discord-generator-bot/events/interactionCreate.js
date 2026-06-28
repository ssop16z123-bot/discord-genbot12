const config = require("../config");
const { errorEmbed } = require("../utils/embeds");

module.exports = {
  name: "interactionCreate",
  async execute(interaction, client) {
    // ---- AUTOCOMPLETE REQUESTS ----
    if (interaction.isAutocomplete()) {
      const command = client.commands.get(interaction.commandName);
      if (!command?.autocomplete) return;

      try {
        await command.autocomplete(interaction, client);
      } catch (err) {
        console.error(`[AUTOCOMPLETE ERROR] /${interaction.commandName}:`, err);
      }
      return;
    }

    // ---- SLASH COMMANDS ----
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
      return interaction.reply({
        embeds: [errorEmbed("Unknown Command", "This command no longer exists.")],
        ephemeral: true,
      });
    }

    // Centralized owner-only gate. Individual commands just set
    // `ownerOnly: true` and never have to repeat this check themselves.
    if (command.ownerOnly && interaction.user.id !== config.OWNER_ID) {
      return interaction.reply({
        embeds: [errorEmbed("Access Denied", "Only the bot owner can use this command.")],
        ephemeral: true,
      });
    }

    try {
      await command.execute(interaction, client);
    } catch (err) {
      console.error(`[COMMAND ERROR] /${interaction.commandName}:`, err);

      const payload = {
        embeds: [
          errorEmbed(
            "Something Went Wrong",
            "An unexpected error occurred while running this command. The error has been logged in the console."
          ),
        ],
        ephemeral: true,
      };

      // The command may have already replied or deferred — handle both cases.
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(payload).catch(() => {});
      } else {
        await interaction.reply(payload).catch(() => {});
      }
    }
  },
};
