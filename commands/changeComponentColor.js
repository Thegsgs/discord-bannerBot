const { changeProp } = require("../controllers/servers");

const changeComponentColor = async (interaction, component) => {
  const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  const filter = (message) => interaction.user.id === message.author.id;
  interaction.reply({
    content: `Please write a valid hexadecimal color code (example: #ffd1dc for pastel pink).
        You can visit colorhexa.com for more information.`,
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
    if (regex.test(color)) {
      interaction.followUp("Changing color, please wait...");
      await changeProp(interaction.guild.id, component, color);
      interaction.followUp("Color changed successfully!");
      return;
    } else interaction.followUp(`No valid color detected, try again.`);
  } catch {
    interaction.followUp("You took too long to make a decision.");
  }
};

module.exports = changeComponentColor;
