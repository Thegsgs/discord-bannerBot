const { getUpdatingServersList } = require("../controllers/servers");
const tryCatchHelper = require("./tryCatchHelper");

const getUpdatingServers = async (client) => {
  return new Promise(async (resolve, reject) => {
    const updatingGuilds = [];
    const [updatingServers, err] = await tryCatchHelper(
      getUpdatingServersList()
    );
    if (err) reject(err);
    updatingServers.forEach(async (server) => {
      const guildFromServer = await client.guilds.fetch(server.serverId);
      updatingGuilds.push(guildFromServer);
    });
    resolve(updatingGuilds);
  });
};

module.exports = getUpdatingServers;
