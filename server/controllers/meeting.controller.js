import { Notification } from "../config/model/Notification/notification.model.js";
import { Availability } from "../config/model/calendar/calendar.model.js";
import { ExpertBasics } from "../config/model/expert/expertfinal.model.js";
import { Meeting } from "../config/model/meeting/meeting.model.js";
import User  from "../config/model/user.model.js";
import AppError from "../utils/AppError.js";
import axios from 'axios'
import moment from 'moment-timezone'
import sendEmail from "../utils/sendEmail.js";
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken'
import { fileURLToPath } from "url";
import {Feedback} from '../config/model/Feedback/feedback.model.js'
const createMeetingToken = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { expertId, serviceId, daySpecific, expertName, serviceName, userName } = req.body;

    console.log('Received data:', req.body); // Log the incoming request body

    // Validate if all required fields are present
    if (!expertId || !serviceId || !daySpecific || !expertName || !userName || !serviceName || !daySpecific.date || !daySpecific.slot?.startTime || !daySpecific.slot?.endTime) {
      return next(new AppError('All fields are mandatory', 400));
    }

    // Create the meeting object with date and times as strings (no Date conversion)
    const meeting = new Meeting({
      userId,
      expertId,
      serviceId,
      daySpecific: {
        date: daySpecific.date, 
        slot: {
          startTime: daySpecific.slot.startTime, 
          endTime: daySpecific.slot.endTime,     
        },
      },
      userName,
      serviceName,
      expertName,
    });

    // Save the meeting to the database
    await meeting.save();

    // Generate the token for the meeting
    const token = meeting.generateToken();

    // Store the token in a cookie
    res.cookie('meetingToken', token, {
      httpOnly:true,
      secure: process.env.NODE_ENV === "production",
      sameSite:"None",
      maxAge: 1000 * 60 * 60, // 1 hour expiration time
    });

    // Send the response
    res.status(200).json({
      status: true,
      message: 'Meeting created and token stored in cookie',
      meeting,
    });
  } catch (error) {
    return next(new AppError(error.message || 'Server Error', 500));
  }
};

const updateMeetingStatus = async (req, res, next) => {
  try {
    const currentTime = new Date();

    // Find meetings where endTime has passed and videoCallId exists
    const expiredMeetings = await Meeting.find({
      videoCallId: { $ne: null }, // Ensure videoCallId exists
    });

    if (!expiredMeetings.length) {
      return res.status(200).json({ success: true, message: 'No meetings to update' });
    }

    // Process all expired meetings
    const updatePromises = expiredMeetings.map(async (meeting) => {
      const meetingEndTime = new Date(`${meeting.daySpecific.date}T${meeting.daySpecific.slot.endTime}Z`);

      // Check if meeting has expired
      if (meetingEndTime < currentTime) {
        try {
          await axios.patch(
            `https://api.dyte.io/v2/meetings/${meeting.videoCallId}`,
            { status: 'INACTIVE' },
            {
              auth: {
                username: 'a34d79f4-e39a-4eba-8966-0c4c14b53339', 
                password: '96f3307b8a180f089a90',
              },
              headers: { 'Content-Type': 'application/json' },
            }
          );

          console.log(`Meeting ${meeting.videoCallId} updated to INACTIVE`);
        } catch (err) {
          console.error(`Failed to update meeting ${meeting.videoCallId}:`, err.message);
        }
      }
    });

    await Promise.all(updatePromises);

    res.status(200).json({ success: true, message: 'Meetings updated successfully' });
  } catch (error) {
    return next(new AppError(error.message || 'Server Error', 500));
  }
};


const payedForMeeting = async (req, res, next) => {
  try {
    console.log("Request Body:", req.body);

    const { id } = req.meeting;
    const { amount, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!amount || !razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return next(new AppError("All payment fields are required", 401));
    }

    // Find meeting
    const meeting = await Meeting.findById(id);
    if (!meeting) return next(new AppError("Meeting not found", 404));

    const { expertId, daySpecific } = meeting;
    const { date, slot } = daySpecific;

    // Find expert availability
    const availability = await Availability.findOne({ expert_id: expertId });
    if (!availability) return next(new AppError("Expert availability not found", 404));

    // Convert meeting details to IST for accurate comparison
    const meetingDateIST = moment.utc(date).tz("Asia/Kolkata").format("YYYY-MM-DD");
    const meetingStartTimeIST = moment(slot.startTime, "hh:mm A").format("HH:mm");
    const meetingEndTimeIST = moment(slot.endTime, "hh:mm A").format("HH:mm");
    const meetingDay = moment.utc(date).tz(availability.timezone.value).format("dddd");

    console.log("Meeting Day (IST):", meetingDay);
    console.log("Meeting Date (IST):", meetingDateIST);
    console.log("Meeting Start-End Time (IST):", meetingStartTimeIST, "-", meetingEndTimeIST);

    // Step 1: Find the availability entry for the meeting's day
    const dayEntry = availability.daySpecific.find((day) => day.day === meetingDay);
    if (!dayEntry || !dayEntry.slots) {
      return next(new AppError("No slots available for this day", 405));
    }

    // Step 2: Find the matching time slot within that day
    const matchingSlot = dayEntry.slots.find((slotEntry) => {
      const slotStartTimeIST = moment.utc(slotEntry.startTime, "HH:mm").tz("Asia/Kolkata").format("HH:mm");
      const slotEndTimeIST = moment.utc(slotEntry.endTime, "HH:mm").tz("Asia/Kolkata").format("HH:mm");

      console.log("Checking Slot Time (IST):", slotStartTimeIST, "-", slotEndTimeIST);

      return meetingStartTimeIST >= slotStartTimeIST && meetingEndTimeIST <= slotEndTimeIST;
    });

    if (!matchingSlot) {
      return next(new AppError("No matching slot found for the given time", 406));
    }

    console.log("Matching Slot Found:", matchingSlot);

    // Step 3: Check for the matching date inside the selected slot
    const matchingDateEntry = matchingSlot.dates.find((dateEntry) => {
      const storedDateIST = moment.utc(dateEntry.date).tz("Asia/Kolkata").format("YYYY-MM-DD");
      console.log("Comparing Stored Date (IST):", storedDateIST, " with Meeting Date (IST):", meetingDateIST);
      return storedDateIST === meetingDateIST;
    });

    if (!matchingDateEntry) {
      return next(new AppError("No available date found for the selected slot", 406));
    }

    console.log("Matching Date Found:", matchingDateEntry);

    // Step 4: Update the matched slot with meeting ID
    matchingDateEntry.slots.push({
      startTime: meetingStartTimeIST,
      endTime: meetingEndTimeIST,
      meeting_id: meeting._id,
    });

    await availability.save();

    // Update meeting as paid
    meeting.amount = amount;
    meeting.razorpay_payment_id = razorpay_payment_id;
    meeting.razorpay_order_id = razorpay_order_id;
    meeting.razorpay_signature = razorpay_signature;
    meeting.isPayed = true;
    await meeting.save();

    // Create a notification
    const notification = new Notification({
      expertId: meeting.expertId,
      message: `Payment received for meeting on ${daySpecific.date} for ₹${meeting.amount}`,
      amount: meeting.amount,
    });

    await notification.save();

    // Send response
    res.status(200).json({
      success: true,
      message: "This meeting is paid, and the slot is marked as booked.",
      meeting,
    });

  } catch (error) {
    console.error("[ERROR] Error processing payment and booking:", error);
    return next(new AppError("Server error", 500));
  }
};



  
const getNotifications = async (req, res, next) => {
  try {
    const expertId  = req.expert.id; 
    console.log("this is expert id",expertId)
    const notifications = await Notification.find({ expertId })
      .sort({ timestamp: -1 })
      .limit(50);

      res.status(200).json({
        success: true,
        message: `All notifications of expert with id ${expertId}`,
        notifications,
      });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return next(new AppError(error.message || 'Server error', 500));
  }
};

const getmeet = async(req,res,next) =>{
  const {id} = req.params;
  if(!id){
    return next(new AppError('Id not found',505));
  }
  const meeting = await Meeting.findById(id);
  res.status(200).json({
    success:true,
    message:'meeting fetched',
    meeting:meeting
  })
}

const getMeetingById = async (req, res, next) => {
  try {
    if (!req.meeting || !req.meeting.id) {
      return next(new AppError('Meeting ID not found in request', 400)); // bad request
    }

    const { id } = req.meeting;
    const meeting = await Meeting.findById(id);

    if (!meeting) {
      return next(new AppError('Meeting not found', 404)); // meeting not found
    }

    res.status(200).json({
      status: true,
      message: 'Meeting fetched successfully',
      meeting,
    });
  } catch (error) {
    console.error('Error fetching meeting by ID:', error);
    return next(new AppError(error.message || 'Server error', 505)); // internal server error
  }
};
  
const getMeetingByUserId = async(req,res,next) =>{
  const userId = req.user.id;
  if(!userId){
    return next(new AppError('user not registered',500))
  }
  const meeting = await Meeting.find({userId}).lean()
  if(!meeting){
    return next(new AppError('this user doesn have any meeting',500));
  }
  return res.status(200).json({
    success:true,
    message:`Alll meetings of user with ${userId}`,
    meeting
  })
}

const getMeetingByExpertId = async(req,res,next) =>{
    const expertId = req.expert.id;
    if(!expertId){
      return next(new AppError('expert not registered',500))
    }
    const meeting = await Meeting.find({expertId}).lean()
    if(!meeting){
      return next(new AppError('this user doesn have any meeting',500));
    }
    return res.status(200).json({
      success:true,
      message:`Alll meetings of expert with ${expertId}`,
      meeting
    })
}

const createVideocall = async (req, res, next) => {
  const { title, preferred_region } = req.body;
  console.log("req.body",req.body)
  const {id} = req.meeting
  if (!title || !preferred_region) {
    return next(new AppError('All fields are required', 400));
  }

  const meeting = await Meeting.findById(id)
  if(!meeting){
    return next(new AppError('meeting not found',500));
  }

  const videoCallData = {
    title,
    preferred_region,
    record_on_start: false, 
    live_stream_on_start: false, 
  };

  try {
    const response = await axios.post(
      'https://api.dyte.io/v2/meetings',
      videoCallData,
      {
        auth:{
          username: 'a34d79f4-e39a-4eba-8966-0c4c14b53339',
          password: '96f3307b8a180f089a90'
        },
        headers: {
          'Content-Type': 'application/json',
        },
        
      }
    );

    console.log("This is meeting because i wanna check the date",meeting)

    meeting.videoCallId = response.data.data.id;
    console.log("this is the video call id generated",response.data.data.id)

    const expertNotification = new Notification({
      expertId: meeting.expertId,
      message: `Video call scheduled for ${meeting.daySpecific.date}. You can join by clicking the link.`,
      videoCallId:meeting.videoCallId
    });

    const userNotification = new Notification({
      userId: meeting.userId,
      message: `Your video call with the expert is scheduled for ${meeting.daySpecific.date}. You can join by clicking the link.`,
      videoCallId:meeting.videoCallId,
    });

    await expertNotification.save()
    await userNotification.save()
    await meeting.save()
    console.log("see my expert notification is generated",expertNotification)
    console.log("see my user notification is generated",userNotification)

    

    res.status(201).json({
      success: true,
      message: 'Video call created',
      data: response.data,
    });
  } catch (error) {
    console.log(error)
    return next(new AppError(error,505));
  }
};

const fetchActiveSession = async (req, res, next) => {
  const { meetingId } = req.params; // This is now the videoCallId

  if (!meetingId) {
    return next(new AppError("Meeting ID is required", 400));
  }

  try {
    const response = await axios.get(
      `https://api.dyte.io/v2/sessions/${meetingId}`, // Adjusted URL for sessions
      {
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${Buffer.from(
            "a34d79f4-e39a-4eba-8966-0c4c14b53339:96f3307b8a180f089a90"
          ).toString("base64")}`,
        },
        params: {
          include_breakout_rooms: true,   
        },
      }
    );
    

    res.status(200).json({
      success: true,
      message: `This is meeting data with id ${meetingId}`,
      data: response.data,
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return next(new AppError("Active session not found", 404));
    }
    console.error(error);
    return next(new AppError("Error fetching active session", 500));
  }
};

const createPresetForHost = async (preset_name) => {
  try {
    const presetData = {
      name: preset_name,
      config: {
        view_type: "GROUP_CALL",
        max_video_streams: {
          mobile: 0,
          desktop: 0,
        },
        max_screenshare_count: 0,
        media: {
          audio: {
            enable_stereo: false,
            enable_high_bitrate: false,
          },
          video: {
            quality: "hd",
            frame_rate: 30,
          },
          screenshare: {
            quality: "hd",
            frame_rate: 0,
          },
        },
      },
      permissions: {
        accept_waiting_requests: true,
        can_accept_production_requests: true,
        can_edit_display_name: true,
        can_spotlight: true,
        is_recorder: false,
        recorder_type: "NONE",
        disable_participant_audio: true,
        disable_participant_screensharing: true,
        disable_participant_video: true,
        kick_participant: true,
        pin_participant: true,
        can_record: true,
        can_livestream: true,
        waiting_room_type: "SKIP",
        plugins: {
          can_close: true,
          can_start: true,
          can_edit_config: true,
          config: {},  // Set this to an empty object or a valid config object as per API specifications
        },
        connected_meetings: {
          can_alter_connected_meetings: true,
          can_switch_connected_meetings: true,
          can_switch_to_parent_meeting: true,
        },
        polls: {
          can_create: true,
          can_vote: true,
          can_view: true,
        },
        media: {
          video: {
            can_produce: "ALLOWED",
          },
          audio: {
            can_produce: "ALLOWED",
          },
          screenshare: {
            can_produce: "ALLOWED",
          },
        },
        chat: {
          public: {
            can_send: true,
            text: true,
            files: true,
          },
          private: {
            can_send: true,
            can_receive: true,
            text: true,
            files: true,
          },
        },
        hidden_participant: true,
        show_participant_list: true,
        can_change_participant_permissions: true,
      },
      ui: {
        design_tokens: {
          border_radius: "rounded",
          border_width: "thin",
          spacing_base: 4,
          theme: "dark",
          colors: {
            brand: {
              300: "#844d1c",
              400: "#9d5b22",
              500: "#b56927",
              600: "#d37c30",
              700: "#d9904f",
            },
            background: {
              600: "#222222",
              700: "#1f1f1f",
              800: "#1b1b1b",
              900: "#181818",
              1000: "#141414",
            },
            danger: "#FF2D2D",
            text: "#EEEEEE",
            text_on_brand: "#EEEEEE",
            success: "#62A504",
            video_bg: "#191919",
            warning: "#FFCD07",
          },
          logo: "https://yourlogo.url/logo.png",  // Replace this with a valid URL for your logo
        },
        config_diff: {},
      },
    };

    const response = await axios.post(
      'https://api.dyte.io/v2/presets',
      presetData,
      {
        auth: {
          username: 'a34d79f4-e39a-4eba-8966-0c4c14b53339',  // Use your ORG_ID here
          password: '96f3307b8a180f089a90',  // Use your API_KEY 
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data.id;  // Return preset ID for use later
  } catch (error) {
    console.error('Error creating preset:', error.response?.data || error.message);
    throw new Error('Failed to create preset');
  }
};

const addVideoParticipants = async (req, res, next) => {
  const { meeting_id, name, picture, preset_name, custom_participant_id } = req.body;

  if (!meeting_id || !preset_name || !custom_participant_id) {
    return next(new AppError("Meeting ID, preset name, and custom participant ID are required.", 400));
  }

  try {
    // Fetch meeting details from DB
    const meeting = await Meeting.findOne({ videoCallId: meeting_id });
    if (!meeting) {
      console.error("Meeting not found for ID:", meeting_id);
      return next(new AppError("Meeting not found", 404));
    }

    console.log("Meeting Data:", JSON.stringify(meeting, null, 2));

    const { startTime, endTime } = meeting.daySpecific.slot;
    if (!startTime || !endTime) {
      console.error("Meeting startTime or endTime is missing.");
      return next(new AppError("Meeting startTime or endTime is missing", 400));
    }

    const meetingDate = meeting.daySpecific.date; // Format: "YYYY-MM-DD"
    console.log("Raw Meeting Date from DB:", meetingDate);
    console.log("Raw Start Time from DB:", startTime);
    console.log("Raw End Time from DB:", endTime);

    // ✅ Convert the meeting time from IST (stored in DB) correctly
    const startDateTimeIST = moment.tz(`${meetingDate} ${startTime}`, "YYYY-MM-DD hh:mm A", "Asia/Kolkata");
    const endDateTimeIST = moment.tz(`${meetingDate} ${endTime}`, "YYYY-MM-DD hh:mm A", "Asia/Kolkata");

    console.log("Start DateTime in IST:", startDateTimeIST.format());
    console.log("End DateTime in IST:", endDateTimeIST.format());

    // ✅ Corrected allowed join time (5 minutes before start)
    const allowedJoinTimeIST = startDateTimeIST.clone().subtract(5, "minutes");
    console.log("Allowed Joining Time (5 minutes before start) in IST:", allowedJoinTimeIST.format());

    // ✅ Capture current time in IST properly
    const currentTimeIST = moment().tz("Asia/Kolkata");
    console.log("Current Time (IST):", currentTimeIST.format());

    // ✅ Checking if user is too early or too late
    if (currentTimeIST.isBefore(allowedJoinTimeIST)) {
      console.error("User is trying to join too early.");
      return next(new AppError("You can join only 5 minutes before the meeting start time.", 400));
    }

    if (currentTimeIST.isAfter(endDateTimeIST)) {
      console.error("Meeting has already ended.");
      return next(new AppError("Meeting has already ended. You cannot join.", 400));
    }

    console.log("✅ User is allowed to join the meeting.");

    // ✅ Fetch preset details or create a new one
    let presetId;
    try {
      const presetResponse = await axios.get(`https://api.dyte.io/v2/presets`, {
        auth: { username: "a34d79f4-e39a-4eba-8966-0c4c14b53339", password: "96f3307b8a180f089a90" },
        headers: { "Content-Type": "application/json" },
      });

      const preset = presetResponse.data.data.find((preset) => preset.name === preset_name);
      if (preset) {
        presetId = preset.id;
      } else {
        const createPresetResponse = await createPresetForHost(preset_name);
        presetId = createPresetResponse?.id;
      }
    } catch (error) {
      console.error("Failed to fetch or create preset:", error.message);
      return next(new AppError("Failed to fetch or create preset", 500));
    }

    // ✅ Prepare participant data
    const participantData = {
      preset_name,
      custom_participant_id,
      name,
      picture,
    };

    console.log("Sending request to add participant...");

    // ✅ Add participant to the meeting
    const response = await axios.post(
      `https://api.dyte.io/v2/meetings/${meeting_id}/participants`,
      participantData,
      {
        auth: { username: "a34d79f4-e39a-4eba-8966-0c4c14b53339", password: "96f3307b8a180f089a90" },
        headers: { "Content-Type": "application/json" },
      }
    );

    console.log("✅ Participant added successfully:", response.data);

    res.status(201).json({
      success: true,
      message: "Participant added successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("❌ Unexpected Error:", error);
    return next(new AppError(error.message || "Internal Server Error", 505));
  }
};
const kickAllparticipant = async (req, res, next) => {
  try {
    const { id } = req.body;
    console.log('Received videoCallId:', id);

    // Find meeting by videoCallId
    const meeting = await Meeting.findOne({ videoCallId: id });
    if (!meeting) {
      return next(new AppError("Meeting not found", 404));
    }

    const meetingId = meeting.videoCallId; // The stored video call ID

    if (!meetingId) {
      return next(new AppError("No video call ID found for this meeting", 400));
    }

    // API Call to Dyte to kick all participants
    const response = await axios.post(
      `https://api.dyte.io/v2/meetings/${meetingId}/active-session/kick-all`,
      {},
      {
        auth: {
          username: "a34d79f4-e39a-4eba-8966-0c4c14b53339",
          password: "96f3307b8a180f089a90",
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Kick response:", response.data);

    res.status(200).json({
      success: true,
      message: "All participants kicked successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error kicking participants:", error);
    return next(new AppError(error.response?.data || "Server error", 500));
  }
};

const checkPresetExists = async (req, res, next) => {
  const { preset_name } = req.body;
  console.log('This is the ppreset',req.body)
  if (!preset_name) {
    return next(new AppError('Preset name is required', 400));
  }

  try {
    const response = await axios.get(
      `https://api.dyte.io/v2/presets`, 
      {
        auth: {
          username: 'a34d79f4-e39a-4eba-8966-0c4c14b53339',
          password: '96f3307b8a180f089a90',
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const preset = response.data.find(preset => preset.name === preset_name);

    if (preset) {
      return res.status(200).json({
        success: true,
        message: 'Preset exists',
        data: preset,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: 'Preset not found',
      });
    }
  } catch (error) {
    console.error('Error checking preset:', error.response?.data || error.message);
    return next(new AppError('Failed to check preset', 500));
  }
};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const rescheduleMeetingExpert = async (req, res, next) => {
    const { id } = req.expert;
    const { reason, userId, serviceName, serviceId, meetingId, razorpay_payment_id } = req.body;
    console.log(req.body)
    try {
        const expert = await ExpertBasics.findById(id);
        const user = await User.findById(userId);
        const meeting = await Meeting.findById(meetingId);

        if (!expert || !user) {
            return res.status(404).json({ success: false, message: "Expert or User not found" });
        }

        if (!meeting) {
            return res.status(404).json({ success: false, message: "Meeting not found" });
        }

        // Generate a secure token containing essential meeting details
        const updateMeetingToken = jwt.sign(
            { meetingId, expertId: id, userId, serviceId, reason },
            'ieXGJQQ7sJxMIknxSJUMmfy8X2wU8Eyb4T6/j/IGMD4=',
            { expiresIn: "1d" }
        );

        // Read the email template
        const templatePath = path.join(__dirname, "./EmailTemplates/expertreschedulerequest.html");
        let emailTemplate = fs.readFileSync(templatePath, "utf8");

        // Replace placeholders in the template
        emailTemplate = emailTemplate
            .replace("{EXPERT_NAME}", expert.firstName)
            .replace("{USER_NAME}", user.firstName)
            .replace("{RESCHEDULE_REASON}", reason)
            .replace("{SERVICE_NAME}", serviceName)
            .replace("{UPDATE_MEETING_TOKEN}", updateMeetingToken)
            .replace("{PAYMENT_ID}", razorpay_payment_id);

        const subject = `Reschedule Request from ${expert.firstName}`;

        // Send email to the user
        await sendEmail(user.email, subject, emailTemplate);

        res.status(200).json({
            success: true,
            message: "Reschedule email sent to user successfully",
            updateMeetingToken, // Returning token in response for tracking if needed
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error processing reschedule request" });
    }
};

export const verifyRescheduleToken = async (req, res) => {
  try {
      console.log("Received Body:", req.body); // Debugging Log

      // Extract the token dynamically (since it's incorrectly structured)
      const tokenKey = Object.keys(req.body)[0]; // Get the first key in req.body
      const token = tokenKey; // The token itself is the key

      if (!token) {
          return res.status(400).json({ success: false, message: "Token is required" });
      }

      // Verify the token
      const decoded = jwt.verify(token, 'ieXGJQQ7sJxMIknxSJUMmfy8X2wU8Eyb4T6/j/IGMD4=');
      if (!decoded) {
          return res.status(401).json({ success: false, message: "Invalid or expired token" });
      }

      const { meetingId, expertId, userId, serviceId, reason } = decoded;

      // Fetch relevant details
      const meeting = await Meeting.findById(meetingId);
      const expert = await ExpertBasics.findById(expertId);
      const user = await User.findById(userId);

      if (!meeting || !expert || !user) {
          return res.status(404).json({ success: false, message: "Meeting, Expert, or User not found" });
      }

      res.status(200).json({
          success: true,
          data: {
              meetingId,
              expert: {
                  _id: expert._id,
                  firstName: expert.firstName,
                  lastName: expert.lastName,
                  credentials: expert.credentials
              },
              user: {
                  _id: user._id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email
              },
              serviceId,
              reason,
          },
      });

  } catch (error) {
      console.error("Error verifying reschedule token:", error);
      res.status(500).json({ success: false, message: "Error verifying token" });
  }
};


const updateMeeting = async (req, res, next) => {
  try {
      console.log(req.body); // Debugging log

      const { token, expertId, serviceId, daySpecific, userName, serviceName, expertName } = req.body;
      
      if (!token || !token.updatemeetingtoken) {
          return res.status(400).json({ success: false, message: "Missing update token" });
      }

      // Extract the actual token string
      const { updatemeetingtoken } = token;

      // Verify and decode the token
      const decoded = jwt.verify(updatemeetingtoken, 'ieXGJQQ7sJxMIknxSJUMmfy8X2wU8Eyb4T6/j/IGMD4=');
      const { meetingId, userId, reason } = decoded;

      // Validate date and slot
      if (!daySpecific || !daySpecific.date || !daySpecific.slot || !daySpecific.slot.startTime || !daySpecific.slot.endTime) {
          return res.status(400).json({ success: false, message: "Invalid date or slot details" });
      }

      const { date, slot: { startTime, endTime } } = daySpecific;

      // Find the meeting
      const meeting = await Meeting.findById(meetingId);
      if (!meeting) {
          return res.status(404).json({ success: false, message: "Meeting not found" });
      }

      // Ensure only authorized users update the meeting
      if (meeting.userId.toString() !== userId || meeting.expertId.toString() !== expertId) {
          return res.status(403).json({ success: false, message: "Unauthorized request" });
      }

      // Update meeting details
      meeting.daySpecific = { date, slot: { startTime, endTime } };

      // Save the updated meeting
      await meeting.save();

      res.status(200).json({
          success: true,
          message: "Meeting updated successfully",
          updatedMeeting: meeting,
      });

  } catch (error) {
      console.error("Error updating meeting:", error);
      res.status(500).json({ success: false, message: "Error updating meeting" });
  }
};

const updateMeetingDirectly = async(req,res,next)=>{
  try {
    
    const {expertId, serviceId, daySpecific, userName, serviceName, expertName,meeting_id } = req.body;
    console.log('THis is req.body',req.body);
  
    const { date, slot: { startTime, endTime } } = daySpecific;
    
    const meeting = await Meeting.findById(meeting_id);
    if (!meeting) {
      return next(new AppError('Meetings not found',404));
    }
    // if (meeting.userId.toString() !== userId || meeting.expertId.toString() !== expertId) {
    //   return next(new AppError('Unauthorized request',403));
    // }
    meeting.daySpecific = { date, slot: { startTime, endTime } };
    await meeting.save();

    const templatePath = path.join(__dirname, "./EmailTemplates/UserDirectlyRescheduled.html");
    let emailTemplate = fs.readFileSync(templatePath, "utf8");

    emailTemplate = emailTemplate.replace("{USERNAME}", userName);
    emailTemplate = emailTemplate.replace("{DATE}",date );
    emailTemplate = emailTemplate.replace("{STARTTIME}",startTime );
    emailTemplate = emailTemplate.replace("{ENDTIME}",endTime );
    emailTemplate = emailTemplate.replace("{ExpertName}",expertName );

    console.log('This is exert id ',expertId);
    const expert = await ExpertBasics.findById(expertId)
    if(!expert){
      return next(new AppError('Expert not found',502))
    }
    const email = expert.email
    console.log("This is the mail",expert.email);

    await sendEmail(email, "Meetint Rescheduled Directly", emailTemplate, true);

    res.status(200).json({
        success: true,
        message: "Meeting updated successfully",
        updatedMeeting: meeting,
    });
  } catch (error) {
    return next(new AppError(error,505))
  }
}

const getClientDetails = async (req, res, next) => {
  try {
      console.log("Request Body:", req.body);

      // Extract the key dynamically (since the key itself is the ID)
      const id = Object.keys(req.body)[0]; 

      if (!id) {
          return next(new AppError("User ID is required", 400));
      }

      const user = await User.findById(id);
      if (!user) {
          return next(new AppError("User not found", 404));
      }

      return res.status(200).json({
          success: true,
          message: `User found with ID: ${id}`,
          user,
      });
  } catch (error) {
      console.error("Error fetching user:", error);
      return next(new AppError("Internal Server Error", 500));
  }
};

const giveFeedback = async(req,res,next) =>{
  const {feedback,rating,user_id,expert_id,meeting_id,userName,expertName,serviceName} = req.body;
  console.log(req.body);
  try {
    const feedbacks = await Feedback.create({
      feedback,
      rating,
      user_id,
      expert_id,
      meeting_id,
      userName,
      expertName,
      serviceName
    })
  
    res.status(200).json({
      success:true,
      message:'Feedback submitted succesfully',
      feedbacks
    })
  } catch (error) {
    return next(new AppError(error,500))
  }
}

const getFeedbackbyexpertId = async(req,res,next) =>{
  const {id} = req.body;
  console.log(req.body);
  if(!id){
    return next(new AppError('Id is not there',500))
  }
  
  const feedback = await Feedback.find({expert_id:id})


  if(!feedback){
    return next(new AppError('Feedback not found',406))
  }

  res.status(200).json({
    success:true,
    message:'All Feedback of the users',
    feedback
  })
}
const getthemeet = async(req,res,next) =>{
  try {
    const {id} = req.body;
    console.log('this is id',id);
    const meeting = await Meeting.findById(id)

    if(!meeting){
      return next(new AppError('meeting not founnd ',403))
    }

    res.status(200).json({
      success:true,
      message:'The meeting',
      meeting
    })
  } catch (error) {
    console.log(error);
    return next(new AppError(error.message,505))
  }
}

export {
  createMeetingToken,
  getMeetingById,
  getMeetingByUserId,
  getMeetingByExpertId,
  payedForMeeting,
    getNotifications,
    createVideocall,
    addVideoParticipants,
    checkPresetExists,
    createPresetForHost,
    fetchActiveSession,
    updateMeetingStatus,
    rescheduleMeetingExpert,
    updateMeeting,
    getClientDetails,
    getmeet,
    updateMeetingDirectly,
    kickAllparticipant,
    giveFeedback,
    getFeedbackbyexpertId,
    getthemeet
}