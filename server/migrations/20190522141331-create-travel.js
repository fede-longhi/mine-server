'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Travels', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            status: {
                type: Sequelize.STRING
            },
            smallPetQuantity: {
                type: Sequelize.INTEGER
            },
            mediumPetQuantity: {
                type: Sequelize.INTEGER
            },
            bigPetQuantity: {
                type: Sequelize.INTEGER
            },
            startDate: {
                type: Sequelize.DATE
            },
            endDate: {
                type: Sequelize.DATE
            },
            price: {
                type: Sequelize.DOUBLE
            },
            hasCompanion: {
                type: Sequelize.BOOLEAN
            },
            estimatedArrivalTime: {
                type: Sequelize.DOUBLE
            },
            driverDistance: {
                type: Sequelize.DOUBLE
            },
            driverLatitude: {
                type: Sequelize.DOUBLE
            },
            driverLongitude: {
                type: Sequelize.DOUBLE
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            driverId: {
                type: Sequelize.STRING,
                allowNull: true,
                onDelete: 'SET NULL',
                references: {
                    model: 'Drivers',
                    key: 'id',
                    as: 'driverId',
                },
            },
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
                onDelete: 'SET NULL',
                references: {
                    model: 'Users',
                    key: 'id',
                    as: 'userId',
                },
            },
            fromId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                onDelete: 'SET NULL',
                references: {
                    model: 'Addresses',
                    key: 'id',
                    as: 'fromId',
                },
            },
            toId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                onDelete: 'SET NULL',
                references: {
                    model: 'Addresses',
                    key: 'id',
                    as: 'toId',
                },
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Travels');
    }
};