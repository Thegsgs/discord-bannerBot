const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const tryCatchHelper = require("../utils/tryCatchHelper");

const helpMenu = async (client, interaction, embedNum) => {
  const generalHelpEmbed = new MessageEmbed()
    .setColor("#ffd1dc")
    .setAuthor("bannerBot", client.user.displayAvatarURL())
    .addFields({
      name: "<:binoculars:948678441673314304> General overview:",
      value: `To view your current banner settings, to set up the bot for the first time and to start editing your new banner, please run the /setup command.
                You will be then presented with a menu. 
                At the top of the menu you will see your current banner settings.
                If this is your first time running the bot the settings will be the default settings.
                Under your current settings you will see the current image of you banner. \n
                The banner image will update after each change you make to it using the menu.
                The banner design will not apply until you have ran the /start-updating command. \n
                \u200b`,
    })
    .setFooter("Page 1/4");

  const customizeHelpEmbed = new MessageEmbed()
    .setColor("#ffd1dc")
    .setAuthor("bannerBot", client.user.displayAvatarURL())
    .addFields(
      {
        name: `<:start:948676054665551873> How to start customizing the banner: \n`,
        value: `To start customizing the banner open the /setup menu and click on the "Customization options" drop down menu.
                You will be presented with a menu of possible customization options. \n
                 \u200b`,
      },
      {
        name: "<:backgrounds:939868806166224956> Change background:",
        value: `Copy and paste any image you want from the internet or paste and send its url. 
                Note, the url needs to end with either .png or .jpg, if you're having issues using a link, paste and send the image in the chat instead. \n
                Note, if the image aspect ratio doesn't fit the discord banner the bot will stretch it to fit so the result might be different from what you expected.
                In case this happens, looking for the same image in a different aspect ratio or cropping it yourself with an image editing tool should solve the issue. \n
                 \u200b`,
      },
      {
        name: "<:shapes:939868744363163688> Change shape:",
        value: `After choosing this option you will be presented with a list of basic shapes and an option to set your own custom shape.
                Custom frame shape setting is done by using a backgroundless .png image. If you posted a .png image and the shape on the banner turns out to be a square or rectangle that means the picture you used had a background. \n
                \u200b`,
      },
      {
        name: "<:fonts:939868716026429530> Change font:",
        value: `Pick a font from a list, all fonts are taken from google fonts so feel free to go there and preview the fonts before picking. \n
        \u200b`,
      }
    )
    .setFooter("Page 2/4");

  const customizeHelpEmbed2 = new MessageEmbed()
    .setColor("#ffd1dc")
    .setAuthor("bannerBot", client.user.displayAvatarURL())
    .addFields(
      {
        name: "<:size:942837778859823114> Text size:",
        value: `You can Resize the numbers for whatever reason to fit the frame you chose. \n
        \u200b`,
      },
      {
        name: "<:position:939933078023983185> Text position:",
        value: `Same as with text size, if the shape you chose clips through the text, reposition the text inside the frame so it's visible again. \n
        \u200b`,
      },
      {
        name: "<:colors:939868880757743627> Colors menu:",
        value: `Presents a menu to change colors of different parts of the banner. Colors are represented in HEX, if you're unfamiliar with HEX colors you can read about it [here](https://www.color-hex.com/).
                Typing colors by their names e.g: "Red" or "Green" will not work. \n
                Additionaly in the frame background color option, you can write "custom" instead of a color HEX to set an image as the frame background.
                Setting an image is the same as setting a background image for the whole banner (See "Change background"). \n
  \u200b`,
      },
      {
        name: "<:icons:939868685508685844> Change icons:",
        value: `Set a different image for any one of the icons. Setting images works the same way as for setting a background. (See "Change background").
                Note that it's better to use very small images otherwise the icons can stretch and look unlike its original image. Also using non .png images can result in icons having a background (See "Colors menu"). \n
    \u200b`,
      }
    )
    .setFooter("Page 3/4");

  const otherOptionsHelpEmbed = new MessageEmbed()
    .setColor("#ffd1dc")
    .setAuthor("bannerBot", client.user.displayAvatarURL())
    .addFields({
      name: "<:mod:943446130182729788> Role options:",
      value: `Initially only those with either "Administrator", "Manage server" or "Owner" roles can access the bot but you can add other roles to be permitted to use the bot if you want. \n
      \u200b`,
    })
    .setFooter("Page 4/4");

  const buttonRow = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("close")
      .setLabel("Close")
      .setStyle("DANGER")
      .setEmoji("<:close:942825923525349376>")
      .setCustomId("close"),
    new MessageButton()
      .setLabel("Prev")
      .setStyle("SECONDARY")
      .setEmoji("<:left:948682627550961726>")
      .setCustomId("prev"),
    new MessageButton()
      .setLabel("Next")
      .setStyle("SECONDARY")
      .setEmoji("<:right:948682639966109738>")
      .setCustomId("next")
  );

  const embedArr = [
    generalHelpEmbed,
    customizeHelpEmbed,
    customizeHelpEmbed2,
    otherOptionsHelpEmbed,
  ];

  embedNum = embedNum ? embedNum : 0;

  const [menu, err] = await tryCatchHelper(
    interaction.followUp({
      embeds: [embedArr[embedNum]],
      components: [buttonRow],
    })
  );

  if (err) console.error(err);

  const filter = (input) => input.user.id === interaction.user.id;
  const [collector, err2] = await tryCatchHelper(
    interaction.channel.createMessageComponentCollector({
      filter,
      time: 120000,
    })
  );

  if (err2) interaction.followUp("An error has occured.");

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
    if (action.customId === "close") {
      collector.stop();
      return;
    }
    if (action.customId === "next") {
      embedNum++;
      if (embedNum > embedArr.length - 1) embedNum = 0;
      helpMenu(client, interaction, embedNum);
    }

    if (action.customId === "prev") {
      embedNum--;
      if (embedNum < 0) embedNum = embedArr.length - 1;
      helpMenu(client, interaction, embedNum);
    }
  });
};

module.exports = helpMenu;
