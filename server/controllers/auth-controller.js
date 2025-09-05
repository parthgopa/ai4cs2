//? In an Express. js application, a "controller" refers to a part of your code that is responsible for handling the application's logic. Controllers are typically used to process incoming requests, interact with models (data sources), and send responses back to clients. They help organize your application by separating concerns and following the MVC (Model-View-Controller)design pattern.

const User = require("../models/user-model");
// const bcrypt = require("bcryptjs")
const admin = require("firebase-admin");

// Initialize Firebase Admin (expects GOOGLE_APPLICATIONS_CREDENTIALS or default credentials)
if (!admin.apps.length) {
  try {
    const serviceAccount = (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY)
      ? {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        }
      : null;

    if (serviceAccount) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    } else {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
  } catch (e) {
    console.error("Failed to initialize Firebase Admin SDK", e);
  }
}

const home = async (req, res) => {
  try {
    res
      .status(200)
      .send("Welcome to world best mern series by vaibhav using router")
  } catch (error) {
    console.log(error);
  }
};

//* register user logic

const register = async (req, res) => {
  try {
    // console.log(req.body);
    const { username, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "email already exists" });
    }

    // hase the password
    // const saltRount = 10;
    // const hash_password = await bcrypt.hash(password, saltRount);

    const userCreated = await User.create({ username, email, phone, password });

    res.status(201).json({ msg: "registration successful", token: await userCreated.generateToken(), userId: userCreated._id.toString() });
  } catch (error) {
    res.status(500).json("internal server error");
  }
};
//userCreated._id.toString : In most cases converting id to a string is a good practice because it ensures consistency and compatibility across diffrent jwt libraries and system it also aligns with the expectation that claims in a jwt are represented as strings

//* login user logic

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ email });
    // console.log(userExist);

    if (!userExist) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // const user = await bcrypt.compare(password, userExist.password);
    const user = await userExist.comparePassword(password);

    if (user) {
      res.status(200).json({
        msg: "Login successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    //res.status(500).json("internal server error");
    next(error);
  }
};

// Firebase Google login
const firebaseLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: "Missing Firebase ID token" });
    }

    const decoded = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture, phone_number } = decoded || {};
    if (!email) {
      return res.status(400).json({ message: "Invalid Firebase token payload" });
    }

    let user = await User.findOne({ email });
    if (!user) {
      // Create a local user record compatible with current schema (password & phone required)
      const username = name || email.split("@")[0];
      const phone = phone_number || "firebase"; // ensure non-empty to satisfy schema requirement
      const tempPassword = uid || Math.random().toString(36).slice(2);
      user = await User.create({ username, email, phone, password: tempPassword });
    }

    return res.status(200).json({
      msg: "Login successful",
      token: await user.generateToken(),
      userId: user._id.toString(),
    });
  } catch (error) {
    console.error("Firebase login error", error);
    return res.status(500).json({ message: "Firebase login failed", error: error?.message || String(error) });
  }
};

//* send user data - user Logic

const user = async (req, res) => {
  try {
    // const userData = await User.find({});
    const userData = req.user;
    console.log(userData);
    return res.status(200).json({ userData });
  } catch (error) {
    console.log(` error from user route ${error}`);
  }
};

module.exports = { home, register, login, firebaseLogin, user };