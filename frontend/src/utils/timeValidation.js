// export const timeToMinutes = (time) => {
//     const [hours, minutes] = time.split(":").map(Number);
//     return hours * 60 + minutes;
//   };
  
//   export function validateTimeSlot(start, end) {
//     if (!start || !end) {
//       return "Both start and end times must be selected.";
//     }
  
//     const startTime = new Date(`1970-01-01T${convertTo24Hour(start)}`);
//     const endTime = new Date(`1970-01-01T${convertTo24Hour(end)}`);
  
//     if (startTime >= endTime) {
//       return "End time must be after start time.";
//     }
//     return null;
//   }
  
//   export function checkOverlap(slots) {
//     const validSlots = slots.filter((slot) => slot.start && slot.end);
  
//     const parsedSlots = validSlots.map((slot) => ({
//       start: new Date(`1970-01-01T${convertTo24Hour(slot.start)}`),
//       end: new Date(`1970-01-01T${convertTo24Hour(slot.end)}`),
//     }));
  
//     parsedSlots.sort((a, b) => a.start - b.start);
  
//     for (let i = 0; i < parsedSlots.length - 1; i++) {
//       if (parsedSlots[i].end > parsedSlots[i + 1].start) {
//         return "Time slots cannot overlap.";
//       }
//     }
//     return null;
//   }
  
//   export function convertTo24Hour(time) {
//     const [timePart, modifier] = time.split(" ");
//     let [hours, minutes] = timePart.split(":").map(Number);
  
//     if (modifier === "PM" && hours !== 12) {
//       hours += 12;
//     } else if (modifier === "AM" && hours === 12) {
//       hours = 0;
//     }
  
//     return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
//   }
  
export const timeToMinutes = (time) => {
  const [timePart, modifier] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  // Convert to 24-hour format
  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  } else if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes;
};

export function validateTimeSlot(start, end) {
  if (!start || !end) {
    return "Both start and end times must be selected.";
  }

  const startTime = timeToMinutes(start);
  const endTime = timeToMinutes(end);

  // Handle the case where the end time is on the next day (e.g., 11:30 PM to 12:00 AM)
  if (startTime >= endTime) {
    // If the end time is less than the start time, it means the end time is on the next day
    // For example, 11:30 PM (23:30) to 12:00 AM (00:00)
    // In this case, the end time is valid because it's on the next day
    // So, we add 24 hours (1440 minutes) to the end time to make it comparable
    const adjustedEndTime = endTime + 1440;

    if (startTime >= adjustedEndTime) {
      return "End time must be after start time.";
    }
  }

  return null;
}

export function checkOverlap(slots) {
  const validSlots = slots.filter((slot) => slot.start && slot.end);

  const parsedSlots = validSlots.map((slot) => ({
    start: timeToMinutes(slot.start),
    end: timeToMinutes(slot.end),
  }));

  // Sort slots by start time
  parsedSlots.sort((a, b) => a.start - b.start);

  for (let i = 0; i < parsedSlots.length - 1; i++) {
    const currentSlot = parsedSlots[i];
    const nextSlot = parsedSlots[i + 1];

    // Handle overlapping slots, including those that span midnight
    if (
      currentSlot.end > nextSlot.start ||
      (currentSlot.end < currentSlot.start && nextSlot.start < currentSlot.end)
    ) {
      return "Time slots cannot overlap.";
    }
  }

  return null;
}