const { Permissions } = require("discord.js");
const { getServerConfig } = require("../controllers/servers");
const tryCatchHelper = require("./tryCatchHelper");

const permissionsCheck = async (interaction) => {
  return new Promise(async (resolve, reject) => {
    await interaction.deferReply().catch((err) => console.error(err));
    const userId = interaction.user.id;
    const ownerId = interaction.guild.ownerId;
    const guildMember = interaction.member;

    //Check permissions in guild
    if (!interaction.guild.me.permissions.has(Permissions.FLAGS.MANAGE_GUILD))
      reject(`Please enable the "Manage server" permission for this bot.`);

    // Check permissions in channel

    if (
      !interaction.guild.me
        .permissionsIn(interaction.channel)
        .has(Permissions.FLAGS.VIEW_CHANNEL)
    )
      reject(
        `Please enable the View Channel permission in this channel for bannerBot.`
      );
    if (
      !interaction.guild.me
        .permissionsIn(interaction.channel)
        .has(Permissions.FLAGS.SEND_MESSAGES)
    )
      reject(
        `Please enable the Send Messages and View Channel permission in this channel for bannerBot.`
      );
    if (
      !interaction.guild.me
        .permissionsIn(interaction.channel)
        .has(Permissions.FLAGS.ATTACH_FILES)
    )
      reject(
        `Please enable the Attach Files permission in this channel for bannerBot.`
      );
    if (
      !interaction.guild.me
        .permissionsIn(interaction.channel)
        .has(Permissions.FLAGS.USE_EXTERNAL_EMOJIS)
    )
      reject(
        `Please enable the Use External Emojis permission in this channel for bannerBot.`
      );

    /* Try to get list of roles from server 
  If gets response check if user has permission */

    const [serverConfig, err] = await tryCatchHelper(
      getServerConfig(interaction.guild.id)
    );
    if (err) reject(err);

    // If first time setup must be owner, bot creator, admin or manage server
    if (!serverConfig) {
      if (
        userId !== "367624248271044608" && // If not me
        userId !== interaction.guild.ownerId &&
        !guildMember.permissions.has(Permissions.FLAGS.MANAGE_GUILD, [
          checkAdmin,
        ])
      )
        reject("Insufficient permission to use this bot.");
      else resolve(true);
    } else {
      const permittedRoles = [];
      serverConfig.roles.map((roleObj) => permittedRoles.push(roleObj.roleId));

      // Guild owner, bot creator, admin and manage server role overrides permissions check
      if (
        userId !== "367624248271044608" &&
        userId !== ownerId &&
        !guildMember.permissions.has(Permissions.FLAGS.MANAGE_GUILD, [
          checkAdmin,
        ]) &&
        !permittedRoles.some((role) => guildMember._roles.includes(role))
      )
        reject("Insufficient permission to use this bot.");
      else {
        resolve(permittedRoles);
      }
    }
  });
};

module.exports = permissionsCheck;
