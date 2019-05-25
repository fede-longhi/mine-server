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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      driverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'SET NULL',
        references: {
          model: 'Drivers',
          key: 'id',
          as: 'driverId',
        },
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'SET NULL',
        references: {
          model: 'Users',
          key: 'id',
          as: 'userId',
        },
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Travels');
  }
};