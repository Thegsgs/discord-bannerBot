const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const changeContainerColor = require("./changeContainerColor");
const changeComponentColor = require("./changeComponentColor");
const tryCatchHelper = require("../utils/tryCatchHelper");

const colorsMenu = async (interaction, client) => {
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
  const [collector, error] = await tryCatchHelper(
    interaction.channel.createMessageComponentCollector({
      optionFilter,
      componentType: "SELECT_MENU",
      time: 45000,
      max: 1,
    })
  );

  if (error) {
    interaction.followUp("An error has occured.");
  }

  let isDel = false;
  interaction.reply({
    content: "Choose an option from the menu:",
    components: [colorsOptions],
    fetchReply: true,
  });

  client.once("interactionCreate", (newInteraction) => {
    if (newInteraction.user.id !== interaction.user.id) return;
    collector.stop();
  });
  client.once("messageDelete", () => (isDel = true));

  collector.on("end", () => {
    if (isDel) return;
    interaction.deleteReply();
    isDel = true;
  });
  collector.on("collect", async (option) => {
    collector.stop();
    if (option.values[0] !== "containerBackgroundColor")
      changeComponentColor(option, option.values[0]);
    else changeContainerColor(option);
  });
};

module.exports = colorsMenu;
