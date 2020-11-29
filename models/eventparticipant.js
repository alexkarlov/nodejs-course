"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EventParticipant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EventParticipant.belongsTo(models.User, {
        as: "user",
        foreignKey: "userId",
      });
      EventParticipant.belongsTo(models.Event, {
        as: "event",
        foreignKey: "eventId",
      });
    }
  }
  EventParticipant.init(
    {
      eventId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "EventParticipant",
    }
  );
  return EventParticipant;
};
