const { Client } = require("discord.js-cluster");
const { Intents, Permissions } = require("discord.js");
const mongoose = require("mongoose");
const setupMenu = require("./commands/setupMenu");
const permissionsCheck = require("./utils/permissionsCheck");
const updateManager = require("./utils/updateManager");
const getUpdatingServers = require("./utils/getUpdatingServers");
const resumeUpdates = require("./utils/resumeUpdates");
const tryCatchHelper = require("./utils/tryCatchHelper");
const helpMenu = require("./commands/helpMenu");

mongoose.connect("mongodb://localhost:27017/serversdb");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ],
});

client.once("ready", async () => {
  process.on("unhandledRejection", (error) => {
    console.error("Unhandled promise rejection:", error);
  });
  // Bot is ready
  console.log(`Cluster ${client.cluster.id} is ready!`);
  // Check which servers have updating turned on
  const [updatingGuildsArr, err] = await tryCatchHelper(
    getUpdatingServers(client)
  );
  if (err) {
    console.error(err);
  }
  // Resume updates on all servers which have it turned on and return if perms are missing.
  updatingGuildsArr.forEach((guild) => {
    if (!guild.me.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) return;
    resumeUpdates(client, guild);
  });
  console.log(`${updatingGuildsArr.length} servers are resuming updates.`);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  // Check if server has banner
  const noBannerTiers = ["NONE", "TIER_1"];
  if (noBannerTiers.includes(interaction.guild.premiumTier)) {
    interaction.reply(
      "Sorry but it looks like your server does not have a banner."
    );
    return;
  }

  const [permittedRoles, err] = await tryCatchHelper(
    permissionsCheck(interaction)
  );
  if (err) {
    interaction.editReply(err);
    return;
  }

  const { commandName } = interaction;

  if (commandName === "start-updating") {
    await updateManager(client, interaction, "start");
  } else if (commandName === "stop-updating") {
    await updateManager(client, interaction, "stop");
  } else if (commandName === "setup") {
    await setupMenu(interaction, client, permittedRoles);
  } else if (commandName === "help") {
    await helpMenu(client, interaction);
  }
});

client.login();
