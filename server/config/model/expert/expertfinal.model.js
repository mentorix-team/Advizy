import mongoose from "mongoose";
import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
// import { duration } from "moment-timezone";

// ExpertBasics Schema
const ExpertBasicsSchema = new Schema({
  redirect_url:{type:String},
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  firstName: { type: String },
  lastName: { type: String },
  admin_approved_expert: { type: Boolean, default: false },
  gender: { type: String, enum: ["male", "female", "other"] },
  dateOfBirth: { type: Date },
  nationality: { type: String },
  country_living: { type: String },
  email: { type: String },
  mobile: { type: Number },
  countryCode:{type:String},
  city: { type: String },
  languages: { type: [String], default: [] },
  bio:{type:String},
  socialLinks:{type:[String],default:[]},
  profileImage:{
    public_id:{
      type:String,
    },
    secure_url:{
      type:String,
    },
  },
  coverImage:{
    public_id:{
      type:String,
    },
    secure_url:{
      type:String,
    },
  },
  credentials: {
    domain: { type: String },
    niche: [{ type: String }],
    professionalTitle: [{ type: String }],
    skills:[{type:String}],
    work_experiences: {
      type: [{
        companyName: { type: String },
        jobTitle: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        currentlyWork:{type:Boolean},
        document: {
          public_id: { type: String },
          secure_url: { type: String },
        },
      }],
      default: [],
    },
    PaymentDetails: {
      type: [{
        accountType: { type: String },
        accountHolderName: { type: String },
        ifscCode: { type: String },
        accountNumber: { type: String },
      }],
      default: [],
    },
    education: {
      type: [{
        degree: { type: String },
        institution: { type: String },
        passing_year: { type: String },
        certificate: {
          public_id: { type: String },
          secure_url: { type: String },
        },
      }],
      default: [],
    },
    certifications_courses: {
      type: [{
        title: { type: String },
        issue_organization: { type: String },
        year: { type: String },
        certificate: {
          public_id: { type: String },
          secure_url: { type: String },
        },
      }],
      default: [],
    },
    bio: { type: String },
    portfolio: [{
      bio: { type: String },
      photo: {
        public_id: { type: String },
        secure_url: { type: String },
      },
    }],
    services: [
      {
        title: { type: String, required: true },
        shortDescription: { type: String },
        detailedDescription: { type: String },
        one_on_one:[{
          duration: { type: Number },
          price: { type: Number }, 
        }],
        duration: { type: Number }, 
        price: { type: Number}, 
        features: [{ type: String, default: [] }],
        showMore: { type: Boolean, default: false },
        serviceId: { type: String, unique: true }, 
      },
    ],
  },
  total_earnings: { type: Number, default: 0 },
  sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session", default: [] }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review", default: [] }],
});



// ExpertCredentials Schema
const ExpertCredentialsSchema = new Schema({
  expert_id: { type: mongoose.Schema.Types.ObjectId, ref: "ExpertBasics" },
  domain: { type: String },
  niche: [{ type: String }],
  expertise: [{ type: String }],
  work_experiences: {
    type:[{
        companyName: { type: String },
        jobTitle: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        document: {
          public_id: { type: String, required: true },
          secure_url: { type: String, required: true }
        }
      }
    ],
    default:[],
  },
  
  education: {
    type: [{
      degree: { type: String },
      institution: { type: String },
      passing_year: { type: String },
      certificate: {
        public_id: { type: String },
        secure_url: { type: String },
      }
    }],
    default: [], 
  },
  
  certifications_courses: {
    type:[{
      title: { type: String },
      issue_organization: { type: String },
      year:{type:String},
      certificate: {
        public_id: { type: String, required: true },
        secure_url: { type: String, required: true }
      }
    }],
    default: []
  },
  
  bio: { type: String },
  portfolio: [{
    bio: { type: String },
    photo:{
      public_id:{type:String},
      secure_url:{type:String}
    },
  }],
});

// Session Schema
const SessionSchema = new Schema({
  expert_id: { type: mongoose.Schema.Types.ObjectId, ref: "ExpertBasics" },
  user_id: { type: String },
  date: { type: Date },
  startTime: { type: Date },
  endTime: { type: Date },
  amount: { type: Number },
  status: { type: String, enum: ["Completed", "Canceled", "Pending"], default: "Pending" },
  feedback: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
}, {
  timestamps: true
});

// Review Schema
const ReviewSchema = new Schema({
  session_id: { type: mongoose.Schema.Types.ObjectId, ref: "Session" },
  user_id: { type: String },
  expert_id: { type: mongoose.Schema.Types.ObjectId, ref: "ExpertBasics" },
  rating: { type: Number, min: 1, max: 5 },
  comment: { type: String },
  date: { type: Date, default: Date.now },
}, {
  timestamps: true
});

// Expert Token Method
ExpertBasicsSchema.methods={
    generateExpertToken : function () {
      return jwt.sign(
        {
          id: this._id,
          firstName: this.firstName,
          lastName: this.lastName,
          admin_approved_expert: this.admin_approved_expert,
        },
        "3qdcBCZzmSE9H39Radno+8AbM6QqI6pTUD0rF7cD0ew=", 
        { expiresIn: "7d" } 
      );
    }
}


// Models
const ExpertBasics = model("ExpertBasics", ExpertBasicsSchema);
const ExpertCredentials = model("ExpertCredentials", ExpertCredentialsSchema);
const Session = model("Session", SessionSchema);
const Review = model("Review", ReviewSchema);

// Export the models
export {
  ExpertBasics,
  ExpertCredentials,
  Session,
  Review
};
