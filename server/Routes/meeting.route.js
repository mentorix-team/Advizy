import Router from 'express'
import { isExpert, isLoggedIn, isMeeting } from '../middlewares/auth.middleare.js';
import { addVideoParticipants, checkPresetExists, createMeetingToken, createPresetForHost, createVideocall, fetchActiveSession, getClientDetails, getMeetingByExpertId, getMeetingById, getMeetingByUserId, getNotifications, payedForMeeting, rescheduleMeetingExpert, updateMeeting, updateMeetingStatus, verifyRescheduleToken } from '../controllers/meeting.controller.js';
const router = Router()

router.post('/meet',isLoggedIn,createMeetingToken)
router.get('/meet',isLoggedIn,isMeeting,getMeetingById)
router.get('/meetbyuser',isLoggedIn,getMeetingByUserId)
router.get('/meetbyexpert',isLoggedIn,isExpert,getMeetingByExpertId)
router.post('/payedformeeting',isLoggedIn,isMeeting,payedForMeeting)
router.get('/getnotified',isLoggedIn,isExpert,getNotifications)
router.post('/createVideoCall',isLoggedIn,isMeeting,createVideocall)
router.patch('/updatemeeting',isLoggedIn,updateMeetingStatus)
router.get('/fetchActiveSession/:meetingId',isLoggedIn,fetchActiveSession)
router.post('/addvideoparticipant',isLoggedIn,addVideoParticipants)
router.post('/createpresetHOST',isLoggedIn,createPresetForHost)
router.post('/checkpresetExists',isLoggedIn,checkPresetExists)

router.post('/rescheduleByExpert',isLoggedIn,isExpert,rescheduleMeetingExpert)
router.post('/updatemeet',isLoggedIn,updateMeeting)
router.post('/verifyrescheduleToken',isLoggedIn,verifyRescheduleToken)

router.post('/getclientdetails',isLoggedIn,isExpert,getClientDetails)
export default router;