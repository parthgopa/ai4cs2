require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const authRoute = require("./router/auth-router");
const contactRoute = require("./router/contact-router");
const activityRoute = require("./router/activity-router");
const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");

//let's tackle cors
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
//? app.use(express.json( ));: •This line of, code adds Express middleware that •parses•incoming request bodies with JSON payloads. It is important to place this before•any routes •that • need to handle JSON data in the request body. •This middleware is responsible for parsing JSON data• from• requests, •and it should be applied at the beginning of your middleware stack to ensure it's available for all subsequent route handlers.

// For parsing URL-encoded form data
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoute);

// app.get("/", (req,res) => { //programe
//   res.status(200).send("Welcome to world best mern series by vaibhav technical");
// });

// app.get("/register", (req,res) => { //programe
//   res.status(200).send("Welcome to registration page");
// });

app.use("/api/form", contactRoute);
app.use("/api/activity", activityRoute);

app.use(errorMiddleware)

const PORT = 5000;  //create

connectDb().then(() => {
  app.listen(PORT, () => { //listen
    console.log(`server is running at port: ${PORT}`);
  });
});