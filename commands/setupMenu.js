const { getServerConfig, addServer } = require("../controllers/servers");
const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
  MessageAttachment,
} = require("discord.js");
const changeContainerShape = require("./changeContainerShape");
const changeBackground = require("./changeBackground");
const changeTextPosition = require("./changeTextPosition");
const changeFont = require("./changeFont");
const changeTextSize = require("./changeTextSize");
const changeIcons = require("./changeIcons");
const colorsMenu = require("./colorsMenu");
const changeRoles = require("./changeRoles");
const updateBanner = require("../utils/updateBanner");
const tryCatchHelper = require("../utils/tryCatchHelper");

const setupMenu = async (interaction, client, permittedRoles) => {
  const serverConfig = await getServerConfig(interaction.guild.id);

  if (serverConfig) {
    const [banner, error1] = await tryCatchHelper(updateBanner(interaction));

    if (error1) {
      interaction.followUp("An error has occured.");
    }

    const updatedBanner = await new MessageAttachment(
      banner,
      "updated-banner.png"
    );

    const buttonRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("exit")
        .setLabel("Exit")
        .setStyle("DANGER")
        .setEmoji("<:close:942825923525349376>"),
      new MessageButton()
        .setLabel("Tutorial")
        .setStyle("LINK")
        .setEmoji("<:youtube:942825849684656158>")
        .setURL("https://nodejs.org/en/docs/guides/debugging-getting-started/"),
      new MessageButton()
        .setLabel("Support")
        .setStyle("LINK")
        .setEmoji("💵")
        .setURL("https://www.patreon.com/bannerBot")
    );

    const styleOptionsMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("style-options")
        .setPlaceholder("Customization Options:")
        .addOptions([
          {
            label: "Change Background",
            description: "Set a new banner background image from file or URL",
            value: "background-change",
            emoji: "<:backgrounds:939868806166224956>",
          },
          {
            label: "Change Shape",
            description: "Set a new shape for the number frames",
            value: "shape-change",
            emoji: "<:shapes:939868744363163688>",
          },
          {
            label: "Change Font",
            description: "Choose a new font from a collection",
            value: "font-change",
            emoji: "<:fonts:939868716026429530>",
          },
          {
            label: "Change text size",
            description: "Pick a new text size",
            value: "size-change",
            emoji: "<:size:942837778859823114>",
          },
          {
            label: "Change text position",
            description: "Position the text inside the frames",
            value: "position-change",
            emoji: "<:position:939933078023983185>",
          },
          {
            label: "Change Colors",
            description: "Opens a new menu for coloring options",
            value: "colors-change",
            emoji: "<:colors:939868880757743627>",
          },
          {
            label: "Change Icons",
            description: "Change the icons",
            value: "icons-change",
            emoji: "<:icons:939868685508685844>",
          },
        ])
    );

    const generalOptionsMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId("general-options")
        .setPlaceholder("General Options:")
        .addOptions([
          {
            label: "Roles Options",
            description: "Set which roles can customize the banner",
            value: "role-settings",
            emoji: "<:mod:943446130182729788>",
          },
        ])
    );

    const setupEmbed = new MessageEmbed()
      .setColor(serverConfig.containerBorderColor)
      .setTitle("__How to use bannerBot:__")
      .setAuthor("bannerBot", client.user.displayAvatarURL())
      .setImage("attachment://updated-banner.png")
      .addFields(
        {
          name: "Instructions:",
          value: `Your current banner settings can be seen below.
             To start using the customization menu, please select an option from the drop down menu below.
             
             You will be presented with further options and instructions.
             After each change you can come back to this menu to view your changes before they get uploaded to the banner on the next update.`,
        },
        { name: "\u200B", value: "\u200B" },
        {
          name: "__Current frame settings__:",
          value: `__Border color__: **${serverConfig.containerBorderColor}**
                    __Font color__: **${serverConfig.fontColor}**
                    __Font name__: **${serverConfig.containerFont}**
                    __Text size__: **${serverConfig.textSize}**
                    __Background color__: **${
                      serverConfig.containerBackgroundColor
                    }**
                    __Background image__: ${
                      serverConfig.containerBackgroundImage || "**None**"
                    }
                    __Custom Shape__: ${
                      serverConfig.containerShapeCustom || "**None**"
                    }
                    `,
          inline: true,
        },
        {
          name: "__Current general settings__:",
          value: `__Background Image__: ${
            serverConfig.backgroundImage || "**None**"
          }
                    __Icons color__: **${serverConfig.iconsColor}**
                    __Icon 1__: ${serverConfig.icon1 || "**None**"}
                    __Icon 2__: ${serverConfig.icon2 || "**None**"}
                    __Icon 3__: ${serverConfig.icon3 || "**None**"}
                   `,
          inline: true,
        }
      )
      .setFooter("bannerBot", client.user.displayAvatarURL());
    let isDel = false;

    await interaction.editReply({
      embeds: [setupEmbed],
      components: [buttonRow, styleOptionsMenu, generalOptionsMenu],
      files: [updatedBanner],
      fetchReply: true,
    });

    client.once("interactionCreate", (newInteraction) => {
      if (newInteraction.user.id !== interaction.user.id) return;
      collector.stop();
    });
    client.once("messageDelete", () => (isDel = true));

    const filter = (input) => input.user.id === interaction.user.id;
    const [collector, error2] = await tryCatchHelper(
      interaction.channel.createMessageComponentCollector({
        filter,
        time: 45000,
      })
    );

    if (error2) {
      interaction.followUp("An error has occured.");
    }

    collector.on("end", () => {
      if (isDel) return;
      interaction.deleteReply();
      isDel = true;
    });
    collector.on("collect", async (action) => {
      collector.stop();
      if (action.customId === "exit") return;
      if (action.values.includes("shape-change"))
        await changeContainerShape(action, client);

      if (action.values.includes("background-change")) changeBackground(action);

      if (action.values.includes("font-change")) changeFont(action, client);

      if (action.values.includes("size-change")) changeTextSize(action);

      if (action.values.includes("colors-change")) colorsMenu(action, client);

      if (action.values.includes("position-change"))
        changeTextPosition(action, client);

      if (action.values.includes("icons-change")) changeIcons(action, client);

      if (action.values.includes("role-settings"))
        changeRoles(action, client, permittedRoles);
    });
  } else {
    interaction.editReply("Starting first time setup...");
    await addServer(interaction.guild.id);
    interaction.editReply(
      `You server has been set up, please run /setup again to start customizing.`
    );
  }
};

module.exports = setupMenu;
