const { getUpdatingServersList } = require("../controllers/servers");
const tryCatchHelper = require("./tryCatchHelper");

const getUpdatingServers = async (client) => {
  return new Promise(async (resolve, reject) => {
    const updatingGuilds = [];
    // Get servers with updating turned  on
    const [updatingServers, err] = await tryCatchHelper(
      getUpdatingServersList()
    );
    if (err) reject(err);
    // Convert servers that are updating to discord Guild format and return
    updatingServers.forEach(async (server) => {
      const [guildFromServer, err2] = await tryCatchHelper(
        client.guilds.fetch(server.serverId)
      );
      if (err2) reject(err2);
      updatingGuilds.push(guildFromServer);
    });
    resolve(updatingGuilds);
  });
};

module.exports = getUpdatingServers;
