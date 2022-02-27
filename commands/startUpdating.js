const { getServerConfig, changeProp } = require("../controllers/servers");
const updateBanner = require("../utils/updateBanner");
const uploadBanner = require("../utils/uploadBanner");

const startUpdating = async (interaction) => {
  const currentDate = new Date();
  const currentMinutes = parseInt(currentDate.getUTCMinutes());

  // Checks if the server has been set up before starting to update
  const serverConfig = await getServerConfig(interaction.guild.id);
  if (!serverConfig) {
    interaction.followUp(
      "Looks like the server has not been set up yet. Type /setup to set up this server."
    );
    return;
  }

  // Checks if 5 minutes have passed since last update
  if (Math.abs(serverConfig.lastUpdated - currentMinutes) >= 0) {
    const buffer = await updateBanner(interaction);
    await uploadBanner(interaction, buffer);
    await interaction.followUp("Started automatic updates!");
    await changeProp(interaction.guild.id, "lastUpdated", currentMinutes);
    await changeProp(interaction.guild.id, "isUpdating", true);
    const interval = await setInterval(async () => {
      const serverConfig = await getServerConfig(interaction.guild.id);
      if (!serverConfig.isUpdating) clearInterval(interval);
      const buffer = await updateBanner(interaction);
      await uploadBanner(interaction, buffer);
      await changeProp(interaction.guild.id, "lastUpdated", currentMinutes);
    }, 300000);
  } else {
    // Creates delay based on last time updated
    let delay = 5 - Math.abs(serverConfig.lastUpdated - currentMinutes);
    if (delay < 0) delay = delay * -1;
    const delayInMs = delay * 60000;
    interaction.followUp(
      `Last update was too recent, starting updates in ${delay} minutes.`
    );
    await setTimeout(() => {
      startUpdating(interaction);
    }, delayInMs);
  }
};

module.exports = startUpdating;
