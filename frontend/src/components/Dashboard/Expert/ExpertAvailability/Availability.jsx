import React, { useEffect, useState } from "react";
import TabNavigation from "./TabNavigation";
import WeeklyAvailability from "./WeeklyAvailability";
import BlockUnavailableDates from "./BlockUnavailableDates";
import DateSpecificHours from "./DateSpecificHours";
import SettingsPanel from "./settings/SettingsPanel";
import { BlockedDatesProvider } from "@/Context/BlockedDatesContext";
import { useDispatch, useSelector } from "react-redux";
import { viewAvailability } from "@/Redux/Slices/availability.slice";
import AvailabilitySkeleton from "@/components/LoadingSkeleton/AvailabilitySkeleton";

function Availability() {
  const dispatch = useDispatch();
  const { availability, loading, error } = useSelector((state) => state.availability);
  console.log("THis is availability",availability)
  const [activeTab, setActiveTab] = useState('schedule');

  useEffect(() => {
    dispatch(viewAvailability());
  }, [dispatch]);

  if (loading) {
    return <AvailabilitySkeleton />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <BlockedDatesProvider>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
          {activeTab === 'schedule' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 rounded-lg">
                <WeeklyAvailability />
              </div>
              <div className="space-y-6">
                <BlockUnavailableDates />
                <DateSpecificHours />
              </div>
            </div>
          ) : (
            <SettingsPanel />
          )}
        </div>
      </div>
    </BlockedDatesProvider>
  );
}

export default Availability;
