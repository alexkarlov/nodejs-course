"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.belongsToMany(models.User, {
        through: models.EventParticipant,
        foreignKey: "eventId",
        as: "participants",
      });
      Event.belongsTo(models.User, {
        as: "owner",
        foreignKey: "ownerId",
      });
    }
  }
  Event.init(
    {
      title: DataTypes.STRING,
      location: DataTypes.STRING,
      date: DataTypes.DATE,
      hour: DataTypes.INTEGER,
      ownerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Event",
    }
  );
  return Event;
};
