const { changeProp } = require("../controllers/servers");
const tryCatchHelper = require("../utils/tryCatchHelper");

const changeContainerColor = async (interaction) => {
  return new Promise(async (resolve, reject) => {
    const checkAndUpload = async (url, interaction) => {
      if (url.endsWith(".jpg") || url.endsWith(".png")) {
        try {
          interaction.followUp("Changing background...");
          await changeProp(
            interaction.guild.id,
            "containerBackgroundImage",
            url
          ).catch((err) => console.error(err));
          await changeProp(
            interaction.guild.id,
            "containerBackgroundColor",
            "Custom"
          ).catch((err) => console.error(err));
          resolve();
        } catch (error) {
          interaction.followUp(
            "An error has occured while changing container background."
          );
          reject(error);
        }
      } else interaction.followUp(`No image detected, try again.`);
    };

    const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    const filter = (message) => interaction.user.id === message.author.id;

    interaction.reply({
      content: `Please write a valid hexadecimal color code (e.g: #ffd1dc for pastel pink). 
      Or write "custom" (Quotes excluded) to set a custom image as the background.`,
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

      if (color == "custom") {
        interaction.followUp(
          "Please upload a valid .png link or paste an image:"
        );

        const link = await interaction.channel
          .awaitMessages({
            filter,
            time: 45000,
            max: 1,
          })
          .catch((err) => console.error(err));

        if (link.first()) {
          if (link.first().attachments.first()) {
            const imageURL = link.first().attachments.first().url;
            await checkAndUpload(imageURL, interaction).catch((err) =>
              console.error(err)
            );
            resolve();
          } else if (link.first().content) {
            const imageURL = link.first().content;
            await checkAndUpload(imageURL, interaction).catch((err) =>
              console.error(err)
            );
            resolve();
          } else {
            interaction.followUp(`No message detected, try again.`);
            resolve();
          }
        } else {
          interaction.followUp(
            "You took too long to make a decision, going back to menu."
          );
          resolve();
        }
      } else if (regex.test(color)) {
        interaction.followUp("Changing color, please wait...");
        await changeProp(
          interaction.guild.id,
          "containerBackgroundColor",
          color
        ).catch((err) => console.error(err));
        resolve();
      } else {
        interaction.followUp(`No valid message detected, try again.`);
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

module.exports = changeContainerColor;
