const { changeProp } = require("../controllers/servers");

const checkAndUpload = async (url, interaction, setting) => {
  if (url.endsWith(".jpg") || url.endsWith(".png")) {
    try {
      interaction.followUp("Aplying new setting...");
      await changeProp(interaction.guild.id, setting, url);
      interaction.followUp("Setting applied successfully!");
    } catch {
      interaction.followUp(
        "An error has occured wile trying to change the setting."
      );
    }
  } else interaction.followUp(`No image detected, try again.`);
};

module.exports = checkAndUpload;
