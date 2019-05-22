const todosController = require('../controllers').todos;
const todoItemsController = require('../controllers').todoItems;
const partiesController = require('../controllers').parties;
const driversController = require('../controllers').drivers;

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the Todos API!',
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

  // ****************** DRIVERS *******************
  app.post('/api/drivers', driversController.create);
  app.get('/api/drivers', driversController.list);

  // ********************* USERS *************************

  // ********************* TRAVELS *************************

  // ********************* DRIVER SCORES *************************

  // ********************* USER SCORES *************************

  // For any other request method on todo items, we're going to return "Method Not Allowed"
  app.all('/api/todos/:todoId/items', (req, res) =>
    res.status(405).send({
      message: 'Method Not Allowed',
  }));
};