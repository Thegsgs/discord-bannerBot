const uploadBanner = async (client, guild, bannerBuffer) => {
  client.guilds
    .fetch(guild.id)
    .then((thisGuild) => thisGuild.setBanner(bannerBuffer))
    .catch((err) => console.log(err));
};

module.exports = uploadBanner;
