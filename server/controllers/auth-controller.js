//? In an Express. js application, a "controller" refers to a part of your code that is responsible for handling the application's logic. Controllers are typically used to process incoming requests, interact with models (data sources), and send responses back to clients. They help organize your application by separating concerns and following the MVC (Model-View-Controller)design pattern.

const User = require("../models/user-model");
// const bcrypt = require("bcryptjs")
const admin = require("firebase-admin");
const { generateOTP, sendOTPEmail, sendWelcomeEmail } = require("../utils/emailService");
const { storePendingUser, getPendingUser, removePendingUser, isPendingUser } = require("../utils/tempUserStorage");

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

//* register user logic - Step 1: Create user and send OTP

const register = async (req, res) => {
  try {
    console.log("=== REGISTRATION START ===");
    console.log("Request body:", req.body);
    
    const { username, email, phone, password } = req.body;

    // Check if user already exists in database
    console.log("Checking if user exists for email:", email);
    const userExist = await User.findOne({ email });
    console.log("User exists in DB:", userExist ? "Yes" : "No");
    
    if (userExist && userExist.isEmailVerified) {
      console.log("User already verified, rejecting registration");
      return res.status(400).json({ message: "Email already exists and verified" });
    }

    // Generate OTP
    console.log("Generating OTP...");
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
    console.log("Generated OTP:", otp);
    console.log("OTP Expiry:", otpExpiry);

    // Store user data temporarily (NOT in database yet)
    const pendingUserData = {
      username,
      email,
      phone,
      password,
      otp,
      otpExpiry,
      otpAttempts: 0
    };

    console.log("Storing user data temporarily for OTP verification");
    storePendingUser(email, pendingUserData);

    // Send OTP email
    console.log("Attempting to send OTP email to:", email);
    const emailResult = await sendOTPEmail(email, otp, username);
    console.log("Email result:", emailResult);
    
    if (!emailResult.success) {
      console.error("Failed to send email:", emailResult.error);
      // Remove from temporary storage if email fails
      removePendingUser(email);
      return res.status(500).json({ 
        message: "Failed to send verification email", 
        error: emailResult.error 
      });
    }

    console.log("Registration initiated, OTP sent, user NOT saved to DB yet");
    console.log("=== REGISTRATION END ===");

    res.status(201).json({ 
      message: "Registration initiated. Please check your email for OTP verification.",
      email: email,
      requiresOTP: true
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
//userCreated._id.toString : In most cases converting id to a string is a good practice because it ensures consistency and compatibility across diffrent jwt libraries and system it also aligns with the expectation that claims in a jwt are represented as strings

//* OTP verification logic

const verifyOTP = async (req, res) => {
  try {
    console.log("=== OTP VERIFICATION START ===");
    const { email, otp } = req.body;
    console.log("Verifying OTP for email:", email);
    console.log("Received OTP:", otp);

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    // First check if user is in pending storage
    const pendingUser = getPendingUser(email);
    console.log("Pending user found:", pendingUser ? "Yes" : "No");

    if (pendingUser) {
      console.log("Processing pending user verification");
      
      // Check if OTP has expired
      if (!pendingUser.otpExpiry || new Date() > pendingUser.otpExpiry) {
        console.log("OTP expired for pending user");
        removePendingUser(email);
        return res.status(400).json({ message: "OTP has expired. Please register again." });
      }

      // Check OTP attempts limit
      if (pendingUser.otpAttempts >= 5) {
        console.log("Too many attempts for pending user");
        removePendingUser(email);
        return res.status(429).json({ message: "Too many failed attempts. Please register again." });
      }

      // Verify OTP - ensure both are strings and trimmed
      const storedOtp = String(pendingUser.otp).trim();
      const enteredOtp = String(otp).trim();
      
      console.log("OTP Comparison:");
      console.log("Stored OTP:", storedOtp, "(length:", storedOtp.length, ")");
      console.log("Entered OTP:", enteredOtp, "(length:", enteredOtp.length, ")");
      console.log("Match:", storedOtp === enteredOtp);
      
      if (storedOtp !== enteredOtp) {
        console.log("Invalid OTP for pending user - OTP mismatch");
        pendingUser.otpAttempts += 1;
        storePendingUser(email, pendingUser);
        return res.status(400).json({ 
          message: "Invalid OTP", 
          attemptsLeft: 5 - pendingUser.otpAttempts 
        });
      }

      // OTP is valid - create user in database
      console.log("OTP valid, creating user in database");
      const newUser = await User.create({
        username: pendingUser.username,
        email: pendingUser.email,
        phone: pendingUser.phone,
        password: pendingUser.password,
        isEmailVerified: true
      });

      // Remove from pending storage
      removePendingUser(email);
      console.log("User created successfully:", newUser._id);

      // Send welcome email to new user
      console.log("Sending welcome email to new user");
      try {
        const welcomeEmailResult = await sendWelcomeEmail(newUser.email, newUser.username);
        console.log("Welcome email result:", welcomeEmailResult);
      } catch (welcomeError) {
        console.error("Failed to send welcome email:", welcomeError);
        // Don't fail the registration if welcome email fails
      }

      res.status(200).json({
        message: "Email verified successfully! You can now login.",
        token: await newUser.generateToken(),
        userId: newUser._id.toString(),
      });
      
    } else {
      // Check existing user in database (for existing unverified users)
      console.log("Checking existing user in database");
      const user = await User.findOne({ email });
      
      if (!user) {
        console.log("No user found in DB or pending storage");
        return res.status(404).json({ message: "User not found. Please register first." });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      // Check if OTP has expired
      if (!user.otpExpiry || new Date() > user.otpExpiry) {
        return res.status(400).json({ message: "OTP has expired. Please request a new one." });
      }

      // Check OTP attempts limit
      if (user.otpAttempts >= 5) {
        return res.status(429).json({ message: "Too many failed attempts. Please request a new OTP." });
      }

      // Verify OTP - ensure both are strings and trimmed
      const storedOtp = String(user.otp).trim();
      const enteredOtp = String(otp).trim();
      
      console.log("DB User OTP Comparison:");
      console.log("Stored OTP:", storedOtp, "(length:", storedOtp.length, ")");
      console.log("Entered OTP:", enteredOtp, "(length:", enteredOtp.length, ")");
      console.log("Match:", storedOtp === enteredOtp);
      
      if (storedOtp !== enteredOtp) {
        await User.findByIdAndUpdate(user._id, {
          $inc: { otpAttempts: 1 }
        });
        return res.status(400).json({ 
          message: "Invalid OTP", 
          attemptsLeft: 5 - (user.otpAttempts + 1) 
        });
      }

      // OTP is valid - verify the user
      await User.findByIdAndUpdate(user._id, {
        isEmailVerified: true,
        otp: null,
        otpExpiry: null,
        otpAttempts: 0
      });

      res.status(200).json({
        message: "Email verified successfully! You can now login.",
        token: await user.generateToken(),
        userId: user._id.toString(),
      });
    }
    
    console.log("=== OTP VERIFICATION END ===");
  } catch (error) {
    console.error("=== OTP VERIFICATION ERROR ===");
    console.error("Error details:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("=== OTP VERIFICATION ERROR END ===");
    res.status(500).json({ 
      message: "Internal server error",
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

//* Resend OTP logic

const resendOTP = async (req, res) => {
  try {
    console.log("=== RESEND OTP START ===");
    const { email } = req.body;
    console.log("Resending OTP for email:", email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check if user is in pending storage first
    const pendingUser = getPendingUser(email);
    console.log("Pending user found:", pendingUser ? "Yes" : "No");

    if (pendingUser) {
      console.log("Resending OTP for pending user");
      
      // Generate new OTP
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now
      
      // Update pending user data
      pendingUser.otp = otp;
      pendingUser.otpExpiry = otpExpiry;
      pendingUser.otpAttempts = 0;
      
      storePendingUser(email, pendingUser);

      // Send OTP email
      const emailResult = await sendOTPEmail(email, otp, pendingUser.username);
      
      if (!emailResult.success) {
        console.error("Failed to send resend OTP email:", emailResult.error);
        return res.status(500).json({ 
          message: "Failed to send verification email", 
          error: emailResult.error 
        });
      }

      console.log("OTP resent successfully for pending user");
      res.status(200).json({ 
        message: "New OTP sent to your email address.",
        email: email
      });
      
    } else {
      // Check existing user in database
      console.log("Checking existing user in database for resend");
      const user = await User.findOne({ email });
      
      if (!user) {
        console.log("No user found for resend OTP");
        return res.status(404).json({ message: "User not found. Please register first." });
      }

      if (user.isEmailVerified) {
        return res.status(400).json({ message: "Email already verified" });
      }

      // Generate new OTP
      const otp = generateOTP();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      // Update user with new OTP
      await User.findByIdAndUpdate(user._id, {
        otp,
        otpExpiry,
        otpAttempts: 0
      });

      // Send OTP email
      const emailResult = await sendOTPEmail(email, otp, user.username);
      
      if (!emailResult.success) {
        return res.status(500).json({ 
          message: "Failed to send verification email", 
          error: emailResult.error 
        });
      }

      res.status(200).json({ 
        message: "New OTP sent to your email address.",
        email: email
      });
    }
    
    console.log("=== RESEND OTP END ===");
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//* login user logic

const login = async (req, res) => {
  try {
    console.log("=== LOGIN ATTEMPT START ===");
    const { email, password } = req.body;
    console.log("Login attempt for email:", email);

    const userExist = await User.findOne({ email });

    if (!userExist) {
      console.log("User not found for email:", email);
      return res.status(400).json({ message: "Invalid email address" });
    }

    // Check if email is verified
    if (!userExist.isEmailVerified) {
      console.log("Email not verified for user:", email);
      return res.status(403).json({ 
        message: "Please verify your email before logging in",
        requiresVerification: true,
        email: email
      });
    }

    // Check if account is locked
    const currentTime = new Date();
    if (userExist.accountLockedUntil && currentTime < userExist.accountLockedUntil) {
      const lockTimeRemaining = Math.ceil((userExist.accountLockedUntil - currentTime) / (1000 * 60 * 60)); // hours
      console.log(`Account locked for user ${email}. Lock expires in ${lockTimeRemaining} hours`);
      return res.status(423).json({ 
        message: `Account is locked due to too many failed login attempts. Please try again in ${lockTimeRemaining} hour(s).`,
        accountLocked: true,
        lockExpiresAt: userExist.accountLockedUntil
      });
    }

    // If account was locked but lock has expired, reset failed attempts
    if (userExist.accountLockedUntil && currentTime >= userExist.accountLockedUntil) {
      console.log("Account lock expired, resetting failed attempts for user:", email);
      await User.findByIdAndUpdate(userExist._id, {
        failedLoginAttempts: 0,
        accountLockedUntil: null,
        lastFailedLoginAttempt: null
      });
      userExist.failedLoginAttempts = 0;
      userExist.accountLockedUntil = null;
    }

    const isPasswordValid = await userExist.comparePassword(password);

    if (isPasswordValid) {
      console.log("Password valid, successful login for user:", email);
      
      // Reset failed login attempts on successful login
      const updateData = {
        lastLoginDate: currentTime,
        failedLoginAttempts: 0,
        accountLockedUntil: null,
        lastFailedLoginAttempt: null,
        $inc: { loginCount: 1 }
      };

      // Set first login date if this is the first login
      if (!userExist.firstLoginDate) {
        updateData.firstLoginDate = currentTime;
      }

      await User.findByIdAndUpdate(userExist._id, updateData);

      console.log(`User ${userExist.email} logged in successfully. Total login count: ${userExist.loginCount + 1}`);

      res.status(200).json({
        msg: "Login successful",
        token: await userExist.generateToken(),
        userId: userExist._id.toString(),
      });
    } else {
      console.log("Invalid password for user:", email);
      
      // Increment failed login attempts
      const newFailedAttempts = userExist.failedLoginAttempts + 1;
      const maxAttempts = 5;
      const remainingAttempts = maxAttempts - newFailedAttempts;

      console.log(`Failed login attempt ${newFailedAttempts} for user ${email}`);

      const updateData = {
        failedLoginAttempts: newFailedAttempts,
        lastFailedLoginAttempt: currentTime
      };

      // Lock account if max attempts reached
      if (newFailedAttempts >= maxAttempts) {
        const lockUntil = new Date(currentTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
        updateData.accountLockedUntil = lockUntil;
        
        await User.findByIdAndUpdate(userExist._id, updateData);
        
        console.log(`Account locked for user ${email} until ${lockUntil}`);
        
        return res.status(423).json({ 
          message: "Account has been locked for 24 hours due to too many failed login attempts.",
          accountLocked: true,
          lockExpiresAt: lockUntil
        });
      } else {
        await User.findByIdAndUpdate(userExist._id, updateData);
        
        console.log(`${remainingAttempts} attempts remaining for user ${email}`);
        
        return res.status(401).json({ 
          message: `Invalid email or password. ${remainingAttempts} attempt(s) remaining before account lockout.`,
          attemptsRemaining: remainingAttempts,
          failedAttempts: newFailedAttempts
        });
      }
    }
    
    console.log("=== LOGIN ATTEMPT END ===");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
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

module.exports = { home, register, verifyOTP, resendOTP, login, firebaseLogin, user };