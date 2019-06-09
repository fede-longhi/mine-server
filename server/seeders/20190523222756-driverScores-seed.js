'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('DriverScores', [
      {
        value: 4.5,
        comments: "Todo ok",
        fromId: "123456782",
        toId: "987654399",
        travelId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('DriverScores', null, {});
  }
};
