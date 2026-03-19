const mongoose = require("mongoose");
const validator = require("validator");
const userRoles = require('../utils/userRoles')
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: [8],
      validate: [validator.isStrongPassword, "Please enter a strong password"],
    },
    role: {
      type: String,
      enum: [userRoles.ADMIN,userRoles.USER,userRoles.SUPPLIER],
      default: "USER",
    },
    token: {
      type: String,
    },
  },
  { timestamps: true },
);
// userSchema.statics.findByFullName = function (fullName) {
//   return this.find({
//     $expr: {
//       $regexMatch: {
//         input: { $concat: ["$firstName", " ", "$lastName"] },
//         regex: fullName,
//         options: "i",
//       },
//     },
//   });
// };
module.exports = mongoose.model("User", userSchema);
