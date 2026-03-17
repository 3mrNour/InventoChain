const mongoose = require("mongoose");
const validator = require("validator");
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
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["USER", "SUPPLIER", "ADMIN"],
      default: "USER",
    },
  },
  {
    timestamps: true,
  },
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
