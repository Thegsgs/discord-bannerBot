const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, token } = require("./config.json");

const commands = [
  new SlashCommandBuilder().setName("help").setDescription("Opens help menu."),
  new SlashCommandBuilder()
    .setName("start-updating")
    .setDescription("Starts automatically updates the banner every 5 mintues."),
  new SlashCommandBuilder()
    .setName("stop-updating")
    .setDescription("Stops updating banner."),
  new SlashCommandBuilder().setName("setup").setDescription("Banner settings."),
].map((command) => command.toJSON());

const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(Routes.applicationCommands(clientId), { body: commands })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
