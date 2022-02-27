const Server = require("../models/servers");

// TODO: Make server Id the doc id

const addServer = (serverId) => {
  return Server.create({ serverId })
    .then((createdSever) => createdSever)
    .catch((err) => console.log(err));
};

const changeProp = (serverId, propToUpdate, newValue) => {
  return Server.findOneAndUpdate(
    { serverId },
    { [propToUpdate]: newValue },
    { new: true, runValidators: true, upsert: true }
  )
    .then((updatedConfig) => updatedConfig.propToUpdate)
    .catch((err) => console.log(err));
};

const addRoleData = (serverId, newRoleName, newRoleId) => {
  return Server.findOneAndUpdate(
    { serverId },
    { $addToSet: { roles: { roleName: newRoleName, roleId: newRoleId } } },
    { new: true }
  )
    .then((data) => data)
    .catch((err) => console.log(err));
};

const removeRoleData = (serverId, roleToRemove) => {
  return Server.findOneAndUpdate(
    { serverId },
    { $pull: { roles: { roleId: roleToRemove } } },
    { new: true }
  )
    .then((data) => data)
    .catch((err) => console.log(err));
};

const getServerConfig = (id) => {
  return Server.findOne({ serverId: id })
    .then((server) => server)
    .catch((err) => console.log(err));
};

const getServersList = () => {
  return Server.find({ isUpdating: true })
    .then((list) => list)
    .catch((err) => console.err(err));
};

module.exports = {
  addServer,
  getServerConfig,
  changeProp,
  addRoleData,
  removeRoleData,
  getServersList,
};
