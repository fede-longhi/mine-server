'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('DriverScores', []);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('DriverScores', null, {});
  }
};
