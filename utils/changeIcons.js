const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const checkAndUpload = require("../utils/checkAndUpload");
const tryCatchHelper = require("../utils/tryCatchHelper");

const changeIcons = async (interaction, client) => {
  return new Promise(async (resolve, reject) => {
    const iconsMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("select-icon")
        .setPlaceholder("Pick the icon you want to change:")
        .addOptions([
          {
            label: "Icon total members",
            value: "icon1",
          },
          {
            label: "Icon in voice-chat",
            value: "icon2",
          },
          {
            label: "Icon total boosts",
            value: "icon3",
          },
        ])
    );

    const optionFilter = (option) => option.user.id === interaction.user.id;
    const filter = (message) => interaction.user.id === message.author.id;
    const [menu, error1] = await tryCatchHelper(
      interaction.reply({
        content: "Pick a shape from the list below:",
        embeds: [],
        components: [iconsMenu],
        fetchReply: true,
      })
    );

    if (error1) reject(error1);

    const [collector, error2] = await tryCatchHelper(
      interaction.channel.createMessageComponentCollector({
        optionFilter,
        componentType: "SELECT_MENU",
        time: 45000,
        max: 1,
      })
    );

    if (error2) reject(error2);

    client.once("interactionCreate", (newInteraction) => {
      if (newInteraction.user.id !== interaction.user.id) return;
      collector.stop();
    });

    collector.on("end", (collected, endReason) => {
      if (endReason === "time") {
        interaction.followUp(
          "You took too long to make a decision, going back to menu."
        );
        resolve();
      }
      if (!menu) return;
      menu.delete().catch((err) => console.error(err));
    });

    collector.on("collect", async (option) => {
      collector.stop();
      option.reply({
        content: "Please upload a valid .png link or image:",
        components: [],
      });

      const [messages, error2] = await tryCatchHelper(
        option.channel.awaitMessages({
          filter,
          time: 45000,
          max: 1,
        })
      );

      if (error2) reject(error2);

      if (messages.first()) {
        if (messages.first().attachments.first()) {
          const imageURL = messages.first().attachments.first().url;
          await checkAndUpload(imageURL, option, option.values[0]).catch(
            (err) => console.error(err)
          );
          resolve();
        } else if (messages.first().content) {
          const imageURL = messages.first().content;
          await checkAndUpload(imageURL, option, option.values[0]).catch(
            (err) => console.error(err)
          );
          resolve();
        } else {
          option.followUp(`No message detected, try again.`);
          resolve();
        }
      } else {
        interaction.followUp(
          "You took too long to make a decision, going back to menu."
        );
        resolve();
      }
    });
  });
};

module.exports = changeIcons;
