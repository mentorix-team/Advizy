import React, { useEffect, useState } from "react";
import Joyride from 'react-joyride';
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
  const [activeTab, setActiveTab] = useState('schedule');
  const [runTour, setRunTour] = useState(true);

  const steps = [
    {
      target: '#save-changes-button',
      content: "Once you've set your weekly availability, don't forget to click 'Save Changes' so others can see your next available slot.",
      disableBeacon: true,
      placement: 'top',
    },
    {
      target: '#settings-tab',
      content: "Set important preferences like your booking period, reschedule policy, and time zone to ensure smooth scheduling and timely communication.",
      placement: 'bottom',
    },
  ];

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
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showSkipButton
        scrollToFirstStep
        disableOverlayClose
        disableCloseOnEsc
        showProgress
        styles={{
          options: {
            primaryColor: '#10B981',
            zIndex: 1000,
          },
          tooltip: {
            fontSize: '14px',
          },
          buttonNext: {
            backgroundColor: '#10B981',
          },
          buttonBack: {
            marginRight: 10,
          },
        }}
        locale={{
          last: 'Done',
          skip: 'Skip tour'
        }}
        callback={(data) => {
          const { status } = data;
          if (status === 'finished' || status === 'skipped') {
            setRunTour(false);
          }
        }}
      />
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