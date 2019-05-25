'use strict';
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('DriverScores', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            value: {
                type: Sequelize.DOUBLE
            },
            comments: {
                type: Sequelize.STRING
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            fromId: {
                type: Sequelize.STRING,
                allowNull: false,
                onDelete: 'CASCADE',
                references: {
                    model: 'Users',
                    key: 'id',
                    as: 'fromId',
                },
            },
            toId: {
                type: Sequelize.STRING,
                allowNull: false,
                onDelete: 'CASCADE',
                references: {
                    model: 'Drivers',
                    key: 'id',
                    as: 'toId',
                }
            },
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('DriverScores');
    }
};