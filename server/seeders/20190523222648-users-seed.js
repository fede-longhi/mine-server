'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Users', [{
                id: '123456780',
                status: 'connected',
                totalScore: 10,
                scoreQuantity: 2,
                partyId: 2,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '123456781',
                status: 'offline',
                totalScore: 10,
                scoreQuantity: 2,
                partyId: 4,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '123456782',
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