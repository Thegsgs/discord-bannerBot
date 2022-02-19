const { Client } = require("discord.js-cluster");
const { Intents } = require("discord.js");
const mongoose = require("mongoose");
const setupMenu = require("./commands/setupMenu");
const permissionsCheck = require("./utils/permissionsCheck");
const updateManager = require("./utils/updateManager");

mongoose.connect("mongodb://localhost:27017/serversdb");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.once("ready", () =>
  console.log(`Cluster ${client.cluster.id} is ready!`)
);

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  // Checks if user is permitted and server has a banner.
  const permittedRoles = await permissionsCheck(interaction);
  // If user is not permitted permitted roles is equal to false.
  if (!permittedRoles) {
    interaction.reply("You're not permitted to use these commands!");
    return;
  }

  const { commandName } = interaction;

  if (commandName === "start-updating") {
    await interaction.deferReply();
    await updateManager(interaction, "start");
  } else if (commandName === "stop-updating") {
    await interaction.deferReply();
    await updateManager(interaction, "stop");
  } else if (commandName === "setup") {
    await interaction.deferReply();
    await setupMenu(interaction, client, permittedRoles);
  }
});

client.login();
