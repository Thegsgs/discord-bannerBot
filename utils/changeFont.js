const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const { changeProp } = require("../controllers/servers");
const tryCatchHelper = require("../utils/tryCatchHelper");

const changeFont = async (interaction, client) => {
  return new Promise(async (resolve, reject) => {
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

    const [menu, error1] = await tryCatchHelper(
      interaction.reply({
        content: "Please pick a new font:",
        components: [fontsMenu],
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

    client.once("interactionCreate", (newInteraction) => {
      if (newInteraction.user.id !== interaction.user.id) return;
      collector.stop();
    });

    collector.on("collect", async (option) => {
      collector.stop();
      option.reply({
        content: `Changing font...`,
        components: [],
      });
      await changeProp(
        interaction.guild.id,
        "containerFont",
        option.values[0]
      ).catch((err) => console.error(err));
      resolve();
    });
  });
};

module.exports = changeFont;
