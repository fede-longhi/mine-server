'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Travels', [
      {
        status: 'Completed',
        smallPetQuantity: 1,
        mediumPetQuantity: 0,
        bigPetQuantity: 0,
        price: 500.0,
        hasCompanion: true,
        driverId: '987654321',
        userId: '123456782',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Travels', null, {});
  }
};
