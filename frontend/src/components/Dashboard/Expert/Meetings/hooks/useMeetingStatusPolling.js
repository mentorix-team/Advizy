// hooks/useMeetingStatusPolling.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAndUpdateMeetingStatus } from '@/Redux/Slices/meetingSlice';

export const useMeetingStatusPolling = (interval = 60000, immediate = true) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Initial check if immediate is true
    if (immediate) {
      dispatch(checkAndUpdateMeetingStatus());
    }

    // Set up interval
    const intervalId = setInterval(() => {
      dispatch(checkAndUpdateMeetingStatus());
    }, interval);

    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [dispatch, interval]);
};