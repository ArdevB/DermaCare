import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // never returned by default
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    // Only the SHA-256 hash of each token is ever stored - the raw token is
    // emailed to the user and never touches the database, so a DB leak alone
    // can't be used to verify/reset an account.
    emailVerificationToken: { type: String, select: false, default: null },
    emailVerificationExpires: { type: Date, select: false, default: null },
    passwordResetToken: { type: String, select: false, default: null },
    passwordResetExpires: { type: Date, select: false, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const TOKEN_TTL_MS = {
  emailVerification: 24 * 60 * 60 * 1000, // 24 hours
  passwordReset: 60 * 60 * 1000, // 1 hour
};

// Generates a random raw token, stores only its hash + expiry on the user,
// and returns the raw token so the caller can email it (never persisted as-is).
const generateHashedToken = (user, tokenField, expiresField, ttlMs) => {
  const rawToken = crypto.randomBytes(32).toString("hex");
  user[tokenField] = crypto.createHash("sha256").update(rawToken).digest("hex");
  user[expiresField] = new Date(Date.now() + ttlMs);
  return rawToken;
};

userSchema.methods.createEmailVerificationToken = function () {
  return generateHashedToken(
    this,
    "emailVerificationToken",
    "emailVerificationExpires",
    TOKEN_TTL_MS.emailVerification
  );
};

userSchema.methods.createPasswordResetToken = function () {
  return generateHashedToken(
    this,
    "passwordResetToken",
    "passwordResetExpires",
    TOKEN_TTL_MS.passwordReset
  );
};

// Extra safety net: even if .select('+password') is used somewhere,
// password (and token fields) never leak through JSON responses.
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationExpires;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;

