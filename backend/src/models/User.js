import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ApiError } from "../utils/ApiError.js";
import { ROLE_VALUES, ROLES } from "../constants/roles.js";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" }, // Home, Office, etc.
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    province: { type: String, required: true },
    city: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      unique: [true, "User email must be unique"],
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => {
          const emailRegex =
            /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/;

          return emailRegex.test(value);
        },
        message: "Please enter a valid email address",
      },
    },
    password: {
      type: String,
      required: [true, "User password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false, // Don't return password in response
    },
    phone: {
      type: String,
      required: [true, "User phone number is required"],
      unique: true,
      trim: true,
      validate: {
        validator: (value) => {
          const phoneRegex = /^\+?[1-9]\d{1,14}$/;

          return phoneRegex.test(value);
        },
        message: "Please enter a valid phone number",
      },
    },
    role: {
      type: String,
      enum: ROLE_VALUES,
      default: ROLE_VALUES.USER,
    },
    profileImageUrl: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" }, //Cloudinary public id
    },
    profile: {
      skinType: {
        type: String,
        enum: ["oily", "dry", "combination", "normal", "sensitive", null],
        default: null,
      },
      hairType: {
        type: String,
        enum: ["straight", "wavy", "curly", "coily", null],
        default: null,
      },
      concerns: [{ type: String }], // e.g. "acne", "dryness", "hairfall", "dark spots"
      allergies: [{ type: String }],
    },
    addresses: [addressSchema],
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true },
);

// userSchema.pre("save", async function hashPassword(next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(12);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

userSchema.methods.comparePassword = async function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toSafeObject = function toSafeObject() {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
