const { ClusterManager } = require("discord.js-cluster");
const { token } = require("./config.json");
const manager = new ClusterManager("./bot.js", {
  token: token,
});

manager.on("clusterCreate", (cluster) =>
  console.log(`Launched cluster ${cluster.id}`)
);

manager.spawn();
