'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  event.init({
    title: DataTypes.STRING,
    location: DataTypes.STRING,
    date: DataTypes.DATE,
    hour: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'event',
  });
  return event;
};