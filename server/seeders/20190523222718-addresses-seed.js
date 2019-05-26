'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Addresses', [
      {
        id: 1,
        latitude: 14.09,
        longitude: 14.09,
        name: "avenida siempreviva 123, springfield",
        createdAt: new Date(),
        updatedAt: new Date()
        
      },
      {
        id: 2,
        latitude: 14.32,
        longitude: 14.32,
        name: "calle falsa 123, springfield",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ])
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Addresses', null, {});
  }
};
