require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsConfig");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;

//connect to the database
connectDB();

//custom middleware that longs into a log file after each request is made.
app.use(logger);

//otherwise CORS will block the request
app.use(credentials);

//3rd party middleware
//Cross origin resourse shairing
app.use(cors(corsOptions));

//built-in middle ware used to handle url encoded data
//in other words used to handle form data that comes in a url
app.use(express.urlencoded({ extended: false }));

//built-in middleware for incoming json
app.use(express.json());

//3rd party middleware for parsing cookies
app.use(cookieParser());

//help serve static files like css and jpeg files, this is built-in as well
app.use("/", express.static(path.join(__dirname, "/public")));

//Routing
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

//protected routes
app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.type("txt").send("404 not found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to the database");
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
});

