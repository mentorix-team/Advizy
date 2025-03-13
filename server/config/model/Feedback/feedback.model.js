import {model,Schema} from 'mongoose'

const feedbackSchema = new Schema({
    rating:{type:String},
    feedback:{type:String},
    user_id:{type:Schema.Types.ObjectId,ref:'User'},
    expert_id:{type:Schema.Types.ObjectId,ref:'ExpertBasics'},
    meeting_id:{type:Schema.Types.ObjectId,ref:'Meeting'},
    userName:{type:String},
    expertName:{type:String},
    serviceName:{type:String}
})

const Feedback = model('Feedback',feedbackSchema)

export {Feedback};