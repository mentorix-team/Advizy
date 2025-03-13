import React, { useState, useEffect } from "react";
import Select from "react-timezone-select";
import { useDispatch } from "react-redux";
import { setTimezone } from "@/Redux/Slices/availability.slice";

function TimezoneDropdown() {
  const dispatch = useDispatch();

  const [selectedTimezone, setSelectedTimezone] = useState(() => {
    // Detect the user's browser timezone
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  });

  useEffect(() => {
    if (selectedTimezone) {
      // Dispatch action to update timezone in the backend
      dispatch(setTimezone({ timezone: selectedTimezone }));
    }
  }, [selectedTimezone, dispatch]);

  return (
    <Select
      value={selectedTimezone}
      onChange={setSelectedTimezone}
      className="w-64"
    />
  );
}

export default TimezoneDropdown;
