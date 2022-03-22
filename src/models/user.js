const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "User name is required"],
  },
  surname: {
    type: String,
    required: [true, "User surname is required"],
  },
  is_admin: {
    type: Boolean,
    default: false,
    required: [true, "User access type is required"],
  },
  email: {
    type: String,
    unique: [true, "This email is in use"],
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  address: {
    type: String,
  },
  phone: {
    type: String,
  },
});

module.exports = model("User", UserSchema);
