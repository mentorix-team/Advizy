import {model,Schema} from 'mongoose'

const transaction = new Schema({
    user_id:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    expert_id:{
        type:Schema.Types.ObjectId,
        ref:'Expert'
    },
    session_id:{
        type:Schema.Types.ObjectId,
        ref:'Session'
    },
    payment_id:{

    },
    amount:{
        type:String,
        required:true
    },  
    status:{
        type:String,
        enum:['PENDING','CAPTURED','REFUNDED','INPROCESS'],
        default:'INPROCESS'
    },


},{
    timestamps:true
}

)

const Transaction = model('Transaction',transaction);
export default Transaction;