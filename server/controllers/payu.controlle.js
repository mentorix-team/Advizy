import PaymentSession from "../config/model/transaction/PayuModel.js";
import mongoose from "mongoose";
import crypto from "crypto";
import axios from "axios"; // keep if you call other internal endpoints
import AppError from "../utils/AppError.js"; // keep for your error style

const {
  PAYU_KEY,
  PAYU_SALT,
  PAYU_ENV = "prod", // "test" -> test.payu.in, "prod" -> secure.payu.in
  BACKEND_URL = "http://localhost:5030", // must be publicly reachable in prod
  FRONTEND_URL = "http://localhost:5173",
} = process.env;

const PAYU_ACTION =
  PAYU_ENV === "test"
    ? "https://test.payu.in/_payment"
    : "https://secure.payu.in/_payment";

/** Build request hash for sending user to PayU.
 *  Hash = sha512(key|txnid|amount|productinfo|firstname|email|udf1|...|udf10|SALT)
 *  IMPORTANT: Use EXACT strings posted in the form (do NOT reformat amount).
 */
function buildRequestHash(data) {
  const seq = [
    data.key,
    data.txnid,
    data.amount,            // EXACT string you’ll post in the form
    data.productinfo,
    data.firstname,
    data.email,
    data.udf1 || "",
    data.udf2 || "",
    data.udf3 || "",
    data.udf4 || "",
    data.udf5 || "",
    data.udf6 || "",
    data.udf7 || "",
    data.udf8 || "",
    data.udf9 || "",
    data.udf10 || "",
    process.env.PAYU_SALT,
  ].join("|");

  const hash = crypto.createHash("sha512").update(seq).digest("hex");
  return { hash, seq };
}

/** Verify PayU response hash (reverse sequence). */
function verifyResponseHash(data) {
  // Extract all values directly from the response body
  const key = data.key || "";
  const txnid = data.txnid || "";
  const amount = data.amount || "";
  const productinfo = data.productinfo || "";
  const firstname = data.firstname || "";
  const email = data.email || "";
  const status = data.status || "";
  const udf1 = data.udf1 || "";
  const udf2 = data.udf2 || "";
  const udf3 = data.udf3 || "";
  const udf4 = data.udf4 || "";
  const udf5 = data.udf5 || "";
  const udf6 = data.udf6 || "";
  const udf7 = data.udf7 || "";
  const udf8 = data.udf8 || "";
  const udf9 = data.udf9 || "";
  const udf10 = data.udf10 || "";
  
  // Build the sequence in the correct order for response verification
  const seq = [
    process.env.PAYU_SALT,
    status,
    udf10,
    udf9,
    udf8,
    udf7,
    udf6,
    udf5,
    udf4,
    udf3,
    udf2,
    udf1,
    email,
    firstname,
    productinfo,
    amount,
    txnid,
    key
  ].join("|");
  
  console.log("PayU response seq:", seq);
  const calc = crypto.createHash("sha512").update(seq).digest("hex").toLowerCase();
  const receivedHash = String(data.hash || "").toLowerCase();
  
  console.log("Calculated hash:", calc);
  console.log("Received hash:", receivedHash);
  
  return calc === receivedHash;
}

/** helper: normalize time to HH:mm if ISO was sent */
function toHHmm(isoOrHHmm) {
  if (!isoOrHHmm) return "";
  if (!isoOrHHmm.includes("T")) return isoOrHHmm;
  const d = new Date(isoOrHHmm);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/** DB helper */
async function createPaymentSession(paymentData) {
  return PaymentSession.create({
    serviceId: String(paymentData.serviceId),
    expertId: new mongoose.Types.ObjectId(paymentData.expertId),
    userId: new mongoose.Types.ObjectId(paymentData.userId),
    sessionId: paymentData.sessionId,   // the one we also send in udf6 & udf10
    amount: paymentData.amount,         // number/string is fine; schema coerces to Number
    date: paymentData.date,
    startTime: paymentData.startTime,
    endTime: paymentData.endTime,
    message: paymentData.message,
    status: "pending",
    paymentGateway: "payu",
    // Store txnid too — either add a field in schema, or at least keep it in metaData
    payuTransactionId: paymentData.txnid,           // <— add this field to your schema if possible
    metaData: { ...(paymentData.metaData || {}), txnid: paymentData.txnid },
  });
}


/** ============ INITIATE PAYMENT: returns auto-submitting HTML form ============ */
export const payupay = async (req, res, next) => {
  try {
    if (!process.env.PAYU_KEY || !process.env.PAYU_SALT) {
      throw new Error("PayU credentials missing (PAYU_KEY/PAYU_SALT).");
    }

    const {
      txnid: clientTxnId,
      amount,
      firstname,
      email,
      phone,
      productinfo,
      serviceId,
      expertId,
      userId,
      date,
      startTime,
      endTime,
      message,
    } = req.body;

    if (!userId) throw new Error("User ID is required");
    if (amount === undefined || amount === null || amount === "") {
      throw new Error("Amount is required");
    }

    // Keep EXACT string for amount (same in hash and form)
    const amountString = String(amount);

    // Generate our IDs
    const sessionId = `SESSION_${Date.now()}`;
    const txnid = clientTxnId || `TXN${Date.now()}`;

    // Persist session BEFORE redirect
    await createPaymentSession({
      serviceId,
      expertId,
      userId,
      sessionId,
      txnid, // <-- save it
      amount: amountString,
      date,
      startTime: toHHmm(startTime),
      endTime: toHHmm(endTime),
      message,
    });

    // Build fields for PayU
    const payuData = {
      key: process.env.PAYU_KEY,
      txnid,
      amount: amountString,
      firstname: firstname || "",
      email: email || "",
      phone: phone || "",
      productinfo: productinfo || "Service Booking",

      // callbacks MUST be backend endpoints
      surl: `${BACKEND_URL}/api/v1/payu/success`,
      furl: `${BACKEND_URL}/api/v1/payu/failure`,

      // UDFs (send sessionId in BOTH 6 and 10 to be safe)
      udf1: serviceId || "",
      udf2: expertId || "",
      udf3: userId || "",
      udf4: date || "",
      udf5: message || "",
      udf6: sessionId,     // <— filled now
      udf7: "",
      udf8: "",
      udf9: "",
      udf10: sessionId,    // <— also filled

      service_provider: "payu_paisa",
    };

    const { hash, seq } = buildRequestHash(payuData);
    console.log("PayU request seq:", seq);
    console.log("PayU request hash:", hash);

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Redirecting to PayU…</title>
  <style>
    body { font-family: system-ui, Arial; display:flex; align-items:center; justify-content:center; height:100vh; margin:0; background:#f7fafc; }
    .box { text-align:center; }
  </style>
</head>
<body>
  <div class="box"><p>Redirecting to PayU… Please wait.</p></div>
  <form id="payuForm" action="${PAYU_ACTION}" method="post">
    <input type="hidden" name="key" value="${payuData.key}" />
    <input type="hidden" name="txnid" value="${payuData.txnid}" />
    <input type="hidden" name="amount" value="${payuData.amount}" />
    <input type="hidden" name="firstname" value="${payuData.firstname}" />
    <input type="hidden" name="email" value="${payuData.email}" />
    <input type="hidden" name="phone" value="${payuData.phone}" />
    <input type="hidden" name="productinfo" value="${payuData.productinfo}" />
    <input type="hidden" name="surl" value="${payuData.surl}" />
    <input type="hidden" name="furl" value="${payuData.furl}" />
    <input type="hidden" name="hash" value="${hash}" />
    <input type="hidden" name="service_provider" value="payu_paisa" />
    <input type="hidden" name="udf1" value="${payuData.udf1}" />
    <input type="hidden" name="udf2" value="${payuData.udf2}" />
    <input type="hidden" name="udf3" value="${payuData.udf3}" />
    <input type="hidden" name="udf4" value="${payuData.udf4}" />
    <input type="hidden" name="udf5" value="${payuData.udf5}" />
    <input type="hidden" name="udf6" value="${payuData.udf6}" />
    <input type="hidden" name="udf7" value="${payuData.udf7}" />
    <input type="hidden" name="udf8" value="${payuData.udf8}" />
    <input type="hidden" name="udf9" value="${payuData.udf9}" />
    <input type="hidden" name="udf10" value="${payuData.udf10}" />
  </form>
  <script>document.getElementById('payuForm').submit();</script>
</body>
</html>`;

    res.set("Content-Type", "text/html");
    return res.status(200).send(html);
  } catch (err) {
    console.error("PayU init error:", err);
    return next(err);
  }
};


export const success = async (req, res) => {
  console.log("Raw PayU success body:", req.body);
  console.log("Request method:", req.method);
  let sessionId; // for crash-safe logging
  
  try {
    const body = req.method === "GET" ? req.query : req.body;
    
    // Check if this is a PayU callback (has hash) or a frontend request (has token)
    if (body.hash) {
      // This is a PayU callback
      console.log("Processing PayU callback");
      
      // Log all UDF fields for debugging
      console.log("UDF fields:", {
        udf1: body.udf1,
        udf2: body.udf2,
        udf3: body.udf3,
        udf4: body.udf4,
        udf5: body.udf5,
        udf6: body.udf6,
        udf7: body.udf7,
        udf8: body.udf8,
        udf9: body.udf9,
        udf10: body.udf10
      });
      
      // 1) Verify hash first
      const ok = verifyResponseHash(body);
      if (!ok) {
        console.error("PayU hash verification failed");
        sessionId = body.udf10 || body.udf6 || "";
        return res.redirect(`${FRONTEND_URL}/payu-payment-failure?reason=hash&sessionId=${encodeURIComponent(sessionId)}`);
      }
      
      // 2) Resolve the sessionId robustly
      sessionId = body.udf10 || body.udf6 || ""; // preferred
      let sessionDoc = null;
      if (sessionId) {
        sessionDoc = await PaymentSession.findOne({ sessionId });
      }
      // If PayU didn't echo udf6/udf10, fall back to txnid lookup
      if (!sessionDoc && body.txnid) {
        sessionDoc =
          (await PaymentSession.findOne({ txnid: body.txnid })) ||
          (await PaymentSession.findOne({ "metaData.txnid": body.txnid }));
        if (sessionDoc) sessionId = sessionDoc.sessionId;
      }
      if (!sessionDoc) {
        console.error("PaymentSession not found. udf6:", body.udf6, "udf10:", body.udf10, "txnid:", body.txnid);
        return res.redirect(`${FRONTEND_URL}/payu-payment-failure?reason=session`);
      }
      
      // 3) Update session
      const payuMoneyId = body.payuMoneyId || body.mihpayid || "";
      sessionDoc.status = body.status === "success" ? "completed" : "failed";
      sessionDoc.payuTransactionId = payuMoneyId;
      // persist full payload for audits
      sessionDoc.metaData = { ...(sessionDoc.metaData || {}), ...body };
      await sessionDoc.save();
      
      // 4) Short-lived success token you can validate on frontend
      const successToken = crypto.randomBytes(16).toString("hex");
      await PaymentSession.updateOne(
        { sessionId: sessionDoc.sessionId },
        { successToken, processingCompleted: true, "metaData.successToken": successToken },
        { strict: false }
      );
      
      return res.redirect(
        `${FRONTEND_URL}/payu-payment-success?sessionId=${encodeURIComponent(
          sessionDoc.sessionId
        )}&token=${encodeURIComponent(successToken)}`
      );
    } else if (body.sessionId && body.token) {
      // This is a frontend request to verify the payment
      console.log("Processing frontend verification request");
      sessionId = body.sessionId;
      const token = body.token;
      
      // Find the session by sessionId and token
      const sessionDoc = await PaymentSession.findOne({ 
        sessionId, 
        successToken: token,
        processingCompleted: true
      });
      
      if (!sessionDoc) {
        console.error("Invalid session or token");
        return res.redirect(`${FRONTEND_URL}/payu-payment-failure?reason=invalid_token`);
      }
      
      // Return success response
      return res.status(200).json({ 
        success: true, 
        sessionId: sessionDoc.sessionId,
        status: sessionDoc.status
      });
    } else {
      // Unknown request format
      console.error("Unknown request format");
      return res.redirect(`${FRONTEND_URL}/payu-payment-failure?reason=invalid_request`);
    }
  } catch (err) {
    console.error("PayU success handler error:", err);
    if (sessionId) {
      await PaymentSession.updateOne(
        { sessionId },
        { status: "processing_failed", error: err?.message || "unknown" },
        { strict: false }
      );
    }
    return res.redirect(`${FRONTEND_URL}/payu-payment-failure`);
  }
};


/** ============ FAILURE CALLBACK from PayU (POST) ============ */
export const failure = async (req, res) => {
  try {
    const body = req.method === "GET" ? req.query : req.body;
    const sessionId = body.udf6;

    if (sessionId) {
      await PaymentSession.findOneAndUpdate(
        { sessionId },
        { status: "failed", metaData: { ...body } },
        { strict: false }
      );
    }
    return res.redirect(`${FRONTEND_URL}/payu-payment-failure`);
  } catch (err) {
    console.error("PayU failure handler error:", err);
    return res.redirect(`${FRONTEND_URL}/payu-payment-failure`);
  }
};

// Add to your controller file
export const verifyPayment = async (req, res) => {
  try {
    const { sessionId, token } = req.body;
    
    if (!sessionId || !token) {
      return res.status(400).json({ 
        success: false, 
        message: "Session ID and token are required" 
      });
    }
    
    // Find the session by sessionId and token
    const sessionDoc = await PaymentSession.findOne({ 
      sessionId, 
      successToken: token,
      processingCompleted: true
    });
    
    if (!sessionDoc) {
      return res.status(404).json({ 
        success: false, 
        message: "Invalid session or token" 
      });
    }
    
    // Return success response
    return res.status(200).json({ 
      success: true, 
      sessionId: sessionDoc.sessionId,
      status: sessionDoc.status,
      paymentDetails: {
        amount: sessionDoc.amount,
        date: sessionDoc.date,
        startTime: sessionDoc.startTime,
        endTime: sessionDoc.endTime
      }
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    return res.status(500).json({ 
      success: false, 
      message: "Payment verification failed" 
    });
  }
};