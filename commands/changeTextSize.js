const { changeProp } = require("../controllers/servers");
const tryCatchHelper = require("../utils/tryCatchHelper");

const changeTextSize = async (interaction) => {
  const filter = (message) => message.author.id == interaction.user.id;
  await interaction.reply({
    content:
      "Please write a new text size from 10 (tiny) to 100 (fairly large).",
    components: [],
  });
  const [messages, error] = await tryCatchHelper(
    interaction.channel.awaitMessages({
      filter,
      time: 45000,
      max: 1,
      errors: ["time"],
    })
  );

  if (error) {
    interaction.followUp("An error has occured.");
  }

  const size = messages.first().content;
  if (size >= 10 && size <= 100) {
    interaction.followUp("Changing size, please wait...");
    await changeProp(interaction.guild.id, "textSize", size);
    interaction.followUp("Text size changed successfully!");
    return;
  } else interaction.followUp(`No valid size detected, try again.`);
};

module.exports = changeTextSize;
