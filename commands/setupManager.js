const changeContainerShape = require("./changeContainerShape");
const changeBackground = require("./changeBackground");
const changeTextPosition = require("./changeTextPosition");
const changeFont = require("./changeFont");
const changeTextSize = require("./changeTextSize");
const changeIcons = require("./changeIcons");
const colorsMenu = require("./colorsMenu");
const changeRoles = require("./changeRoles");
const setupMenu = require("./setupMenu");
const tryCatchHelper = require("../utils/tryCatchHelper");

const setupManager = async (interaction, client, permittedRoles) => {
  const [action, error] = await tryCatchHelper(
    setupMenu(interaction, client, permittedRoles)
  );

  if (error) {
    console.error(error);
  }

  if (action.customId === "exit") {
    interaction.deleteReply();
    return;
  }

  if (action.values.includes("shape-change")) {
    await changeContainerShape(action, client);
    await setupMenu(interaction, client, permittedRoles);
    return;
  }

  if (action.values.includes("background-change")) changeBackground(action);

  if (action.values.includes("font-change")) changeFont(action, client);

  if (action.values.includes("size-change")) changeTextSize(action);

  if (action.values.includes("colors-change")) {
    await colorsMenu(action, client);
    await setupMenu(interaction, client, permittedRoles);
  }

  if (action.values.includes("position-change"))
    changeTextPosition(action, client);

  if (action.values.includes("icons-change")) changeIcons(action, client);

  if (action.values.includes("role-settings"))
    changeRoles(action, client, permittedRoles);
};

module.exports = setupManager;
