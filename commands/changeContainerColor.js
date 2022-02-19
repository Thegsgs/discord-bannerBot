const { changeProp } = require("../controllers/servers");

const checkAndUpload = async (url, interaction) => {
  if (url.endsWith(".jpg") || url.endsWith(".png")) {
    try {
      interaction.editReply("Changing background, please wait...");
      await changeProp(interaction.guild.id, "containerBackgroundImage", url);
      await changeProp(
        interaction.guild.id,
        "containerBackgroundColor",
        "Custom"
      );
      interaction.followUp("Image set successfully!");
    } catch {
      interaction.followUp(
        "An error has occured while changing container background."
      );
    }
  } else interaction.followUp(`No image detected, try again.`);
};

const changeContainerColor = async (interaction) => {
  const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const filter = (message) => interaction.user.id === message.author.id;

  interaction.reply({
    content: `Please write a valid hexadecimal color code (e.g: #ffd1dc for pastel pink). 
    Or write "custom" (Quotes excluded) to set a custom image as the background.`,
    components: [],
  });

  try {
    const messages = await interaction.channel.awaitMessages({
      filter,
      time: 45000,
      max: 1,
      errors: ["time"],
    });

    const color = messages.first().content;
    if (color == "custom") {
      interaction.followUp(
        "Please upload a valid .png link or paste an image:"
      );
      const link = await interaction.channel.awaitMessages({
        filter,
        time: 45000,
        max: 1,
        errors: ["time"],
      });

      if (link.first().attachments.first()) {
        const imageURL = link.first().attachments.first().url;
        await checkAndUpload(imageURL, interaction);
      } else if (link.first().content) {
        const imageURL = link.first().content;
        await checkAndUpload(imageURL, interaction);
      } else interaction.followUp(`No message detected, try again.`);
    } else if (regex.test(color)) {
      interaction.followUp("Changing color, please wait...");
      await changeProp(interaction.guild.id, "containerBackgroundColor", color);
      interaction.followUp("Color set successfully!");
      return;
    } else interaction.followUp(`No valid message detected, try again.`);
  } catch {
    interaction.followUp("You took too long to make a decision.");
  }
};

module.exports = changeContainerColor;
