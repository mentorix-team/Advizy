import { model, Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new Schema(
  {
    googleId: { type: String },
    name:{
      type:String
    },
    firstName: {
      type: String,
      // required: true,
    },
    lastName: {
      type: String,
      // required: true,
    },
    email: {
      type: String,
      sparse: true, // Index only if the email exists and is not null
      unique: true, // Ensure email is unique
    },
    number: {
      type: Number,
      sparse: true,
      unique: true, // Ensure mobile number is unique
    },
    password: {
      type: String,
      // required: [true, 'Password is required'],
      select: false, // Exclude the password by default in queries
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN'],
      default: 'USER',
    },
    gender: {
      type: String,
      // required: false, // Optional field, as it may not apply to all users
    },
    forgotpasswordtoken: {
      type: String,
      default: null,
    },
    interests:[{
      type:String,
    }],
    forgotpasswordexpiry: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpiry: {
      type: Date,
      default: null,
    },
    otptoken: {
      type: String,
      sparse: true,
      unique: true,
    },
    otpexpiry: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);





// Hash password before saving the user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Define methods for JWT generation, password comparison, OTP generation, and token handling
userSchema.methods = {
  generateJWTToken: function (options = {}) {
    return jwt.sign(
      {
        id: this._id,
        email: this.email,
        number: this.number,
        role: this.role,
      },
      'R5sWL56Li7DgtjNly8CItjADuYJY6926pE9vn823eD0=', // Use process.env.JWT_SECRET in production
      { expiresIn: options.expiresIn || '7d' } // Default to 7 days if not provided
    );
  },
  comparePassword: async function (simpleTextPassword) {
    return await bcrypt.compare(simpleTextPassword, this.password);
  },
  generateForgotPasswordToken: function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.forgotpasswordtoken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    this.forgotpasswordexpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    return resetToken;
  },
  generateVerifyToken: function () {
    const otp = crypto.randomInt(100000, 999999).toString();

    // Hash the OTP before saving it to the database for security
    this.otptoken = bcrypt.hashSync(otp, 10);

    // Set expiry to 5 minutes from now
    this.otpexpiry = Date.now() + 5 * 60 * 1000;

    return otp;
  },
  compareOtp: function (otp) {
    // Check if OTP is valid and not expired
    const isOtpValid = bcrypt.compareSync(otp, this.otptoken);
    const isNotExpired = this.otpexpiry && this.otpexpiry > Date.now();

    return isOtpValid && isNotExpired;
  },
  generatePasswordResetToken: function () {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpiry = Date.now() + 15 * 60 * 1000; // 15 minutes
    return resetToken;
  },
};

const User = model('User', userSchema);
export default User;
