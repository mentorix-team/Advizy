import mongoose from 'mongoose';

const paymentSessionSchema = new mongoose.Schema({
  // Payment Information
  sessionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
  paymentGateway: { type: String, required: true, default: 'payu' },
  
  // Booking Details
  serviceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  expertId: { type: mongoose.Schema.Types.ObjectId, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  
  // Timing Information
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  
  // Additional Data
  message: { type: String },
  payuTransactionId: { type: String }, // Will be updated after payment
  metaData: { type: Object }, // Stores any additional info
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const PaymentSession = mongoose.model('PaymentSession', paymentSessionSchema)
export default PaymentSession