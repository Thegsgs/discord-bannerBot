const { getServersList, changeProp } = require("../controllers/servers");
const tryCatchHelper = require("./tryCatchHelper");

const checkUpdatingServers = async () => {
  return new Promise(async (resolve, reject) => {
    const [updatingServers, err] = await tryCatchHelper(getServersList());
    if (err) reject(err);
    await updatingServers.forEach((server) =>
      changeProp(server.serverId, "isUpdating", false)
    );
    resolve();
  });
};

module.exports = checkUpdatingServers;
