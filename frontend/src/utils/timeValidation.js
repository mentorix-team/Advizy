export const timeToMinutes = (time) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };
  
  export function validateTimeSlot(start, end) {
    if (!start || !end) {
      return "Both start and end times must be selected.";
    }
  
    const startTime = new Date(`1970-01-01T${convertTo24Hour(start)}`);
    const endTime = new Date(`1970-01-01T${convertTo24Hour(end)}`);
  
    if (startTime >= endTime) {
      return "End time must be after start time.";
    }
    return null;
  }
  
  export function checkOverlap(slots) {
    const validSlots = slots.filter((slot) => slot.start && slot.end);
  
    const parsedSlots = validSlots.map((slot) => ({
      start: new Date(`1970-01-01T${convertTo24Hour(slot.start)}`),
      end: new Date(`1970-01-01T${convertTo24Hour(slot.end)}`),
    }));
  
    parsedSlots.sort((a, b) => a.start - b.start);
  
    for (let i = 0; i < parsedSlots.length - 1; i++) {
      if (parsedSlots[i].end > parsedSlots[i + 1].start) {
        return "Time slots cannot overlap.";
      }
    }
    return null;
  }
  
  export function convertTo24Hour(time) {
    const [timePart, modifier] = time.split(" ");
    let [hours, minutes] = timePart.split(":").map(Number);
  
    if (modifier === "PM" && hours !== 12) {
      hours += 12;
    } else if (modifier === "AM" && hours === 12) {
      hours = 0;
    }
  
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  }