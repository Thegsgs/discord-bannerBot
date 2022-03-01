const makeBanner = require("./makeBanner");
const { getServerConfig } = require("../controllers/servers");
const tryCatchHelper = require("./tryCatchHelper");

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

const updateBanner = async (guild) => {
  const [serverConfig, err] = await tryCatchHelper(getServerConfig(guild.id));
  if (err) console.error(err);
  const thisGuild = await guild.fetch().catch((err) => console.error(err));
  const inVc = countVcMembers(thisGuild);

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
};

module.exports = updateBanner;
