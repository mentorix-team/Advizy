import { Schema, model } from 'mongoose';

const notificationSchema = new Schema({
  expertId: {
    type: Schema.Types.ObjectId,
    ref: 'ExpertBasics',
    // required: true,
  },
  userId:{
    type:Schema.Types.ObjectId,
    ref:'User'
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  amount:{
    type:String,
  },
  status: {
    type: String,
    enum: ['unread', 'read'],
    default: 'unread',
  },
  videoCallId:{
    type:String,
  },
});

const Notification = model('Notification', notificationSchema);
export { Notification };
