const { addRoleData } = require("../controllers/servers");
const tryCatchHelper = require("./tryCatchHelper");

const addRole = async (interaction, permittedRoles) => {
  return new Promise(async (resolve, reject) => {
    const filter = (message) => message.author.id == interaction.user.id;
    interaction.reply({
      content: "Please tag a role",
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
      reject(error);
    }

    const role = messages.first().mentions.roles.first();
    if (!role) {
      interaction.followUp("Invalid input, please try again.");
      resolve();
    }
    if (permittedRoles.includes(role.id)) {
      interaction.followUp("This role is already permitted to use bannerBot.");
      resolve();
    }
    interaction.followUp(`Adding role ${role.name}...`);
    await addRoleData(interaction.guild.id, role.name, role.id);
    resolve();
  });
};

module.exports = addRole;
