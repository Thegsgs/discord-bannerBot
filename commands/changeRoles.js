const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { getServerConfig } = require("../controllers/servers");
const addRole = require("../utils/addRole");
const removeRole = require("../utils/removeRole");
const tryCatchHelper = require("../utils/tryCatchHelper");

const changeRoles = async (interaction, client, permittedRoles) => {
  const serverConfig = await getServerConfig(interaction.guild.id);
  const buttonRow = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId("exit")
      .setLabel("Exit")
      .setStyle("DANGER")
      .setEmoji("<:close:942825923525349376>"),
    new MessageButton()
      .setCustomId("add")
      .setLabel("Add role")
      .setStyle("SUCCESS")
      .setEmoji("<:plus:943453208100093962>"),
    new MessageButton()
      .setCustomId("remove")
      .setLabel("Remove role")
      .setStyle("PRIMARY")
      .setEmoji("<:minus:943453219147890688>")
  );

  const rolesEmbed = new MessageEmbed()
    .setColor("#add8e6")
    .setAuthor("bannerBot", client.user.displayAvatarURL())
    .addFields({
      name: "__Permitted roles__:",
      value: `${
        serverConfig.roles
          .map((role, index) => `${index + 1}. ${role.roleName} \n`)
          .join("") || `Looks like there aren't any roles here yet.`
      }`,
    })
    .setFooter("bannerBot", client.user.displayAvatarURL());
  let isDel = false;

  await interaction.reply({
    embeds: [rolesEmbed],
    components: [buttonRow],
    fetchReply: true,
  });

  client.once("interactionCreate", (newInteraction) => {
    if (newInteraction.user.id !== interaction.user.id) return;
    collector.stop();
  });
  client.once("messageDelete", () => (isDel = true));

  const filter = (input) => input.user.id === interaction.user.id;
  const [collector, error] = await tryCatchHelper(
    interaction.channel.createMessageComponentCollector({
      filter,
      time: 45000,
    })
  );

  if (error) {
    interaction.followUp("An error has occured.");
  }

  collector.on("end", () => {
    if (isDel) return;
    interaction.deleteReply();
    isDel = true;
  });

  collector.on("collect", async (action) => {
    collector.stop();
    if (action.customId === "exit") return;
    if (action.customId === "add") addRole(action, permittedRoles);
    if (action.customId === "remove") removeRole(action, permittedRoles);
  });
};

module.exports = changeRoles;
