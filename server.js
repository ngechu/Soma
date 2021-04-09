const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./config/database");
const errorHandler = require("./middleware/error");
const colors = require("colors");
const fileupload = require("express-fileupload");

//Load environment variables
dotenv.config({ path: "./config/config.env" });

//Connect to database
connectDB();

const app = express();

//Body parser
app.use(express.json());

//Route files
const bootcamps = require("./routes/bootcamps");
const courses = require("./routes/courses");

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//File uploading
app.use(fileupload());

//Set static folder
app.use(express.static(path.join(__dirname, "public")));

//Mount routers
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

//Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server running on port + ${PORT}`.yellow.bold));

//Handle unhandled exceptions

process.on("unhandledRejection", (err, promise) => {
  console.log(`Error:${err.message}`.red.bold);
  //If an error occurs,close server and exit process
  server.close(() => {
    process.exit(1);
  });
});
