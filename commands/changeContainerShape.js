const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { changeProp } = require("../controllers/servers");
const tryCatchHelper = require("../utils/tryCatchHelper");

checkAndUpload = async (url, interaction) => {
  if (url.endsWith(".jpg") || url.endsWith(".png")) {
    interaction.followUp("Changing background, please wait...");
    try {
      await changeProp(interaction.guild.id, "containerShapeCustom", url);
      await changeProp(interaction.guild.id, "containerShape", "custom");
    } catch (error) {
      console.error(error);
      interaction.followUp("An error has occured.");
    }
    await interaction.followUp("Custom shape applied successfully!");
  } else interaction.followUp(`No image detected, try again.`);
};

const changeContainerShape = async (interaction, client) => {
  const shapeMenu = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("select-shape")
      .setPlaceholder("Pick a shape:")
      .addOptions([
        {
          label: "Square",
          description: "Square with sharp edges",
          value: "square",
          emoji: "<:square:939934844438347856>",
        },
        {
          label: "Square rounded",
          description: "Square with very rounded edges",
          value: "square-rounded",
          emoji: "<:squarerounded:939934820715360316>",
        },
        {
          label: "Circle",
          description: "A perfect cicrle",
          value: "circle",
          emoji: "<:circle:939934789887205409>",
        },
        {
          label: "Custom Shape",
          description: "Upload a .png shape of your choosing",
          value: "custom",
          emoji: "<:shapes:939868744363163688>",
        },
      ])
  );
  let isDel = false;
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
    interaction.reply("An error has occured.");
  }

  await interaction.reply({
    content: "Pick a shape from the list below:",
    embeds: [],
    components: [shapeMenu],
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
    if (!option.values.includes("custom")) {
      await changeProp(interaction.guild.id, "containerShapeCustom", "");
      await changeProp(
        interaction.guild.id,
        "containerShape",
        option.values[0]
      );
      option.reply({
        content: `Changed shape to ${option.values[0]}...`,
        components: [],
      });
    } else {
      option.reply({
        content: "Please upload a valid .png link or image:",
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

      if (messages.first().attachments.first()) {
        const imageURL = messages.first().attachments.first().url;
        await checkAndUpload(imageURL, interaction);
      } else if (messages.first().content) {
        const imageURL = messages.first().content;
        await checkAndUpload(imageURL, interaction);
      } else interaction.followUp(`No message detected, try again.`);
    }
  });
};

module.exports = changeContainerShape;
