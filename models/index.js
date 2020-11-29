"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.userModel = require(path.join(__dirname, "..", "models", "user"))(
  sequelize,
  Sequelize
);
db.eventModel = require(path.join(__dirname, "..", "models", "event"))(
  sequelize,
  Sequelize
);
db.eventParticipantModel = require(path.join(
  __dirname,
  "..",
  "models",
  "eventparticipant"
))(sequelize, Sequelize);
db.eventModel.belongsToMany(db.userModel, {
  through: db.eventParticipantModel,
  foreignKey: "eventId",
  as: "participants",
});
db.eventModel.belongsTo(db.userModel, {
  as: "owner",
  foreignKey: "ownerId",
});
db.userModel.belongsToMany(db.eventModel, {
  through: db.eventParticipantModel,
  foreignKey: "userId",
  as: "events",
});
db.userModel.hasMany(db.eventModel, {
  as: "ownEvents",
  foreignKey: "ownerId",
});

module.exports = db;
