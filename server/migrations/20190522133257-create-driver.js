'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('Drivers', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            status: {
                type: Sequelize.STRING
            },
            licenseNumber: {
                type: Sequelize.STRING
            },
            totalScore: {
                type: Sequelize.DOUBLE
            },
            scoreQuantity: {
                type: Sequelize.INTEGER
            },
            travelAmount: {
                type: Sequelize.INTEGER
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            partyId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                onDelete: 'SET NULL',
                references: {
                    model: 'Parties',
                    key: 'id',
                    as: 'partyId',
                },
            },
            locationId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                onDelete: 'SET NULL',
                references: {
                    model: 'Addresses',
                    key: 'id',
                    as: 'locationId',
                }, 
            },
            vehicleId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                onDelete: 'SET NULL',
                references: {
                    model: 'Vehicles',
                    key: 'id',
                    as: 'vehicleId',
                }, 
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('Drivers');
    }
};