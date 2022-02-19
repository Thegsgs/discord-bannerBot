const stopUpdating = (interaction, updatingFunc) => {
  clearInterval(updatingFunc);
  interaction.editReply("Updating stopped.");
};

module.exports = stopUpdating;
