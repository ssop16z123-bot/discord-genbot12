const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../utils/embeds");
const { removeGenRole } = require("../utils/genRoleManager");

module.exports = {
  ownerOnly: true,
  data: new SlashCommandBuilder()
    .setName("removegenrole")
    .setDescription("Remove a role's access to /gen (owner only)")
    .addRoleOption((opt) =>
      opt.setName("role").setDescription("The role to remove").setRequired(true)
    ),

  async execute(interaction) {
    const role = interaction.options.getRole("role");
    const removed = removeGenRole(role.id);

    if (!removed) {
      return interaction.reply({
        embeds: [
          errorEmbed(
            "Not Found",
            `**${role.name}** wasn't in the extra gen-roles list.\n(Note: the base GEN_ROLE_ID set in config.js can't be removed this way — edit config.js directly for that.)`
          ),
        ],
        ephemeral: true,
      });
    }

    return interaction.reply({
      embeds: [successEmbed("Role Removed", `**${role.name}** can no longer use /gen.`)],
      ephemeral: true,
    });
  },
};
