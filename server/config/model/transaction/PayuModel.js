import mongoose from 'mongoose';

const paymentSessionSchema = new mongoose.Schema({
  // Payment Information
  sessionId: { 
    type: String, 
    required: true, 
    unique: true,
    default: () => `sess_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
  },
  amount: { 
    type: Number, 
    required: true,
    min: 0 // Ensure amount is positive
  },
  currency: { 
    type: String, 
    default: 'INR',
    enum: ['INR', 'USD', 'EUR'] // Add supported currencies
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed', 'refunded'], 
    default: 'pending' 
  },
  paymentGateway: { 
    type: String, 
    required: true, 
    default: 'payu',
    enum: ['payu', 'razorpay', 'stripe'] // Supported gateways
  },
  
  // Booking Details
  serviceId: { 
    type: String, // Changed from ObjectId to String
    required: true
  },
  expertId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'User' // Reference to User model if applicable
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
    ref: 'User' // Reference to User model
  },
  
  // Timing Information
  date: { 
    type: Date, 
    required: true,
    // validate: {
    //   validator: function(v) {
    //     return v > new Date(); // Ensure date is in future
    //   },
    //   message: 'Booking date must be in the future'
    // }
  },
  startTime: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        // Accept either ISO string or HH:MM format
        return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v) || 
               !isNaN(new Date(v).getTime());
      },
      message: 'Start time must be in HH:MM format or valid ISO string'
    }
  },
  endTime: { 
    type: String, 
    required: true,
    validate: {
      validator: function(v) {
        // Accept either format and ensure end > start
        const validFormat = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v) || 
                           !isNaN(new Date(v).getTime());
        
        if (!validFormat) return false;
        
        // Compare times if both are same format
        if (this.startTime && v) {
          if (this.startTime.includes('T') && v.includes('T')) {
            return new Date(v) > new Date(this.startTime);
          }
          if (!this.startTime.includes('T') && !v.includes('T')) {
            return v > this.startTime;
          }
        }
        return true;
      },
      message: 'End time must be after start time'
    }
  },
  // Additional Data
  message: { 
    type: String,
    maxlength: 500 // Limit message length
  },
  payuTransactionId: { 
    type: String,
    index: true // Add index for faster queries
  },
  metaData: { 
    type: mongoose.Schema.Types.Mixed, // More flexible than Object
    default: {} 
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add indexes for better query performance
paymentSessionSchema.index({ userId: 1 });
paymentSessionSchema.index({ expertId: 1 });
paymentSessionSchema.index({ status: 1 });
paymentSessionSchema.index({ createdAt: 1 });

// Update timestamp on save
paymentSessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const PaymentSession = mongoose.model('PaymentSession', paymentSessionSchema);
export default PaymentSession;