const { changeProp } = require("../controllers/servers");
const tryCatchHelper = require("../utils/tryCatchHelper");

const changeTextSize = async (interaction) => {
  return new Promise(async (resolve, reject) => {
    const filter = (message) => message.author.id == interaction.user.id;
    await interaction
      .reply({
        content:
          "Please write a new text size from 10 (tiny) to 100 (fairly large).",
        components: [],
      })
      .catch((err) => console.error(err));
    const [messages, error] = await tryCatchHelper(
      interaction.channel.awaitMessages({
        filter,
        time: 45000,
        max: 1,
      })
    );

    if (error) reject(error);

    if (messages.first()) {
      const size = messages.first().content;
      if (size >= 10 && size <= 100) {
        interaction.followUp("Changing size, please wait...");
        await changeProp(interaction.guild.id, "textSize", size).catch((err) =>
          console.error(err)
        );
        resolve();
      } else {
        interaction.followUp(`No valid size detected, try again.`);
        resolve();
      }
    } else {
      interaction.followUp(
        "You took too long to make a decision, going back to menu."
      );
      resolve();
    }
  });
};

module.exports = changeTextSize;
