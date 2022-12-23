const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerDoc = require('swagger-ui-express');

dotenv.config();

const swaggerDocumentation = require('./app/helpers/documentation');
const apiRouter = require('./app/routes/api.routes');

const app = express();
app.use(cors({ credentials: true, origin: [process.env.CLIENT_HOSTNAME_1, process.env.CLIENT_HOSTNAME_2]}));
app.use(cookieParser());

// const db = require('./configs/db');
// db.connect();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', apiRouter);
app.use("/docs", swaggerDoc.serve, swaggerDoc.setup(swaggerDocumentation));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.send('404');
});

module.exports = app;
