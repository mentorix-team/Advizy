import {Router} from "express"
import { isExpert, isLoggedIn } from "../middlewares/auth.middleare.js"
import { addAvailability, addBlockedDates, addSpecificDates, bookSlot, changeSettings, changeTimezone, deleteAvailability, editAvailability, getAvailabilitybyid, removeBlockedDates, reschedulePolicy, saveAvailability, updateAvailability, viewAvailability } from "../controllers/calendar.controller.js"

const router = Router()

router.post('/add',isLoggedIn,isExpert,addAvailability)
router.post('/edit',isLoggedIn,isExpert,editAvailability)
router.post('/save',isLoggedIn,isExpert,saveAvailability)
router.post('/addblockeddates',isLoggedIn,isExpert,addBlockedDates)
router.post('/removeblockeddates',isLoggedIn,isExpert,removeBlockedDates)
router.post('/addspecificdates',isLoggedIn,isExpert,addSpecificDates)
router.put('/update',isLoggedIn,isExpert,updateAvailability)
router.delete('/delete',isLoggedIn,isExpert,deleteAvailability)
router.get('/view',isLoggedIn,isExpert,viewAvailability)
router.post('/book',isLoggedIn,bookSlot)
router.post('/set',isLoggedIn,isExpert,changeSettings)
router.post('/setpolicy',isLoggedIn,isExpert,reschedulePolicy)
router.post('/settimezone',isLoggedIn,isExpert,changeTimezone)
router.get('/get/:id',getAvailabilitybyid)
export default router;