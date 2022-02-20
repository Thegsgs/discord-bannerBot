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

  const enoughTimePassedCheck = (lastTimeUpdated) => {
    if (
      lastTimeUpdated - currentMinutes >= 5 ||
      currentMinutes - lastTimeUpdated >= 5
    )
      return true;
    interaction.followUp(
      "Please wait longer before updating. (Update intervals are 5 minutes mininum)"
    );
    return false;
  };

  if (!enoughTimePassedCheck(serverConfig.lastUpdated)) return;
  const buffer = await updateBanner(interaction);
  await uploadBanner(interaction, buffer);
  await interaction.followUp("Started automatic updates!");
  await changeProp(interaction.guild.id, "lastUpdated", currentMinutes);
  let updatingFunc = setInterval(async () => {
    const buffer = await updateBanner(interaction);
    await uploadBanner(interaction, buffer);
    await changeProp(interaction.guild.id, "lastUpdated", currentMinutes);
  }, 450000);
  return updatingFunc;
};

module.exports = startUpdating;
