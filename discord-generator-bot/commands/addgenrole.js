const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../utils/embeds");
const { addGenRole } = require("../utils/genRoleManager");

module.exports = {
  ownerOnly: true,
  data: new SlashCommandBuilder()
    .setName("addgenrole")
    .setDescription("Add a role allowed to use /gen (owner only)")
    .addRoleOption((opt) =>
      opt.setName("role").setDescription("The role to allow").setRequired(true)
    ),

  async execute(interaction) {
    const role = interaction.options.getRole("role");
    const added = addGenRole(role.id);

    if (!added) {
      return interaction.reply({
        embeds: [errorEmbed("Already Added", `**${role.name}** can already use /gen.`)],
        ephemeral: true,
      });
    }

    return interaction.reply({
      embeds: [successEmbed("Role Added", `**${role.name}** can now use /gen.`)],
      ephemeral: true,
    });
  },
};
