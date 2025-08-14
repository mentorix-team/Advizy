// routes/payu.route.js
import { Router } from "express";
import { payupay, success, failure, verifyPayment } from "../controllers/payu.controlle.js";

const router = Router();

router.post("/pay", payupay);      // start payment
router.post("/success", success);  // PayU will hit this
router.post("/failure", failure);  // PayU will hit this

router.post("/verify", verifyPayment); // Frontend will hit this to verify payment

// Optional GET for manual browser testing
router.get("/success", success);
router.get("/failure", failure);

export default router;
