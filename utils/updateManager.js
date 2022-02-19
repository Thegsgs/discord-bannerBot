const startUpdating = require("../commands/startUpdating");
const stopUpdating = require("../commands/stopUpdating");

let currentlyUpdating;
const updateManager = async (interaction, request) => {
  if (request == "start") {
    if (!currentlyUpdating) {
      try {
        currentlyUpdating = await startUpdating(interaction);
      } catch (error) {
        throw error;
      }
    } else {
      interaction.reply("Banner updating has already started.");
      return;
    }
  } else {
    if (!currentlyUpdating) {
      interaction.reply(
        "There was nothing to stop as the banner was not set to update in the first place."
      );
      return;
    } else {
      stopUpdating(interaction, currentlyUpdating);
      currentlyUpdating = undefined;
    }
  }
};

module.exports = updateManager;
