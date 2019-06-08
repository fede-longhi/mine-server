'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('UserScores', [
      {
        value: 4.5,
        comments: "Todo ok",
        fromId: "987654399",
        toId: "123456782",
        travelId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('UserScores', null, {});
  }
};
