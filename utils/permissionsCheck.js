const { Permissions } = require("discord.js");
const { getServerConfig } = require("../controllers/servers");
const tryCatchHelper = require("./tryCatchHelper");

const permissionsCheck = async (interaction) => {
  return new Promise(async (resolve, reject) => {
    await interaction.deferReply().catch((err) => console.error(err));
    // Check self roles for Administrator role
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
      reject("Insufficent bot permissions.");

    /* Try to get list of roles from server 
  If gets response check if user has permission */
    const [serverConfig, err] = await tryCatchHelper(
      getServerConfig(interaction.guild.id)
    );
    if (err) reject(err);
    // If first time setup must be owner, bot creator, admin or manage server
    if (!serverConfig) {
      if (
        interaction.user.id !== "367624248271044608" &&
        interaction.user.id !== interaction.guild.ownerId &&
        !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) &&
        !interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)
      )
        resolve(false);
      else resolve(true);
    } else {
      const permittedRoles = [];
      serverConfig.roles.map((roleObj) => permittedRoles.push(roleObj.roleId));

      // Guild owner, bot creator, admin and manage server role overrides permissions check
      if (
        interaction.user.id !== "367624248271044608" &&
        interaction.user.id !== interaction.guild.ownerId &&
        !interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) &&
        !interaction.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD) &&
        !permittedRoles.some((role) => interaction.member._roles.includes(role))
      )
        resolve(false);
      else {
        resolve(permittedRoles);
      }
    }
  });
};

module.exports = permissionsCheck;
