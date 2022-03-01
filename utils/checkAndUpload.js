const { changeProp } = require("../controllers/servers");

const checkAndUpload = async (url, interaction, setting) => {
  return new Promise(async (resolve, reject) => {
    if (url.endsWith(".jpg") || url.endsWith(".png")) {
      try {
        interaction.followUp("Aplying new setting...");
        await changeProp(interaction.guild.id, setting, url).catch((err) =>
          console.error(err)
        );
        resolve();
      } catch (error) {
        interaction.followUp(
          "An error has occured wile trying to change the setting."
        );
        reject(error);
      }
    } else {
      interaction.followUp(`No image detected, try again.`);
      resolve();
    }
  });
};

module.exports = checkAndUpload;
