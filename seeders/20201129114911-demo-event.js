"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Events", [
      {
        title: "Test1",
        location: "Odesa",
        date: 123,
        hour: 12,
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Test2",
        location: "Odesa",
        date: 123,
        hour: 12,
        ownerId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: "Test2",
        location: "Odesa",
        date: 123,
        hour: 12,
        ownerId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Events", null, {});
  },
};
