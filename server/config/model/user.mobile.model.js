// userWithMobile.model.js
import { model, Schema } from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';  // Import crypto for OTP generation

const userSchemawithMobile = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
    number: {
        type: Number,
        required: [true, 'Phone number is required'],
        validate: {
            validator: async function(value) {
                if (!value) return false; // Required, so reject null/undefined
                
                // Check if number exists in UserWithMobile collection (excluding current document)
                const UserWithMobile = this.constructor;
                const existingUser = await UserWithMobile.findOne({ 
                    number: value, 
                    _id: { $ne: this._id } 
                });
                
                if (existingUser) {
                    // Number exists for another user
                    return false;
                }
                
                return true; // Number doesn't exist, allow it
            },
            message: 'This phone number is already registered with another account'
        }
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },
    gender:{
        type:String,
        required:true
    },
    otptoken: {
        type: String,
    },
    otpexpiry: {
        type: Date,
    }
}, {
    timestamps: true
});

// Hash password before saving the user
userSchemawithMobile.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Define methods for JWT generation, password comparison, OTP generation, and OTP comparison
userSchemawithMobile.methods = {
    generateJWTToken: function () {
        return jwt.sign(
            {
                id: this._id,
                role: this.role,
                number: this.number
            },
            'R5sWL56Li7DgtjNly8CItjADuYJY6926pE9vn823eD0=',
            {
                expiresIn: '7d'
            }
        );
    },
    comparePassword: async function (simpleTextPassword) {
        return await bcrypt.compare(simpleTextPassword, this.password);
    },
    generateVerifyToken: function() {
        // Generate a 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // Hash the OTP before saving it to the database for security
        this.otptoken = bcrypt.hashSync(otp, 10);
        
        // Set expiry to 5 minutes from now
        this.otpexpiry = Date.now() + 5 * 60 * 1000;

        return otp;  // Send plain OTP back for user to verify
    },
    compareOtp: function(otp) {
        // Check if OTP is valid and not expired
        const isOtpValid = bcrypt.compareSync(otp, this.otptoken);
        const isNotExpired = this.otpexpiry && this.otpexpiry > Date.now();

        return isOtpValid && isNotExpired;
    }
}

const UserWithMobile = model('UserWithMobile', userSchemawithMobile);
export default UserWithMobile;
