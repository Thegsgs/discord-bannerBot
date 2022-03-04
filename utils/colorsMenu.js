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
            emoji: "<:border:949374099346583612>",
          },
          {
            label: "Frame background color",
            value: "containerBackgroundColor",
            description: `Can also set an image by typing "custom".`,
            emoji: "<:background:949374091268358204>",
          },
          {
            label: "Font color",
            value: "fontColor",
            emoji: "<:color:949374118367731802>",
          },
          {
            label: "Icons color",
            value: "iconsColor",
            emoji: "<:people:949374083013959711>",
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
        await changeComponentColor(option, option.values[0]).catch((err) =>
          console.error(err)
        );
        resolve();
      } else {
        await changeContainerColor(option).catch((err) => console.error(err));
        resolve();
      }
    });
  });
};

module.exports = colorsMenu;
