'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.bulkInsert('Parties', [
     {
      name: 'Cosme fulanito',
      phone: '12345678',
      dni: '36716049',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Chano Carpentier',
      phone: '98765432',
      dni: '18932427',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Federico Longhi',
      phone: '98765432',
      dni: '36716049',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Ruben Jimenez',
      phone: '98765432',
      dni: '18932427',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Hernan',
      phone: '98765432',
      dni: '18932427',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Homero Simpson',
      phone: '98765432',
      dni: '18932427',
      createdAt: new Date(),
      updatedAt: new Date()
    },
  ])
  },

  down: (queryInterface, Sequelize) => {
   return queryInterface.bulkDelete('Parties', null, {});
  }
};
