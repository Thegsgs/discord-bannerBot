const checkAndUpload = require("../utils/checkAndUpload");

const changeBackground = async (interaction) => {
  const filter = (message) => interaction.user.id === message.author.id;
  interaction.reply("Please upload an image (ending with .png or .jpg only!)");
  try {
    const messages = await interaction.channel.awaitMessages({
      filter,
      time: 45000,
      max: 1,
      errors: ["time"],
    });
    if (messages.first().attachments.first()) {
      const imageURL = messages.first().attachments.first().url;
      checkAndUpload(imageURL, interaction);
    } else if (messages.first().content) {
      const imageURL = messages.first().content;
      await checkAndUpload(imageURL, interaction, "backgroundImage");
    } else interaction.editReply(`No message detected, try again.`);
  } catch {
    interaction.followUp("You took too long to make a decistion.");
  }
};

module.exports = changeBackground;
