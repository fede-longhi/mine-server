'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Vehicles', []);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Vehicles', null, {});
  }
};
