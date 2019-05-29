'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('Drivers', [{
                id: '987654321',
                status: "connected",
                licenseNumber: "123",
                totalScore: 50,
                scoreQuantity: 10,
                partyId: 3,
                travelAmount: 12,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '987654322',
                status: "available",
                licenseNumber: "123",
                totalScore: 45,
                scoreQuantity: 10,
                partyId: 6,
                travelAmount: 15,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '987654399',
                status: "available",
                licenseNumber: "123",
                totalScore: 45,
                scoreQuantity: 10,
                partyId: 1,
                travelAmount: 15,
                createdAt: new Date(),
                updatedAt: new Date()
            },

        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('Drivers', null, {});
    }
};