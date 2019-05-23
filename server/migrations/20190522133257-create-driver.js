'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Drivers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Drivers');
  }
};