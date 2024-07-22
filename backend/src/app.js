const express = require('express');

const cors = require('cors');
const compression = require('compression');

const cookieParser = require('cookie-parser');

const coreAuthRouter = require('./routes/coreRoutes/coreAuth');

const erpApiRouter = require('./routes/appRoutes/appApi');

const stockApiRouter = require('./routes/appRoutes/stockApi');

const errorHandlers = require('./handlers/errorHandlers');

const userAuth = require('./controllers/coreControllers/userAuth');
const { createDocx } = require('./helpers/documentHelper');

// create our Express app
const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());

// Here our API Routes

app.get('/', (req, res) => {
  const document = createDocx('Test', '', {
    name: 'Santiago',
    lastName: ['Ponce', 'dos'],
    data: { email: 'santiago@gmail.com' },
    phone: { number: '3005555555' },
    products: [
      { name: 'Product 1', price: 10.99, quantity: 5 },
      { name: 'Product 2', price: 15.99, quantity: 3 },
      { name: 'Product 3', price: 7.99, quantity: 8 },
    ],
  });
  res.send(document);
});

app.use('/api', coreAuthRouter);
app.use('/api', userAuth.isValidAuthToken, stockApiRouter);
app.use('/api', userAuth.isValidAuthToken, erpApiRouter);

app.get('/test', (req, res) => {
  res.send('Brava sales!!');
});

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
