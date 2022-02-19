const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { changeProp } = require("../controllers/servers");
const tryCatchHelper = require("../utils/tryCatchHelper");

const changeFont = async (interaction, client) => {
  const fontsMenu = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("select")
      .setPlaceholder("Please pick new font from the menu:")
      .addOptions([
        {
          label: "Anton",
          value: "Anton",
        },
        {
          label: "Russo One",
          value: "Russo One",
        },
        {
          label: "Play",
          value: "Play",
        },
        {
          label: "Heebo",
          value: "Heebo",
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
  collector.on("end", () => {
    if (isDel) return;
    interaction.deleteReply();
    isDel = true;
  });
  collector.on("collect", async (option) => {
    collector.stop();
    option.reply({
      content: `Changing font...`,
      components: [],
    });
    await changeProp(interaction.guild.id, "containerFont", option.values[0]);
    option.followUp({
      content: `Changed font to ${option.values[0]}...`,
      components: [],
    });
  });

  await interaction.reply({
    content: "Please pick a new font:",
    components: [fontsMenu],
    fetchReply: true,
  });

  client.once("interactionCreate", (newInteraction) => {
    if (newInteraction.user.id !== interaction.user.id) return;
    collector.stop();
  });
  client.once("messageDelete", () => (isDel = true));
};

module.exports = changeFont;
