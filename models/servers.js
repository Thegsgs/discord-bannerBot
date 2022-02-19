const mongoose = require("mongoose");
const validator = require("validator");

const serverSchema = new mongoose.Schema({
  serverId: {
    required: true,
    type: String,
  },
  backgroundImage: {
    required: true,
    type: String,
    validate: {
      validator: (value) => validator.isURL(value),
    },
    default:
      "https://cdn.discordapp.com/attachments/939866981673349174/942873284830167070/unknown.png",
  },
  containerShape: {
    required: true,
    type: String,
    default: "circle",
  },
  containerShapeCustom: {
    required: false,
    type: String,
    default: "None",
  },
  containerBorderColor: {
    required: true,
    type: String,
    default: "#000",
  },
  containerBackgroundColor: {
    required: true,
    type: String,
    default: "#fff",
  },
  containerBackgroundImage: {
    required: false,
    type: String,
    validate: {
      validator: (value) => validator.isURL(value),
    },
  },
  containerFont: {
    required: true,
    type: String,
    default: "Anton",
  },
  fontColor: {
    required: true,
    type: String,
    default: "#000",
  },
  textSize: {
    required: true,
    type: String,
    default: "90",
  },
  icon1: {
    required: true,
    type: String,
    default: "https://i.postimg.cc/Bn3XDQZc/people.png",
  },
  icon2: {
    required: true,
    type: String,
    default: "https://i.postimg.cc/bwRdRcsX/mic.png",
  },
  icon3: {
    required: true,
    type: String,
    default: "https://i.postimg.cc/65n8yGKp/boost-white.png",
  },
  iconsColor: {
    required: true,
    type: String,
    default: "#fff",
  },
  fistTimeSetup: {
    required: true,
    type: String,
    default: true,
  },
  textPosition: {
    required: true,
    type: String,
    default: "center-center",
  },
  roles: [{ roleName: String, roleId: String }],
  lastUpdated: {
    required: true,
    type: Number,
    default: () => {
      const date = new Date();
      return date.getUTCMinutes();
    },
  },
});

module.exports = mongoose.model("server", serverSchema);
