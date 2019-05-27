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
        // from: '{"latitude":14.01,"longitude":14.01}',
        // to:'{"latitude":14.10,"longitude":14.10}',
        fromId: 1,
        toId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Travels', null, {});
  }
};
