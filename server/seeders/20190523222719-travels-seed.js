'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Travels', []);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Travels', null, {});
  }
};
