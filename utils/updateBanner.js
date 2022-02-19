const makeBanner = require("./makeBanner");
const { getServerConfig } = require("../controllers/servers");

const countVcMembers = (thisGuild) => {
  let inVc = 0;
  return thisGuild.fetch().then((guild) => {
    return guild.channels.fetch().then((channels) => {
      channels
        .filter((channel) => channel.isVoice())
        .forEach((channel) => {
          inVc += channel.members.size;
        });
      return inVc;
    });
  });
};

const updateBanner = async (interaction) => {
  const serverConfig = await getServerConfig(interaction.guild.id);
  return interaction.guild
    .fetch()
    .then((thisGuild) => {
      return countVcMembers(thisGuild)
        .then((inVc) => {
          return makeBanner(
            serverConfig.backgroundImage,
            serverConfig.containerShape,
            serverConfig.containerShapeCustom,
            serverConfig.containerFont,
            serverConfig.fontColor,
            serverConfig.textSize,
            serverConfig.containerBorderColor,
            serverConfig.containerBackgroundColor,
            serverConfig.containerBackgroundImage,
            serverConfig.icon1,
            serverConfig.icon2,
            serverConfig.icon3,
            serverConfig.iconsColor,
            serverConfig.textPosition,
            thisGuild.memberCount,
            inVc,
            thisGuild.premiumSubscriptionCount
          );
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

module.exports = updateBanner;
