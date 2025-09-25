import PaymentSession from "../config/model/transaction/PayuModel.js";
import mongoose from "mongoose";
import crypto from "crypto";
import axios from "axios";
import AppError from "../utils/AppError.js";

const {
  PAYU_KEY,
  PAYU_SALT,
  PAYU_ENV = "prod",
  BACKEND_URL = "http://localhost:5030",
  FRONTEND_URL = "http://localhost:5173",
} = process.env;

const PAYU_ACTION =
  PAYU_ENV === "test"
    ? "https://test.payu.in/_payment"
    : "https://secure.payu.in/_payment";

function generatePayUHash(data) {
  const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo
    }|${data.firstname}|${data.email}|${data.udf1 || ""}|${data.udf2 || ""}|${data.udf3 || ""
    }|${data.udf4 || ""}|${data.udf5 || ""}|${data.udf6 || ""
    }|||||ihteCewpIbsofU10x6dc8F8gYJOnL2hz`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
}

function buildRequestHash(data) {
  const seq = [
    data.key,
    data.txnid,
    data.amount,
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

function verifyResponseHash(data) {
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

function toHHmm(isoOrHHmm) {
  if (!isoOrHHmm) return "";
  if (!isoOrHHmm.includes("T")) return isoOrHHmm;
  const d = new Date(isoOrHHmm);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

async function createPaymentSession(paymentData) {
  return PaymentSession.create({
    serviceId: String(paymentData.serviceId),
    expertId: new mongoose.Types.ObjectId(paymentData.expertId),
    userId: new mongoose.Types.ObjectId(paymentData.userId),
    sessionId: paymentData.sessionId,
    amount: paymentData.amount,
    date: paymentData.date,
    startTime: paymentData.startTime,
    endTime: paymentData.endTime,
    message: paymentData.message,
    status: "pending",
    paymentGateway: "payu",
    payuTransactionId: paymentData.txnid,
    metaData: { ...(paymentData.metaData || {}), txnid: paymentData.txnid },
  });
}

export const verifyPayUPayment = async (response) => {
  const payuReturnedHash = response.hash;
  const hashString = `${response.key}|${response.txnid}|${response.amount}|${response.productinfo}|${response.firstname}|${response.email}|||||||||||ihteCewpIbsofU10x6dc8F8gYJOnL2hz`;
  const calculatedHash = crypto.createHash("sha512").update(hashString).digest("hex");
  return calculatedHash === payuReturnedHash;
};

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

    const amountString = String(amount);
    const sessionId = `SESSION_${Date.now()}`;
    const txnid = clientTxnId || `TXN${Date.now()}`;

    await createPaymentSession({
      serviceId,
      expertId,
      userId,
      sessionId,
      txnid,
      amount: amountString,
      date,
      startTime: toHHmm(startTime),
      endTime: toHHmm(endTime),
      message,
    });

    const payuData = {
      key: process.env.PAYU_KEY,
      txnid,
      amount: amountString,
      firstname: firstname || "",
      email: email || "",
      phone: phone || "",
      productinfo: productinfo || "Service Booking",
      surl: `${BACKEND_URL}/api/v1/payu/success`,
      furl: `${BACKEND_URL}/api/v1/payu/failure`,
      udf1: serviceId || "",
      udf2: expertId || "",
      udf3: userId || "",
      udf4: date || "",
      udf5: message || "",
      udf6: sessionId,
      udf7: "",
      udf8: "",
      udf9: "",
      udf10: sessionId,
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
  let sessionId;

  try {
    const body = req.method === "GET" ? req.query : req.body;

    if (body.hash) {
      console.log("Processing PayU callback");
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

      const ok = verifyResponseHash(body);
      if (!ok) {
        console.error("PayU hash verification failed");
        sessionId = body.udf10 || body.udf6 || "";
        return res.redirect(`${FRONTEND_URL}/payu-payment-failure?reason=hash&sessionId=${encodeURIComponent(sessionId)}`);
      }

      sessionId = body.udf10 || body.udf6 || "";
      let sessionDoc = null;
      if (sessionId) {
        sessionDoc = await PaymentSession.findOne({ sessionId });
      }
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

      const payuMoneyId = body.payuMoneyId || body.mihpayid || "";
      sessionDoc.status = body.status === "success" ? "completed" : "failed";
      sessionDoc.payuTransactionId = payuMoneyId;
      sessionDoc.metaData = { ...(sessionDoc.metaData || {}), ...body };
      await sessionDoc.save();

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
      console.log("Processing frontend verification request");
      sessionId = body.sessionId;
      const token = body.token;

      const sessionDoc = await PaymentSession.findOne({
        sessionId,
        successToken: token,
        processingCompleted: true
      });

      if (!sessionDoc) {
        console.error("Invalid session or token");
        return res.redirect(`${FRONTEND_URL}/payu-payment-failure?reason=invalid_token`);
      }

      return res.status(200).json({
        success: true,
        sessionId: sessionDoc.sessionId,
        status: sessionDoc.status
      });
    } else {
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

export const verifyPayment = async (req, res) => {
  try {
    const { sessionId, token } = req.body;

    if (!sessionId || !token) {
      return res.status(400).json({
        success: false,
        message: "Session ID and token are required"
      });
    }

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