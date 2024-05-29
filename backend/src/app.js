const express = require('express');

const cors = require('cors');
const compression = require('compression');

const cookieParser = require('cookie-parser');

const coreAuthRouter = require('./routes/coreRoutes/coreAuth');

const errorHandlers = require('./handlers/errorHandlers');
const userAuth = require('./controllers/coreControllers/userAuth');

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
  res.send('Brava sales!!');
});

app.use('/api', coreAuthRouter);

app.get('/test', (req, res) => {
  res.send('Brava sales!!');
});

// If that above routes didnt work, we 404 them and forward to error handler
app.use(errorHandlers.notFound);

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
