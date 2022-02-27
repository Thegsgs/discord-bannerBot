const startUpdating = require("../commands/startUpdating");
const stopUpdating = require("../commands/stopUpdating");
const { getServerConfig } = require("../controllers/servers");
const tryCatchHelper = require("./tryCatchHelper");

// TODO: Change currently updating to check if server isUpdating set to true
const updateManager = async (interaction, request) => {
  const [serverConfig, error] = await tryCatchHelper(
    getServerConfig(interaction.guild.id)
  );

  if (error) {
    interaction.followUp("Error getting server settings.");
    return;
  }

  if (!serverConfig) {
    interaction.followUp(
      "Looks like the server hasn't been set up yet, please run /setup."
    );
    return;
  }

  const currentlyUpdating = serverConfig.isUpdating;

  if (request == "start") {
    if (!currentlyUpdating) {
      try {
        await startUpdating(interaction);
      } catch (error) {
        throw error;
      }
    } else {
      interaction.followUp("Banner updating has already started.");
      return;
    }
  }
  if (request == "stop") {
    if (!currentlyUpdating) {
      interaction.followUp(
        "There was nothing to stop as the banner was not set to update in the first place."
      );
      return;
    } else {
      stopUpdating(interaction);
    }
  }
};

module.exports = updateManager;
