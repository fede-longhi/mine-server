'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserScores', []);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserScores', null, {});
  }
};
