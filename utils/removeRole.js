const removeRoleData = require("../controllers/servers");
const tryCatchHelper = require("../utils/tryCatchHelper");

const removeRole = async (interaction, permittedRoles) => {
  const filter = (message) => message.author.id == interaction.user.id;
  interaction.reply({
    content: "Please tag a role to remove.",
    embeds: [],
    components: [],
  });
  const [messages, error] = await tryCatchHelper(
    interaction.channel.awaitMessages({
      filter,
      time: 45000,
      max: 1,
      errors: ["time"],
    })
  );

  if (error) {
    interaction.followUp("An error has occured.");
  }

  const role = messages.first().mentions.roles.first();
  if (!role) {
    interaction.followUp("Invalid input, please try again.");
    return;
  }
  if (!permittedRoles.includes(role.id)) {
    interaction.followUp(
      "This role cannot be removed as it was a permitted role in the first place."
    );
    return;
  }
  interaction.followUp(`Removing role ${role.name}...`);
  await removeRoleData(interaction.guild.id, role.id);
  interaction.followUp(`Removed role ${role.name} successfully!`);
};

module.exports = removeRole;
