const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const checkAndUpload = require("../utils/checkAndUpload");
const tryCatchHelper = require("../utils/tryCatchHelper");

const changeIcons = async (interaction, client) => {
  const iconsMenu = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("select-icon")
      .setPlaceholder("Pick the icon you want to change:")
      .addOptions([
        {
          label: "Icon 1",
          value: "icon1",
        },
        {
          label: "Icon 2",
          value: "icon2",
        },
        {
          label: "Icon 3",
          value: "icon3",
        },
      ])
  );

  const optionFilter = (option) => option.user.id === interaction.user.id;
  const filter = (message) => interaction.user.id === message.author.id;

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
    content: "Pick a shape from the list below:",
    embeds: [],
    components: [iconsMenu],
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
    option.reply({
      content: "Please upload a valid .png link or image:",
      components: [],
    });

    const [messages, error] = await tryCatchHelper(
      option.channel.awaitMessages({
        filter,
        time: 45000,
        max: 1,
        errors: ["time"],
      })
    );

    if (error) {
      interaction.followUp("An error has occured.");
    }

    if (messages.first().attachments.first()) {
      const imageURL = messages.first().attachments.first().url;
      await checkAndUpload(imageURL, option, option.values[0]);
    } else if (messages.first().content) {
      const imageURL = messages.first().content;
      await checkAndUpload(imageURL, option, option.values[0]);
    } else option.followUp(`No message detected, try again.`);
  });
};

module.exports = changeIcons;
