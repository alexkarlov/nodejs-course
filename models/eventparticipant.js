"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class EventParticipant extends Model {}
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
