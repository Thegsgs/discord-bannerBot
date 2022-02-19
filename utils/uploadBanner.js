const uploadBanner = async (interaction, bannerBuffer) => {
  interaction.guild
    .fetch()
    .then((thisGuild) => thisGuild.setBanner(bannerBuffer))
    .catch((err) => console.log(err));
};

module.exports = uploadBanner;
