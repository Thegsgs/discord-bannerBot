const stopUpdating = (interaction, updatingFunc) => {
  clearInterval(updatingFunc);
  interaction.followUp("Updating stopped.");
};

module.exports = stopUpdating;
