const { changeProp } = require("../controllers/servers");

const stopUpdating = async (interaction) => {
  interaction.followUp("Updating stopped.");
  await changeProp(interaction.guild.id, "isUpdating", false);
};

module.exports = stopUpdating;
