import {Availability} from '../config/model/calendar/calendar.model.js'
import { ExpertBasics } from '../config/model/expert/expertfinal.model.js';
import AppError from '../utils/AppError.js';
import moment from 'moment-timezone'

const addAvailability = async (req, res, next) => {
  console.log("Received Request Body:", JSON.stringify(req.body, null, 2));

  const { data, features, timezone } = req.body;
  const expertid = req.expert.id;

  const userTimezone = timezone || "Asia/Kolkata"; 
  const timezoneLabel = timezone 
    ? `(GMT${moment.tz(userTimezone).utcOffset() / 60}) ${moment.tz(userTimezone).format('z')}` 
    : "(GMT+5:30) Chennai, Kolkata, Mumbai, New Delhi";
  const timezoneOffset = moment.tz(userTimezone).utcOffset();

  try {
    let availabilityDoc = await Availability.findOne({ expert_id: expertid });

    if (!availabilityDoc) {
      availabilityDoc = new Availability({
        expert_id: expertid,
        timezone: {
          value: userTimezone, 
          label: timezoneLabel,
          offset: timezoneOffset,
        },
        daySpecific: [
          { day: "Monday", slots: null },
          { day: "Tuesday", slots: null },
          { day: "Wednesday", slots: null },
          { day: "Thursday", slots: null },
          { day: "Friday", slots: null },
          { day: "Saturday", slots: null },
          { day: "Sunday", slots: null },
        ],
        features: [],
        bookingperiod: "2", // Set default booking period
        reschedulePolicy: {
          recheduleType: "Request reschedule", // Default reschedule type
          noticeperiod: "30 mins", // Default notice period
        },
      });
    }

    if (data && Array.isArray(data)) {
      for (const { day, slots } of data) {
        console.log(`Processing day: ${day}, slots: ${JSON.stringify(slots)}`);

        if (!day) {
          console.error("Invalid day received:", { day, slots });
          return next(new AppError("Each entry must include a valid day.", 400));
        }

        const dayEntry = availabilityDoc.daySpecific.find((entry) => entry.day === day);

        if (dayEntry) {
          dayEntry.slots = slots && Array.isArray(slots) && slots.length > 0
            ? slots.map(({ startTime, endTime, dates }) => {
                const startTimeUTC = moment.tz(startTime, "hh:mm A", userTimezone).utc().format("HH:mm");
                const endTimeUTC = moment.tz(endTime, "hh:mm A", userTimezone).utc().format("HH:mm");

                const formattedDates = Array.isArray(dates)
                  ? dates.map((date) => {
                      const parsedDate = moment.tz(date, userTimezone);
                      if (!parsedDate.isValid()) {
                        throw new Error(`Invalid date format in request: ${date}`);
                      }
                      return {
                        date: parsedDate.utc().toDate(),
                        isBooked: false,
                        startTime: startTimeUTC,
                        endTime: endTimeUTC,
                      };
                    })
                  : [];

                return {
                  startTime: startTimeUTC,
                  endTime: endTimeUTC,
                  dates: formattedDates,
                };
              })
            : null;
        }
      }

      const daysInRequest = data.map((entry) => entry.day);
      availabilityDoc.daySpecific.forEach((entry) => {
        if (!daysInRequest.includes(entry.day)) {
          entry.slots = null;
        }
      });
    } else {
      availabilityDoc.daySpecific.forEach((entry) => {
        entry.slots = null;
      });
    }

    if (features && Array.isArray(features)) {
      availabilityDoc.features = features;
    }

    // Set default values if not already set
    if (!availabilityDoc.bookingperiod) {
      availabilityDoc.bookingperiod = "2";
    }

    if (!availabilityDoc.reschedulePolicy) {
      availabilityDoc.reschedulePolicy = {
        recheduleType: "Request reschedule",
        noticeperiod: "30 mins",
      };
    } else {
      if (!availabilityDoc.reschedulePolicy.recheduleType) {
        availabilityDoc.reschedulePolicy.recheduleType = "Request reschedule";
      }
      if (!availabilityDoc.reschedulePolicy.noticeperiod) {
        availabilityDoc.reschedulePolicy.noticeperiod = "30 mins";
      }
    }

    await availabilityDoc.save();
    console.log("Saved Availability Document:", JSON.stringify(availabilityDoc.daySpecific, null, 2));

    res.status(200).json({
      success: true,
      message: "Availability updated successfully.",
      availability: availabilityDoc,
    });
  } catch (error) {
    console.error("Error while updating availability:", error.message);
    return next(new AppError(error.message || "Server error while saving availability.", 500));
  }
};



const editAvailability = async (req, res, next) => {
  console.log("Received Request Body for Edit:", JSON.stringify(req.body, null, 2)); // Log the incoming request body

  const { data } = req.body; // Expecting the request to have day and slots to edit
  const expertid = req.expert.id;

  try {
    // Fetch the existing availability document
    const availabilityDoc = await Availability.findOne({ expert_id: expertid });

    if (!availabilityDoc) {
      return next(new AppError("Availability document not found.", 404));
    }

    if (!data || !Array.isArray(data)) {
      return next(new AppError("Invalid request format. 'data' must be an array.", 400));
    }

    // Process the data to update only specified days
    for (const { day, slots } of data) {
      console.log(`Editing day: ${day}, slots: ${JSON.stringify(slots)}`);

      if (!day) {
        console.error("Invalid day received:", { day, slots });
        return next(new AppError("Each entry must include a valid day.", 400));
      }

      const dayEntry = availabilityDoc.daySpecific.find((entry) => entry.day === day);

      if (dayEntry) {
        // Update slots for the day, or reset to null if slots are not provided
        dayEntry.slots = slots && Array.isArray(slots) && slots.length > 0
          ? slots.map(({ startTime, endTime }) => {
              // Convert the startTime and endTime to UTC time without a date
              const startTimeUTC = moment.tz(moment(startTime, "hh:mm A"), availabilityDoc.timezone.value).utc().format("HH:mm");
              const endTimeUTC = moment.tz(moment(endTime, "hh:mm A"), availabilityDoc.timezone.value).utc().format("HH:mm");

              return {
                startTime: startTimeUTC,
                endTime: endTimeUTC,
              };
            })
          : null;
      } else {
        console.warn(`Day not found in availability: ${day}`);
      }
    }

    // Save the updated availability document
    await availabilityDoc.save();

    res.status(200).json({
      success: true,
      message: "Availability updated successfully.",
      availability: availabilityDoc,
    });
  } catch (error) {
    console.error("Error while editing availability:", error.message);
    return next(new AppError(error.message || "Server error while editing availability.", 500));
  }
};


const saveAvailability = async (req, res, next) => {
  const { data } = req.body; // The `data` array contains day and slot details
  const expertId = req.expert.id; // Extract expert ID from the authenticated user

  if (!Array.isArray(data) || data.length === 0) {
    return next(new AppError("Invalid data. Provide day and valid slots.", 400));
  }

  try {
    // Fetch the expert's existing availability document
    const availabilityDoc = await Availability.findOne({ expert_id: expertId });

    if (!availabilityDoc || !availabilityDoc.timezone) {
      return next(new AppError("Availability or timezone not found.", 404));
    }

    const { timezone } = availabilityDoc;

    // Iterate over the `data` array to update or create availability
    for (const { day, slots } of data) {
      if (!day || !Array.isArray(slots) || slots.length === 0) {
        return next(new AppError("Each day must have valid slots.", 400));
      }

      // Convert slots to UTC using the expert's timezone
      const convertedSlots = slots.map(({ startTime, endTime }) => ({
        startTime: moment.tz(startTime, "hh:mm A", timezone.value).utc().format("HH:mm"),
        endTime: moment.tz(endTime, "hh:mm A", timezone.value).utc().format("HH:mm"),
      }));

      // Check if the day already exists
      const existingDay = availabilityDoc.daySpecific.find((entry) => entry.day === day);

      if (existingDay) {
        // Update slots for the existing day
        existingDay.slots = convertedSlots;
      } else {
        // Add new day if it doesn't exist
        availabilityDoc.daySpecific.push({ day, slots: convertedSlots });
      }
    }

    // Save the updated document
    await availabilityDoc.save();

    res.status(200).json({
      success: true,
      message: "Availability updated successfully.",
      availability: availabilityDoc,
    });
  } catch (error) {
    console.error("Error saving availability:", error);
    return next(new AppError("Server error while saving availability.", 500));
  }
};


const addBlockedDates = async (req, res, next) => {
  const { dates } = req.body; // Array of dates to block
  const expertId = req.expert.id;

  if (!Array.isArray(dates) || dates.length === 0) {
    return next(new AppError("Blocked dates are required and must be an array.", 400));
  }

  try {
    // Fetch the expert's availability and timezone
    const availability = await Availability.findOne({ expert_id: expertId });

    if (!availability) {
      return next(new AppError("Availability not found for this expert.", 404));
    }

    if (!availability.timezone || !availability.timezone.value) {
      return next(new AppError("Expert's timezone is not set.", 400));
    }

    const timezone = availability.timezone.value; // Use the expert's timezone

    // Convert each date to UTC format using the expert's timezone
    const convertedDates = dates.map((date) =>
      moment.tz(date, timezone).utc().format("YYYY-MM-DD")
    );

    // Merge existing blocked dates and new converted dates, ensuring uniqueness
    const uniqueBlockedDates = [
      ...availability.blockedDates.map((d) => moment(d.dates).utc().format("YYYY-MM-DD")),
      ...convertedDates,
    ].filter((date, index, self) => self.indexOf(date) === index);

    // Update blockedDates in the availability document
    availability.blockedDates = uniqueBlockedDates.map((date) => ({
      dates: new Date(date),
    }));

    // Log the dates being stored in the database
    console.log("Blocked Dates to be stored in DB:", availability.blockedDates);

    await availability.save();

    res.status(200).json({
      success: true,
      message: "Blocked dates added successfully.",
      availability: availability,
    });
  } catch (error) {
    console.error("Error adding blocked dates:", error);
    return next(new AppError(error.message, 500));
  }
};


const addSpecificDates = async (req, res, next) => {
  console.log("Full Request Body:", req.body); // Log the entire request body

  const { specific_dates } = req.body;

  // Validate specific_dates
  if (!Array.isArray(specific_dates) || specific_dates.length === 0) {
    return next(new AppError("Specific dates are required and must be an array.", 400));
  }

  const expertId = req.expert.id;

  try {
    const availability = await Availability.findOne({ expert_id: expertId });

    if (!availability) {
      return next(new AppError("Availability not found for this expert.", 404));
    }

    const existingSpecificDates = availability.specific_dates || [];

    // Convert the provided dates to UTC format and ensure uniqueness
    const uniqueSpecificDates = [
      ...existingSpecificDates.map((d) => d.date.toISOString()), // Existing dates in UTC format
      ...specific_dates.map((d) => moment(d.date).utc().toISOString()), // Convert new dates to UTC
    ].filter((date, index, self) => self.indexOf(date) === index); // Filter to ensure uniqueness

    // Map the unique dates and their respective slots
    availability.specific_dates = uniqueSpecificDates.map((date) => {
      // Find the corresponding specific date and slots from the request body
      const matchingSpecificDate = specific_dates.find(
        (specificDate) => moment(specificDate.date).utc().toISOString() === date
      );

      // Convert the date string (ISO 8601) back to a Date object
      const convertedDate = new Date(date); // This is in UTC

      console.log("Storing date in DB:", convertedDate.toISOString()); // Log the UTC date being stored

      return {
        date: convertedDate, // Store the UTC date
        slots: matchingSpecificDate ? matchingSpecificDate.slots : [], // Store the associated slots
      };
    });

    // Save the updated availability document
    await availability.save();

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Specific dates and slots added successfully.",
      availability: availability,
    });
  } catch (error) {
    console.error("Error adding specific dates:", error);
    return next(new AppError(error.message || "Server error while saving specific dates.", 500));
  }
};

  

const updateAvailability = async (req, res, next) => {
    const { date, slots } = req.body;
  
    if (!date || !slots || !Array.isArray(slots)) {
      return next(new AppError("Date and valid slots are required.", 400));
    }
  
    try {
      const availability = await Availability.findOne({ expert_id: req.expert.id, date });
  
      if (!availability) {
        return next(new AppError("No availability found for this date.", 404));
      }
  
      availability.slots = slots; // Update slots
      await availability.save();
  
      res.status(200).json({
        success: true,
        message: "Availability updated successfully.",
        availability,
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
};

  
const deleteAvailability = async (req, res, next) => {
    const { date } = req.body;
  
    if (!date) {
      return next(new AppError("Date is required.", 400));
    }
  
    try {
      const availability = await Availability.findOneAndDelete({ expert_id: req.expert.id, date });
  
      if (!availability) {
        return next(new AppError("No availability found for this date.", 404));
      }
  
      res.status(200).json({
        success: true,
        message: "Availability deleted successfully.",
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
};

  
const viewAvailability = async (req, res, next) => {
  const expertId = req.expert.id; // Correctly extract the expertId

  try {
    const availability = await Availability.find({ expert_id: expertId });

    if (!availability) {
      return next(new AppError("No availability found for this expert.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Fetched availability of expert",
      availability,
    });
  } catch (error) {
    console.error("Error fetching availability:", error.message); // Log the error
    return next(new AppError(error.message, 500));
  }
};


  
const bookSlot = async (req, res, next) => {
    const { expertId, date, startTime, endTime } = req.body;
  
    if (!expertId || !date || !startTime || !endTime) {
      return next(new AppError("All fields are required.", 400));
    }
  
    try {
      const availability = await Availability.findOne({ expert_id: expertId, date });
  
      if (!availability) {
        return next(new AppError("No availability found for this date.", 404));
      }
  
      const slot = availability.slots.find(
        (slot) =>
          slot.startTime.getTime() === new Date(startTime).getTime() &&
          slot.endTime.getTime() === new Date(endTime).getTime()
      );
  
      if (!slot) {
        return next(new AppError("Slot not found.", 404));
      }
  
      if (slot.isBooked) {
        return next(new AppError("Slot is already booked.", 400));
      }
  
      slot.isBooked = true;
      slot.user_id = req.user.id;
  
      await availability.save();
  
      res.status(200).json({
        success: true,
        message: "Slot booked successfully.",
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
};

const changeSettings = async (req, res, next) => {
    console.log(req.body)
    const { timezone, bookingperiod, noticeperiod } = req.body;
    const expert_id = req.expert.id;
  
    try {
      const availability = await Availability.findOne({ expert_id });
  
      if (!availability) {
        return next(new AppError("Availability not found", 404));
      }
  
      if (timezone) {
        availability.timezone = timezone;
      }
      if (bookingperiod) {
        availability.bookingperiod = bookingperiod;
      }
      if (noticeperiod) {
        availability.noticeperiod = noticeperiod;
      }
  
      await availability.save();
  
      res.status(200).json({
        success: true,
        message: "Settings updated successfully",
        availability
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      return next(new AppError(error.message, 500));
    }
};
  
const reschedulePolicy = async (req, res, next) => {
    console.log(req.body)
    try {
      const { recheduleType, noticeperiod } = req.body;
      const expertId = req.expert.id; 
  
      const availability = await Availability.findOne({ expert_id: expertId });
  
      if (!availability) {
        return next(new AppError("Availability not found", 404));
      }
  
      availability.reschedulePolicy = {
        recheduleType,
        noticeperiod,
      };
  
      await availability.save();
  
      res.status(200).json({
        success: true,
        message: "Reschedule policy updated successfully",
        data: availability.reschedulePolicy,
      });
    } catch (error) {
      console.error("Error updating reschedule policy:", error);
      next(new AppError("An error occurred while updating reschedule policy", 500));
    }
};

const changeTimezone = async (req, res, next) => {
    console.log(req.body);
    const { timezone } = req.body;
    const expert_id = req.expert.id; // Adjust based on your auth setup
  
    try {
      const availability = await Availability.findOne({ expert_id });
  
      if (!availability) {
        return next(new AppError("Availability not found", 404));
      }
  
      // Validate and update the timezone field
      if (timezone && typeof timezone === "object") {
        availability.timezone = {
          value: timezone.value,
          label: timezone.label,
          offset: timezone.offset,
          abbrev: timezone.abbrev,
          altName: timezone.altName,
        };
      } else {
        return next(new AppError("Invalid timezone format", 400));
      }
  
      await availability.save();
  
      res.status(200).json({
        success: true,
        message: "Timezone updated successfully",
        availability,
      });
    } catch (error) {
      console.error("Error updating timezone:", error);
      return next(new AppError(error.message, 500));
    }
};
  
const getAvailabilitybyid = async (req, res, next) => {
  try {
    const { id: expert_id } = req.params;

    // Fetch availability
    const availability = await Availability.findOne({ expert_id }).lean();
    if (!availability) {
      return res.status(404).json({ success: false, message: "Expert availability not found" });
    }

    const istTimezone = availability.timezone?.value || "Asia/Kolkata"; // Ensure correct timezone (IST)

    // Convert `daySpecific` slots times & dates from UTC to IST
    availability.daySpecific = availability.daySpecific
      ? availability.daySpecific.map((dayEntry) => ({
          ...dayEntry,
          slots: dayEntry.slots
            ? dayEntry.slots.map((slot) => ({
                ...slot,
                startTime: moment.utc(slot.startTime, "HH:mm").tz(istTimezone).format("hh:mm A"),
                endTime: moment.utc(slot.endTime, "HH:mm").tz(istTimezone).format("hh:mm A"),
                dates: slot.dates
                  ? slot.dates.map((dateEntry) => ({
                      date: moment.utc(dateEntry.date).tz(istTimezone).format("YYYY-MM-DD"),
                      slots: dateEntry.slots
                        ? dateEntry.slots.map((innerSlot) => ({
                            startTime: moment.utc(innerSlot.startTime, "HH:mm").tz(istTimezone).format("hh:mm A"),
                            endTime: moment.utc(innerSlot.endTime, "HH:mm").tz(istTimezone).format("hh:mm A"),
                            meeting_id: innerSlot.meeting_id || null,
                          }))
                        : [],
                    }))
                  : [],
              }))
            : [],
        }))
      : [];

    // Convert `blockedDates` from UTC to IST
    availability.blockedDates = availability.blockedDates
      ? availability.blockedDates.map((block) =>
          moment.utc(block.dates).tz(istTimezone).format("YYYY-MM-DD")
        )
      : [];

    // Convert `dateSpecific` times & dates from UTC to IST
    availability.dateSpecific = availability.dateSpecific
      ? availability.dateSpecific.map((dateEntry) => ({
          ...dateEntry,
          date: moment.utc(dateEntry.date).tz(istTimezone).format("YYYY-MM-DD"),
          slots: dateEntry.slots
            ? dateEntry.slots.map((slot) => ({
                startTime: moment.utc(slot.startTime, "HH:mm").tz(istTimezone).format("hh:mm A"),
                endTime: moment.utc(slot.endTime, "HH:mm").tz(istTimezone).format("hh:mm A"),
                isBooked: slot.isBooked,
                user_id: slot.user_id || null,
              }))
            : [],
        }))
      : [];

    // Return formatted data
    return res.status(200).json({
      success: true,
      message: `Availability of expert with id ${expert_id}`,
      availability,
    });
  } catch (error) {
    console.error("Error in getAvailabilitybyid:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


  
  export {
    saveAvailability,
    addAvailability,
    editAvailability,
    updateAvailability,
    viewAvailability,
    deleteAvailability,
    bookSlot,
    addBlockedDates,
    addSpecificDates,
    changeSettings,
    reschedulePolicy,
    changeTimezone,
    getAvailabilitybyid
  }
