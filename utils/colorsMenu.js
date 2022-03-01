const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const changeContainerColor = require("./changeContainerColor");
const changeComponentColor = require("./changeComponentColor");
const tryCatchHelper = require("../utils/tryCatchHelper");

const colorsMenu = async (interaction, client) => {
  return new Promise(async (resolve, reject) => {
    const colorsOptions = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("select")
        .setPlaceholder("Pick an object to recolor:")
        .addOptions([
          {
            label: "Frame border color",
            value: "containerBorderColor",
          },
          {
            label: "Frame background color",
            value: "containerBackgroundColor",
          },
          {
            label: "Font color",
            value: "fontColor",
          },
          {
            label: "Icons color",
            value: "iconsColor",
          },
        ])
    );

    const optionFilter = (option) => option.user.id === interaction.user.id;
    const [menu, error1] = await tryCatchHelper(
      interaction.reply({
        content: "Choose an option from the menu:",
        components: [colorsOptions],
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
      menu.delete();
    });

    collector.on("collect", async (option) => {
      collector.stop();
      if (option.values[0] !== "containerBackgroundColor") {
        await changeComponentColor(option, option.values[0]);
        resolve();
      } else {
        await changeContainerColor(option);
        resolve();
      }
    });
  });
};

module.exports = colorsMenu;
