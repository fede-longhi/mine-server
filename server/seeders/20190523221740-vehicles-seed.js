'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Vehicles', [
      {
        brand: "Fiat",
        model: "Palio",
        licensePlate: "abc-123",
        color: "gray",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Vehicles', null, {});
  }
};
