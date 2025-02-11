import React from "react";
import { useDispatch } from "react-redux";
import SettingsField from "./SettingsField";
import SettingsSelect from "./SettingsSelect";
import TimezoneDropdown from "./TimezoneDropdown";
import { CalendarIcon, TimezoneIcon } from "@/icons/Icons";
import ReschedulePolicy from "./ReschedulePolicy";
import "./Settings.css";
import { setSettings } from "@/Redux/Slices/availability.slice";

const BOOKING_PERIOD_OPTIONS = [
  { value: 2, label: "1 Month" },
  { value: 1, label: "15 days" },
  { value: 3, label: "2 Months" },
  { value: 4, label: "3 Months" },
  { value: "15 days", label: "15 days" },
  { value: "1 Month", label: "1 Month" },
  { value: "2 Months", label: "2 Months" },
  { value: "3 Months", label: "3 Months" },
];

function SettingsPanel() {
  const [bookingPeriod, setBookingPeriod] = React.useState("1 Month");
  const dispatch = useDispatch();

  const handleBookingPeriodChange = (value) => {
    setBookingPeriod(value);

    // Dispatch the settings update
    dispatch(
      setSettings({
        bookingperiod: value,
      })
    );
  };

  return (
    <div className="bg-white max-w-[700px] w-full rounded-lg shadow-md p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
      <div className="space-y-8">
        {/* Timezone Setting */}
        <SettingsField
          labelIcon={<TimezoneIcon className="w-5 h-5 text-gray-500" />}
          label="Time Zone"
          description="Required for timely communication"
        >
          <TimezoneDropdown />
        </SettingsField>

        {/* Booking Period Setting */}
        <SettingsField
          labelIcon={<CalendarIcon className="w-5 h-5 text-gray-500" />}
          label="Booking Period"
          description="How far in the future can attendees book"
        >
          <SettingsSelect
            value={bookingPeriod}
            onChange={handleBookingPeriodChange}
            options={BOOKING_PERIOD_OPTIONS}
          />
        </SettingsField>

        {/* Reschedule Policy Setting */}
        <SettingsField
          labelIcon={<CalendarIcon className="w-5 h-5 text-gray-500" />}
          label="Reschedule Policy"
          description="How can customers reschedule calls"
        >
          <ReschedulePolicy />
        </SettingsField>
      </div>
    </div>
  );
}

export default SettingsPanel;
