const todosController = require('../controllers').todos;
const todoItemsController = require('../controllers').todoItems;
const partiesController = require('../controllers').parties;
const driversController = require('../controllers').drivers;
const usersController = require('../controllers').users;
const travelsController = require('../controllers').travels;
const userScoresController = require('../controllers').userscores;
const driverScoresController = require('../controllers').driverscores;
const addressesController = require('../controllers').addresses;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the UberPets API!',
  }));

  // ***************** TODOS *******************
  app.post('/api/todos', todosController.create);
  app.get('/api/todos', todosController.list);
  app.get('/api/todos/:todoId', todosController.retrieve);
  app.put('/api/todos/:todoId', todosController.update);
  app.delete('/api/todos/:todoId', todosController.destroy);

  // ****************** TODO ITEMS **************
  app.post('/api/todos/:todoId/items', todoItemsController.create);
  app.put('/api/todos/:todoId/items/:todoItemId', todoItemsController.update);
  app.delete(
    '/api/todos/:todoId/items/:todoItemId', todoItemsController.destroy
  );

  // ****************** PARTY ********************
  app.post('/api/parties', partiesController.create);
  app.get('/api/parties', partiesController.list);
  app.get('/api/parties/:partyId', partiesController.retrieve);
  app.put('/api/parties/:partyId', partiesController.update);
  app.delete('/api/parties/:partyId', partiesController.destroy);

  // ****************** DRIVERS *******************
  app.post('/api/drivers', driversController.create);
  app.get('/api/drivers', driversController.list);
  app.get('/api/drivers/:driverId', driversController.retrieve);
  app.put('/api/drivers/:driverId', driversController.update);
  app.delete('/api/drivers/:driverId', driversController.destroy);

  // ********************* USERS *************************
  app.post('/api/users', usersController.create);
  app.get('/api/users', usersController.list);
  app.get('/api/users/:userId', usersController.retrieve);
  app.put('/api/users/:userId', usersController.update);
  app.delete('/api/users/:userId', usersController.destroy);

  // ********************* TRAVELS *************************
  app.post('/api/travels', travelsController.create);
  app.get('/api/travels', travelsController.list);
  app.get('/api/travels/:travelId', travelsController.retrieve);
  app.put('/api/travels/:travelId', travelsController.update);
  app.delete('/api/travels/:travelId', travelsController.destroy);

  
  // ********************* DRIVER SCORES *************************

  // ********************* USER SCORES *************************

  // For any other request method on todo items, we're going to return "Method Not Allowed"
  app.all('/api/todos/:todoId/items', (req, res) =>
    res.status(405).send({
      message: 'Method Not Allowed',
  }));
};