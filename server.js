const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/error');
const colors = require('colors');

//Load environment variables
dotenv.config({ path: './config/config.env' });

//Connect to database
connectDB();

const app = express();

//Body parser
app.use(express.json());

//Route files
const bootcamps = require('./routes/bootcamps');

//Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Mount routers
app.use('/api/v1/bootcamps', bootcamps);

//Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port + ${PORT}`.yellow.bold));

//Handle unhandled exceptions

process.on('unhandledRejection', (err, promise) => {
  console.log(`Error:${err.message}`.red.bold);
  //If an error occurs,close server and exit process
  server.close(() => {
    process.exit(1);
  });
});
