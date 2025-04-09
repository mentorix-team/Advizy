

import Router from "express";
import { isExpert, isLoggedIn } from "../middlewares/auth.middleare.js";
import manageService, {
  adminapproved,
  createService,
  deleteExpertCertificate,
  deleteExpertEducation,
  deleteExpertExperience,
  deleteService,
  editExpertCertificate,
  editExpertExperience,
  editSingleExpertEducation,
  expertBasicDetails,
  expertCredentialsDetails,
  expertEducation,
  expertImages,
  expertPaymentDetails,
  expertcertifiicate,
  expertexperience,
  extpertPortfolioDetails,
  generateOtpForVerifying,
  getAllExperts,
  getAllExpertswithoutfilter,
  getExpert,
  getExpertById,
  getExpertByRedirectURL,
  getExpertServices,
  getService,
  handleSuspendExpert,
  pushExpertsToAlgolia,
  singleexperteducation,
  updateProfileStatus,
  updateService,
  validatethnumberormobile,
} from "../controllers/expert.controller.js";
import upload from "../middlewares/multer.middleware.js";
import { verifyInternalToken } from "../middlewares/admin.middleware.js";
const router = Router();

router.get("/getmeasexpert", isLoggedIn, getExpert);

router.post(
  "/basic-details",
  isLoggedIn,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  expertBasicDetails
);
router.post(
  "/basic-image-details",
  isLoggedIn,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  expertImages
);

router.post(
  "/credentials-details",
  isLoggedIn,
  isExpert,
  expertCredentialsDetails
);

router.post(
  "/portfolio-details",
  isLoggedIn,
  upload.single("photo"),
  isExpert,
  extpertPortfolioDetails
);

router.post(
  "/expertCertificate",
  isLoggedIn,
  upload.single("certificate"),
  isExpert,
  expertcertifiicate
);
router.post(
  "/editExpertCerti",
  isLoggedIn,
  upload.single("certificate"),
  isExpert,
  editExpertCertificate
);
router.post(
  "/deleteExpertCerti",
  isLoggedIn,
  isExpert,
  deleteExpertCertificate
);

router.post(
  "/expertExperience",
  upload.single("document"),
  isLoggedIn,
  isExpert,
  expertexperience
);
router.post(
  "/editExpertExperience",
  upload.single("document"),
  isLoggedIn,
  isExpert,
  editExpertExperience
);
router.post(
  "/deleteExpertExperience",
  isLoggedIn,
  isExpert,
  deleteExpertExperience
);

router.post("/expertPayment", isLoggedIn, isExpert, expertPaymentDetails);

router.post(
  "/expertEducation",
  upload.single("certificate"),
  isLoggedIn,
  isExpert,
  expertEducation
);
router.post(
  "/singleexpertEducation",
  upload.single("certificate"),
  isLoggedIn,
  isExpert,
  singleexperteducation
);
router.post(
  "/editExpertEducation",
  upload.single("certificate"),
  isLoggedIn,
  isExpert,
  editSingleExpertEducation
);
router.post(
  "/deleteExpertEducation",
  isLoggedIn,
  isExpert,
  deleteExpertEducation
);

router.post('/adminapproved',adminapproved)
router.post("/updateExpertDetails", isLoggedIn, isExpert, updateProfileStatus);
router.get("/getexperts", getAllExperts);
router.get("/getServices", isExpert, getExpertServices);
router.get("/getexpert/:id", getExpertById);
router.get("/getexpert/by-url/:redirect_url", getExpertByRedirectURL);
router.post("/createservice", isLoggedIn, isExpert, manageService);
router.post("/service", isLoggedIn, isExpert, createService);
router.post("/updateService", isLoggedIn, isExpert, updateService);
router.post("/deleteService", isExpert, isLoggedIn, deleteService);
router.post("/service/:serviceId", getService);
router.get("/sync-algolia", pushExpertsToAlgolia);
router.post("/generateotpforvalidating", generateOtpForVerifying);
router.post("/verifyingotpgot", validatethnumberormobile);
router.get("/getAllthefkexperts",getAllExpertswithoutfilter)
router.post('handlesuspend',handleSuspendExpert)
export default router;
