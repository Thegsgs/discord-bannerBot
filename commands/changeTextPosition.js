const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { changeProp } = require("../controllers/servers");
const tryCatchHelper = require("../utils/tryCatchHelper");

const changeTextPosition = async (interaction, client) => {
  const positionMenu = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("select")
      .setPlaceholder("Pick a new position:")
      .addOptions([
        {
          label: "Center",
          value: "center-center",
          emoji: "<:center:939927793238696006>",
        },
        {
          label: "Top center",
          value: "top-center",
          emoji: "<:topcenter:939925438350897232>",
        },
        {
          label: "Top right",
          value: "top-right",
          emoji: "<:topright:939925786054500353>",
        },
        {
          label: "Center right",
          value: "center-right",
          emoji: "<:centerright:939925379244773427>",
        },
        {
          label: "Bottom right",
          value: "bottom-right",
          emoji: "<:bottomright:939925298894483467>",
        },
        {
          label: "Bottom center",
          value: "bottom-center",
          emoji: "<:bottomcenter:939925246255964180>",
        },
        {
          label: "Bottom left",
          value: "bottom-left",
          emoji: "<:bottomleft:939925271333732362>",
        },
        {
          label: "Center left",
          value: "center-left",
          emoji: "<:centerleft:939925333140996136>",
        },
        {
          label: "Top left",
          value: "top-left",
          emoji: "<:topleft:939925466750545971>",
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
    content: "Choose a new text position:",
    components: [positionMenu],
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
      content: `Changing text position...`,
      components: [],
    });
    await changeProp(interaction.guild.id, "textPosition", option.values[0]);
    option.followUp({
      content: `Changed text position to ${option.values[0]}...`,
      components: [],
    });
  });
};

module.exports = changeTextPosition;
