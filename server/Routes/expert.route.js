import Router from 'express'
import { isExpert, isLoggedIn } from '../middlewares/auth.middleare.js'
import manageService, {  createService, deleteService, expertBasicDetails, expertCredentialsDetails, expertEducation, expertPaymentDetails, expertcertifiicate, expertexperience, extpertPortfolioDetails, generateOtpForVerifying, getAllExperts, getExpertById, getExpertByRedirectURL, getExpertServices, getService, pushExpertsToAlgolia, singleexperteducation, updateProfileStatus, updateService, validatethnumberormobile } from '../controllers/expert.controller.js'
import upload from '../middlewares/multer.middleware.js'
const router= Router()

router.post('/basic-details',isLoggedIn,upload.fields([{name:'profileImage',maxCount:1},{name:'coverImage',maxCount:1}]),expertBasicDetails)
router.post("/credentials-details", isLoggedIn, isExpert, expertCredentialsDetails);
router.post('/portfolio-details',isLoggedIn,upload.single('photo'),isExpert,extpertPortfolioDetails)
router.post('/expertCertificate',isLoggedIn,upload.single('certificate'),isExpert,expertcertifiicate)
router.post('/expertExperience',upload.single('document'),isLoggedIn,isExpert,expertexperience)
router.post('/expertPayment',isLoggedIn,isExpert,expertPaymentDetails)
router.post('/expertEducation',upload.single('certificate'),isLoggedIn,isExpert,expertEducation)
router.post('/singleexpertEducation',upload.single('certificate'),isLoggedIn,isExpert,singleexperteducation)
router.post('/updateExpertDetails',isLoggedIn,isExpert,updateProfileStatus)
router.get('/getexperts',getAllExperts)
router.get('/getServices',isLoggedIn,isExpert,getExpertServices)
router.get('/getexpert/:id',getExpertById)
router.get('/getexpert/by-url/:redirect_url', getExpertByRedirectURL);
router.post('/createservice',isLoggedIn,isExpert,manageService)
router.post('/service',isLoggedIn,isExpert,createService)
router.post('/updateService',isLoggedIn,isExpert,updateService)
router.post("/deleteService", isExpert,isLoggedIn, deleteService);
router.post('/service/:serviceId', isLoggedIn, getService);
router.get('/sync-algolia', pushExpertsToAlgolia);
router.post('/generateotpforvalidating',generateOtpForVerifying)
router.post('/verifyingotpgot',validatethnumberormobile)
export default router;