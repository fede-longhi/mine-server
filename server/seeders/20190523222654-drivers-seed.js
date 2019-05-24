'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Drivers', [
      {
        status: "connected",
        licenseNumber: "123",
        totalScore: 50,
        scoreQuantity: 10,
        partyId: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status: "available",
        licenseNumber: "123",
        totalScore: 45,
        scoreQuantity: 10,
        partyId: 6,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Drivers', null, {});
  }
};
