const { getServerConfig, changeProp } = require("../controllers/servers");
const updateBanner = require("./updateBanner");
const uploadBanner = require("./uploadBanner");

// ResumeUpdates is like StartUpdating only it doesn't rely on interactons
// And does not output any message to a channel.

const resumeUpdates = async (client, guild) => {
  const currentDate = new Date();
  const currentMinutes = parseInt(currentDate.getUTCMinutes());
  const serverConfig = await getServerConfig(guild.id);
  // Checks if 5 minutes have passed since last update
  if (Math.abs(serverConfig.lastUpdated - currentMinutes) >= 5) {
    const buffer = await updateBanner(guild);
    await uploadBanner(client, guild, buffer);
    console.log(`Started automatic updates on ${guild.name}`);
    await changeProp(guild.id, "lastUpdated", currentMinutes);
    await changeProp(guild.id, "isUpdating", true);
    // Start updating with 5 minutes interval
    const interval = await setInterval(async () => {
      const serverConfig = await getServerConfig(guild.id);
      // Clear interval if updating property is false
      if (!serverConfig.isUpdating) clearInterval(interval);
      const buffer = await updateBanner(guild);
      await uploadBanner(client, guild, buffer);
      await changeProp(guild.id, "lastUpdated", currentMinutes);
    }, 300000);
  } else {
    // Create a delay based on last time updated substracted from 5 mins
    let delay = 5 - Math.abs(serverConfig.lastUpdated - currentMinutes);
    if (delay < 0) delay = delay * -1;
    const delayInMs = delay * 60000;
    console.log(
      `${guild.name}'s update was too recent, starting updates in ${delay} minutes.`
    );
    await setTimeout(() => {
      resumeUpdates(client, guild);
    }, delayInMs);
  }
};

module.exports = resumeUpdates;
