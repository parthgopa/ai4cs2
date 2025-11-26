//? Schema: defines the structure of the documents whithin a collection.it specifies the fields their types , and any additional contraints or validations

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  phone: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  isAdmin: {
    type: Boolean,
    require: false,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  // Profile fields
  profileImage: {
    type: String,
    default: null,
  },
  designation: {
    type: String,
    default: null,
  },
  companyName: {
    type: String,
    default: null,
  },
  companyType: {
    type: String,
    default: 'Private Limited Company',
  },
  cin: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  // User preferences
  preferences: {
    autoFillForms: {
      type: Boolean,
      default: true,
    },
    defaultQuarters: {
      type: [String],
      default: [],
    },
    darkModePreference: {
      type: String,
      default: 'system',
      enum: ['system', 'light', 'dark'],
    },
  },
  // Login tracking fields
  firstLoginDate: {
    type: Date,
    default: null,
  },
  lastLoginDate: {
    type: Date,
    default: null,
  },
  loginCount: {
    type: Number,
    default: 0,
  },
  isProfileSetupComplete: {
    type: Boolean,
    default: false,
  },
  // Failed login attempt tracking
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  accountLockedUntil: {
    type: Date,
    default: null,
  },
  lastFailedLoginAttempt: {
    type: Date,
    default: null,
  },
  // OTP verification fields
  otp: {
    type: String,
    default: null,
  },
  otpExpiry: {
    type: Date,
    default: null,
  },
  otpAttempts: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true
})

//secure the password with the bcrypt using pre method
userSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    next();
  }

  try {
    const saltRound = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, saltRound);
  } catch (error) {
    next(error);
  }
});

//compare the password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
}

//* What is JWT?
// - JSON Web Token (jwt) is an open standard(RFC 7519) that defines a compact and seft-contained way for securely transmitting information between parties as a json object.
//? -JWTs are often used for authentication and authorization in web applications.
//? 1. Authentication: Verifying the indentity of a user or client.
//? 2. Authorization: Determinig what actions a user or client is allowed to perform.

//* Components of a JWT
// - Header: contains metadata about the token, such as the type of token and the signing algorithm being used.
// - Payload: contains claims or statements about an entity (typically, the user) and additional data. common claims include user ID, username, and expiration time.
// - Signature: To verify that the sender of the jwt is who it says it is and to ensure that the message wasn't changed along the way, a signature is included.

userSchema.methods.generateToken = function () {
  try {
    return jwt.sign({
      userId: this._id.toString(),
      email: this.email,
      isAdmin: this.isAdmin,
    },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "30d",
      }
    );
  } catch (error) {
    console.error(error);
  }
};

//? Model.Acts as a higher-level abstration that interacts with the database based on the defined schema. it represents a collection and provides an interface for querying , creatign updating , and deleting documents in that collection Models are created from schemas and enable you to work with mongodb data in a more structured manner in your application.

const User = new mongoose.model("User", userSchema);
module.exports = User;