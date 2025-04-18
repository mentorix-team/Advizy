import { Schema, model } from 'mongoose';
import jwt from 'jsonwebtoken';

const meetingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userName:{
        type:String,
    },
    expertId: {
        type: Schema.Types.ObjectId,
        ref: 'ExpertBasics',
        required: true,
    },
    expertName:{
        type:String,
    },
    serviceId: {
        type: String, // This will store the unique serviceId from the ExpertBasics schema
        required: true,
    },
    serviceName:{
        type:String,
    },
    amount:{
        type:String,
    },
    daySpecific: {
        date: {
            type: String,
            required: true,
        },
        slot: {
            startTime: {
                type: String,
                required: true,
            },
            endTime: {              
                type: String,
                required: true,
            },
        },
    },

    videoCallId:{
        type:String,

    },

    
    razorpay_payment_id:{
        type:String,
    },
    razorpay_order_id:{
        type:String,
    },
    razorpay_signature:{
        type:String,
    },
    isPayed:{
        type:Boolean,
        default:false,
    }
});

meetingSchema.methods = {
    generateToken : function () {
        const payload = {
            id:this._id,
            userId: this.userId,
            expertId: this.expertId,
            serviceId: this.serviceId,
            daySpecific: this.daySpecific,
            isPayed:this.isPayed,
            razorpay_payment_id:this.razorpay_payment_id
        };

        return jwt.sign(payload, 'sVu4ObGbmS3krUCfW+1wJRzNGnt1LtMy6+oWtO/DJmQ=', { expiresIn: '2d' });
    }
}

const Meeting = model('Meeting', meetingSchema);

export { Meeting };
