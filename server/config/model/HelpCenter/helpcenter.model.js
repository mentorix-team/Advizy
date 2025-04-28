import mongoose from "mongoose";

const helpCenterSchema = new mongoose.Schema({
  expert_id: {
    type: Schema.Types.ObjectId,
    ref: "ExpertBasics",
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  mobile: {
    type: String,
    required: true,
    trim: true,
  },
  problem: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const HelpCenterModel = mongoose.model("HelpCenter", helpCenterSchema);
export default HelpCenterModel;
