const { changeProp } = require("../controllers/servers");
const tryCatchHelper = require("../utils/tryCatchHelper");

const changeComponentColor = async (interaction, component) => {
  return new Promise(async (resolve, reject) => {
    const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const filter = (message) => interaction.user.id === message.author.id;
    interaction.reply({
      content: `Please write a valid hexadecimal color code (example: #ffd1dc for pastel pink).
        You can visit colorhexa.com for more information.`,
      components: [],
    });
    const [messages, error] = await tryCatchHelper(
      interaction.channel.awaitMessages({
        filter,
        time: 45000,
        max: 1,
      })
    );

    if (error) reject(error);

    if (messages.first()) {
      const color = messages.first().content;
      if (regex.test(color)) {
        interaction.followUp("Changing color, please wait...");
        await changeProp(interaction.guild.id, component, color).catch((err) =>
          console.error(err)
        );
        resolve();
      } else {
        interaction.followUp(`No valid color detected, try again.`);
        resolve();
      }
    } else {
      interaction.editReply(
        "You took too long to make a decision, going back to menu."
      );
      resolve();
    }
  });
};

module.exports = changeComponentColor;
