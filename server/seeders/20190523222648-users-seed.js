'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        status: 'connected',
        totalScore: 10,
        scoreQuantity: 2,
        partyId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status: 'offline',
        totalScore: 10,
        scoreQuantity: 2,
        partyId: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        status: 'connected',
        totalScore: 10,
        scoreQuantity: 2,
        partyId: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
