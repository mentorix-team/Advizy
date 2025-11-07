import Router from 'express'
import { isExpert, isLoggedIn, isMeeting } from '../middlewares/auth.middleare.js';
import { addVideoParticipants, checkPresetExists, createMeetingToken, createPresetForHost, createVideocall, fetchActiveSession, getBookedSlots, getClientDetails, getFeedbackbyexpertId, getMeetingByExpertId, getMeetingById, getMeetingByUserId, getNotifications, getmeet, getthemeet, giveFeedback, kickAllparticipant, payedForMeeting, rescheduleMeetingExpert, sendMeetingReminders, sendSingleMeetingReminder, updateMeeting, updateMeetingDirectly, updateMeetingStatus, verifyRescheduleToken } from '../controllers/meeting.controller.js';
const router = Router()

router.post('/meet', isLoggedIn, createMeetingToken)
router.get('/meet', isLoggedIn, isMeeting, getMeetingById)
router.get('/getmeetingbyid/:id', isLoggedIn, (req, res, next) => {
  // Set the meeting ID in req.meeting for getMeetingById
  req.meeting = { id: req.params.id };
  next();
}, getMeetingById)
router.get('/meetbyuser', isLoggedIn, getMeetingByUserId)
router.get('/meetbyexpert', isLoggedIn, isExpert, getMeetingByExpertId)
router.post('/payedformeeting', isLoggedIn, isMeeting, payedForMeeting)
router.get('/getnotified', isLoggedIn, isExpert, getNotifications)
router.post('/createVideoCall', isLoggedIn, isMeeting, createVideocall)
router.patch('/updatemeeting', isLoggedIn, updateMeetingStatus)
router.get('/fetchActiveSession/:meetingId', fetchActiveSession)
router.post('/addvideoparticipant', isLoggedIn, addVideoParticipants)
router.post('/createpresetHOST', isLoggedIn, createPresetForHost)
router.post('/checkpresetExists', isLoggedIn, checkPresetExists)

router.post('/kickParticipants', kickAllparticipant)
router.post('/rescheduleByExpert', isLoggedIn, isExpert, rescheduleMeetingExpert)
router.post('/updatemeet', isLoggedIn, updateMeeting)
router.post('/updatemeetdirectly', isLoggedIn, updateMeetingDirectly)

router.post('/verifyrescheduleToken', isLoggedIn, verifyRescheduleToken)

router.post('/getclientdetails', isLoggedIn, isExpert, getClientDetails)
router.post('/givefeedback', giveFeedback)
// Make feedback fetch public so Home page can read ratings without requiring login
router.post('/getfeedbackbyexpertid', getFeedbackbyexpertId)
router.post('/getthemeet', getthemeet)
router.get('/booked-slots', getBookedSlots)

// Meeting reminder routes
router.post('/send-reminders', sendMeetingReminders) // For automated cron job
router.post('/send-single-reminder', isLoggedIn, sendSingleMeetingReminder) // For manual trigger

export default router;  