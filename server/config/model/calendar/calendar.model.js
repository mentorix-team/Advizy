import { model, Schema } from "mongoose";
import mongoose from "mongoose";

const AvailabilitySchema = new Schema(
  {
    expert_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ExpertBasics",
      required: true,
    },
    daySpecific: [
      {
        day: {
          type: String,
          required: true,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
          ],
        },
        slots: [
          {
            startTime: {
              type: String,
              required: true,
            },
            endTime: {
              type: String,
              required: true,
            },
            dates: [
              {
                date: { type: Date, required: true },
                slots: [
                  {
                    startTime: { type: String, required: true },
                    endTime: { type: String, required: true },
                    meeting_id: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "Meeting",
                    },
                  }
                ]
              }
            ]
            
          },
        ],
      },
    ],
    blockedDates: [
      {
        dates: { type: Date, required: true },
      },
    ],
    dateSpecific: [
      {
        date: { type: Date, required: true },
        slots: [
          {
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
            isBooked: {
              type: Boolean,
              default: false,
            },
            user_id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
          },
        ],
      },
    ],
    timezone: {
      value: { type: String, required: true },
      label: { type: String, required: true },
      offset: { type: Number, required: true },
      abbrev: { type: String },
      altName: { type: String },
    },
    bookingperiod: {
      type: String,
    },
    reschedulePolicy: {
      recheduleType: { type: String },
      noticeperiod: { type: String },
    },
  },
  { timestamps: true }
);

const Availability = model("Availability", AvailabilitySchema);

export { Availability };
