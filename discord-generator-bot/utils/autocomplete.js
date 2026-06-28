const { listServices } = require("./stockManager");

/** Shared autocomplete handler for any "service" string option. */
async function serviceAutocomplete(interaction) {
  const focused = interaction.options.getFocused().toLowerCase();
  const services = listServices()
    .filter((s) => s.includes(focused))
    .slice(0, 25); // Discord allows a max of 25 autocomplete choices

  await interaction.respond(services.map((s) => ({ name: s, value: s })));
}

module.exports = { serviceAutocomplete };
