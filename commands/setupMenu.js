const { getServerConfig, addServer } = require("../controllers/servers");
const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
  MessageButton,
  MessageAttachment,
} = require("discord.js");
const changeContainerShape = require("../utils/changeContainerShape");
const changeBackground = require("../utils/changeBackground");
const changeTextPosition = require("../utils/changeTextPosition");
const changeFont = require("../utils/changeFont");
const changeTextSize = require("../utils/changeTextSize");
const changeIcons = require("../utils/changeIcons");
const colorsMenu = require("../utils/colorsMenu");
const changeRoles = require("../utils/changeRoles");
const updateBanner = require("../utils/updateBanner");
const tryCatchHelper = require("../utils/tryCatchHelper");

const setupMenu = async (interaction, client, permittedRoles) => {
  const serverConfig = await getServerConfig(interaction.guild.id);

  if (serverConfig) {
    const [banner, error1] = await tryCatchHelper(
      updateBanner(interaction.guild)
    );

    if (error1) {
      interaction.followUp("An error has occured.");
    }

    const updatedBanner = new MessageAttachment(banner, "updated-banner.png");

    const buttonRow = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("exit")
        .setLabel("Close")
        .setStyle("DANGER")
        .setEmoji("<:close:942825923525349376>"),
      new MessageButton()
        .setLabel("Join our Discord")
        .setStyle("LINK")
        .setEmoji("<:discord:948332203400658975>")
        .setURL("https://discord.gg/HY2yuZSd"),
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
      .setAuthor("bannerBot", client.user.displayAvatarURL())
      .setImage("attachment://updated-banner.png")
      .addFields(
        {
          name: "Current frame settings:",
          value: `🔹Border color: **${serverConfig.containerBorderColor}**
          🔹Font color: **${serverConfig.fontColor}**
          🔹Font name: **${serverConfig.containerFont}**
          🔹Text size: **${serverConfig.textSize}**
          🔹Background color: **${serverConfig.containerBackgroundColor}**
          🔹Background image: ${
            `[Link](${serverConfig.containerBackgroundImage})` || "**None**"
          }
                    🔹Custom Shape: ${
                      serverConfig.containerShapeCustom || "**None**"
                    }
                    `,
          inline: true,
        },
        {
          name: "Current general settings:",
          value: `
          🔹Background Image: ${
            `[Link](${serverConfig.backgroundImage})` || "**None**"
          }
          🔹Icons color: **${serverConfig.iconsColor}**
          🔹Icon 1: ${`[Link](${serverConfig.icon1})` || "**None**"}
          🔹Icon 2: ${`[Link](${serverConfig.icon2})` || "**None**"}
          🔹Icon 3: ${`[Link](${serverConfig.icon3})` || "**None**"}
                   `,
          inline: true,
        }
      )
      .setFooter(
        `${serverConfig.isUpdating ? "Updates are on" : "Updates are off"}`,
        `${
          serverConfig.isUpdating
            ? "https://i.imgur.com/HOKLLSn.png"
            : "https://i.imgur.com/fXc6ACP.png"
        }`
      );

    const [menu, error2] = await tryCatchHelper(
      interaction.followUp({
        embeds: [setupEmbed],
        components: [buttonRow, styleOptionsMenu, generalOptionsMenu],
        files: [updatedBanner],
        fetchReply: true,
      })
    );

    if (error2) interaction.followUp("An error has occured.");

    client.once("interactionCreate", (newInteraction) => {
      if (newInteraction.user.id !== interaction.user.id) return;
      collector.stop();
    });

    const filter = (input) => input.user.id === interaction.user.id;
    const [collector, error3] = await tryCatchHelper(
      interaction.channel.createMessageComponentCollector({
        filter,
        time: 45000,
      })
    );

    if (error3) interaction.followUp("An error has occured.");

    collector.on("end", (collected, endReason) => {
      if (endReason === "time") {
        interaction.followUp("Closing menu due to inactivity.");
      }
      if (!menu) return;
      try {
        menu.delete().catch((err) => console.error(err));
      } catch {
        interaction.channel.send("An error has occured.");
      }
    });

    collector.on("collect", async (action) => {
      collector.stop();
      if (action.customId === "exit") {
        collector.stop();
        return;
      }
      if (action.values.includes("shape-change"))
        await changeContainerShape(action, client).catch((err) =>
          console.error(err)
        );

      if (action.values.includes("background-change"))
        await changeBackground(action).catch((err) => console.error(err));

      if (action.values.includes("font-change"))
        await changeFont(action, client).catch((err) => console.error(err));

      if (action.values.includes("size-change"))
        await changeTextSize(action).catch((err) => console.error(err));

      if (action.values.includes("colors-change"))
        await colorsMenu(action, client).catch((err) => console.error(err));

      if (action.values.includes("position-change"))
        await changeTextPosition(action, client).catch((err) =>
          console.error(err)
        );

      if (action.values.includes("icons-change"))
        await changeIcons(action, client).catch((err) => console.error(err));

      if (action.values.includes("role-settings"))
        await changeRoles(action, client, permittedRoles).catch((err) =>
          console.error(err)
        );
      await setupMenu(interaction, client, permittedRoles).catch((err) =>
        console.error(err)
      );
    });
  } else {
    interaction.editReply("Starting first time setup...");
    await addServer(interaction.guild.id).catch((err) => console.error(err));
    await setupMenu(interaction, client, permittedRoles).catch((err) =>
      console.error(err)
    );
  }
};

module.exports = setupMenu;
