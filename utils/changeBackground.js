const checkAndUpload = require("../utils/checkAndUpload");
const tryCatchHelper = require("../utils/tryCatchHelper");

const changeBackground = async (interaction) => {
  return new Promise(async (resolve, reject) => {
    const filter = (message) => interaction.user.id === message.author.id;

    interaction.reply(
      "Please upload an image (ending with .png or .jpg only!)"
    );

    const [messages, error] = await tryCatchHelper(
      interaction.channel.awaitMessages({
        filter,
        time: 45000,
        max: 1,
      })
    );
    if (error) reject(error);

    if (messages.first()) {
      console.log(messages.first());
      // Message contains image file
      if (messages.first().attachments.first()) {
        const imageURL = messages.first().attachments.first().url;
        await checkAndUpload(imageURL, interaction, "backgroundImage").catch(
          (err) => console.error(err)
        );
        resolve();
        // Message contains image url
      } else if (messages.first().content) {
        const imageURL = messages.first().content;
        await checkAndUpload(imageURL, interaction, "backgroundImage").catch(
          (err) => console.error(err)
        );
        resolve();
      } else {
        interaction.editReply(`No message detected, try again.`);
        resolve();
      }
    } else {
      interaction.followUp(
        "You took too long to make a decistion, going back to menu."
      );
      resolve();
    }
  });
};

module.exports = changeBackground;
