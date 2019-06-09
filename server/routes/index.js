const todosController = require('../controllers').todos;
const todoItemsController = require('../controllers').todoItems;
const partiesController = require('../controllers').parties;
const driversController = require('../controllers').drivers;
const usersController = require('../controllers').users;
const travelsController = require('../controllers').travels;
const userScoresController = require('../controllers').userscores;
const driverScoresController = require('../controllers').driverscores;
const addressesController = require('../controllers').addresses;
const credentialsController = require('../controllers').credentials;
const fileDocumentsController = require('../controllers').fileDocuments;
const partyServiceMock = require('../mock/mockData/partyServiceMock');

module.exports = (app) => {
    app.post('/travel/cotization', travelsController.simulateQuote);
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
    app.put('/api/driverPosition/:driverId', driversController.updatePosition);
    app.post('/api/drivers', driversController.create);
    app.get('/api/drivers', driversController.retrieve);
    app.put('/api/drivers/:driverId', driversController.update);
    app.delete('/api/drivers/:driverId', driversController.destroy);
    
    app.get('/api/drivers/:driverId/travels', driversController.getTravels);
    app.get('/api/drivers/:driverId/receivedScores', driversController.getScoresReceived);
    app.get('/api/drivers/:driverId/givenScores', driversController.getScoresGiven);

    // ********************* USERS *************************
    app.post('/api/users', usersController.create);
    app.get('/api/users', usersController.retrieve);
    app.put('/api/users/:userId', usersController.update);
    app.delete('/api/users/:userId', usersController.destroy);

    app.get('/api/users/:userId/travels', usersController.getTravels);
    app.get('/api/users/:userId/receivedScores', usersController.getScoresReceived);
    app.get('/api/users/:userId/givenScores', usersController.getScoresGiven);

    // ********************* TRAVELS *************************
    app.get('/api/travelStatus/:travelId', travelsController.getTravelStatus);
    app.post('/api/travels', travelsController.create);
    app.get('/api/travels', travelsController.retrieve);
    app.get('/api/travels/quote/:travelId', travelsController.quote);
    app.post('/api/travels/simulateQuote', partyServiceMock.loadDrivers,partyServiceMock.loadUsers,travelsController.simulateQuote);
    
    app.put('/api/travels/:travelId', travelsController.update);
    app.delete('/api/travels/:travelId', travelsController.destroy);
    app.post('/api/travels/confirmation',travelsController.confirmation);
    app.post('/api/travels/finalize', travelsController.finalize);
    app.post('/api/travels/cancel', travelsController.cancel);

    // ********************* CREDENTIALS *************************
    app.post('/api/login', credentialsController.login);
    app.post('/api/register', credentialsController.register);

    // ********************* DRIVER SCORES ***********************
    app.post('/api/driverScores', driverScoresController.create);
    app.get('/api/driverScores', driverScoresController.list);

    // ********************* USER SCORES *************************
    app.post('/api/userScores', userScoresController.create);
    app.get('/api/userScores', userScoresController.list);

    // ********************* FILE DOCUMENTS *************************
    app.post('/api/fileDocuments', fileDocumentsController.create);
    app.get('/api/fileDocuments', fileDocumentsController.retrieve);
    app.put('/api/fileDocuments/:fileDocumentId', fileDocumentsController.update);
    app.delete('/api/fileDocuments/:fileDocumentId', fileDocumentsController.destroy);
    // For any other request method on todo items, we're going to return "Method Not Allowed"
    app.all('/api/todos/:todoId/items', (req, res) =>
        res.status(405).send({
            message: 'Method Not Allowed',
        }));
};