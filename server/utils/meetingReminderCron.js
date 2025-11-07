// Meeting Reminder Cron Job Setup
// This file contains the cron job configuration to automatically send meeting reminders

import cron from 'node-cron';
import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5030';

// Schedule to run every minute to check for meetings starting in 15 minutes
const scheduleMeetingReminders = () => {
  console.log('📅 Meeting reminder cron job initialized');

  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      console.log('🔍 Checking for upcoming meetings...');

      // Call the meeting reminder endpoint
      const response = await axios.post(`${BACKEND_URL}/api/v1/meeting/send-reminders`);

      if (response.data.success) {
        console.log(`✅ Processed ${response.data.processed} meetings for reminders`);
      }
    } catch (error) {
      console.error('❌ Error in meeting reminder cron job:', error.message);
    }
  });

  console.log('⏰ Cron job scheduled to run every minute');
};

// Alternative: Run every 15 minutes (more conservative approach)
const scheduleMeetingRemindersEvery15Min = () => {
  console.log('📅 Meeting reminder cron job initialized (15-minute intervals)');

  // Run every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    try {
      console.log('🔍 Checking for upcoming meetings (15-min check)...');

      const response = await axios.post(`${BACKEND_URL}/api/v1/meeting/send-reminders`);

      if (response.data.success) {
        console.log(`✅ Processed ${response.data.processed} meetings for reminders`);
      }
    } catch (error) {
      console.error('❌ Error in meeting reminder cron job:', error.message);
    }
  });

  console.log('⏰ Cron job scheduled to run every 15 minutes');
};

// Manual trigger function for testing
const sendTestReminder = async (meetingId) => {
  try {
    const response = await axios.post(`${BACKEND_URL}/api/v1/meeting/send-single-reminder`, {
      meetingId: meetingId
    });

    if (response.data.success) {
      console.log('✅ Test reminder sent successfully');
      return response.data;
    }
  } catch (error) {
    console.error('❌ Error sending test reminder:', error.message);
    throw error;
  }
};

export {
  scheduleMeetingReminders,
  scheduleMeetingRemindersEvery15Min,
  sendTestReminder
};

// USAGE INSTRUCTIONS:
//
// 1. Install node-cron: npm install node-cron
// 2. In server.js add: import { scheduleMeetingReminders } from './utils/meetingReminderCron.js';
// 3. Start cron job: scheduleMeetingReminders();
// 4. Test manually: sendTestReminder('meetingId');
//
// Cron formats: '* * * * *' = every minute, '*/15 * * * *' = every 15 minutes