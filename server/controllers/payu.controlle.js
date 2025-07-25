import PaymentSession from "../config/model/transaction/PayuModel.js";
import mongoose from "mongoose";
import crypto from "crypto";

function generatePayUHash(data) {
  const hashString = `${data.key}|${data.txnid}|${data.amount}|${
    data.productinfo
  }|${data.firstname}|${data.email}|${data.udf1 || ""}|${data.udf2 || ""}|${
    data.udf3 || ""
  }|${data.udf4 || ""}|${data.udf5 || ""}|${
    data.udf6 || ""
  }|||||ihteCewpIbsofU10x6dc8F8gYJOnL2hz`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
}

export const createPaymentSession = async (paymentData) => {
  try {
    const session = await PaymentSession.create({
      serviceId: paymentData.serviceId,
      expertId: paymentData.expertId,
      userId: paymentData.userId, // Now included
      sessionId: paymentData.sessionId, // Now included
      amount: paymentData.amount,
      date: paymentData.date,
      startTime: paymentData.startTime,
      endTime: paymentData.endTime,
      message: paymentData.message,
      status: paymentData.status || "pending",
      paymentGateway: "payu",
      metaData: paymentData.metaData || {}, // Default empty object
    });

    return session;
  } catch (error) {
    console.error("Error creating payment session:", error);
    throw error;
  }
};
export const verifyPayUPayment = async (response) => {
  const payuReturnedHash = response.hash;
  const hashString = `${response.key}|${response.txnid}|${response.amount}|${response.productinfo}|${response.firstname}|${response.email}|||||||||||ihteCewpIbsofU10x6dc8F8gYJOnL2hz`;
  const calculatedHash = crypto.createHash("sha512").update(hashString).digest("hex");
  return calculatedHash === payuReturnedHash;
};


const payupay = async (req, res, next) => {
  try {
    const {
      txnid,
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

    if (!userId) {
      throw new Error("User ID is required");
    }

    const serviceIdToUse = mongoose.Types.ObjectId.isValid(serviceId)
      ? new mongoose.Types.ObjectId(serviceId)
      : serviceId;

    const formatTimeString = (isoString) => {
      if (!isoString.includes("T")) return isoString;
      const date = new Date(isoString);
      return `${date.getHours().toString().padStart(2, "0")}:${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;
    };

    const sessionId = `SESSION_${Date.now()}`;

    const paymentSession = await createPaymentSession({
      serviceId: serviceIdToUse,
      expertId: new mongoose.Types.ObjectId(expertId),
      userId: new mongoose.Types.ObjectId(userId),
      sessionId,
      amount,
      date,
      startTime: formatTimeString(startTime),
      endTime: formatTimeString(endTime),
      message,
      status: "pending",
    });

    const payuData = {
      key: "BbfPbe",
      txnid: txnid || `TXN${Date.now()}`,
      amount,
      firstname,
      email,
      phone,
      productinfo,
      surl: `https://www.advizy.in/payu-payment-success`,
      furl: `https://www.advizy.in/payu-payment-failure`,
      // furl: `https://advizy.onrender.com/api/v1/payu/failure`,
      service_provider: "payu_paisa",
      udf1: serviceId,
      udf2: expertId,
      udf3: userId,
      udf4: date,
      udf5: message || "",
      udf6: sessionId, // ✅ Added sessionId here
    };

    const hash = generatePayUHash(payuData);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Redirecting to PayU...</title>
        <style>
          body { font-family: Arial; display: flex; justify-content: center; align-items: center; height: 100vh; background: #f5f5f5; }
          .loader { border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 2s linear infinite; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="loader"></div>
        <form id="payuForm" action="https://secure.payu.in/_payment" method="post">
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
          <input type="hidden" name="udf6" value="${payuData.udf6}" /> <!-- ✅ Added sessionId -->
        </form>
        <script>
          document.getElementById('payuForm').submit();
        </script>
      </body>
      </html>
      `;

    res.set("Content-Type", "text/html");
    res.send(html);
  } catch (error) {
    console.error("PayU payment error:", error);
    next(error);
  }
};

import axios from "axios";
import AppError from "../utils/AppError.js";

const success = async (req, res, next) => {
  try {
    const response = req.body;
    console.log(req.body);
    const { sessionId } = req.body;
    console.log("Payment Success Data:", { sessionId, response });

    if (!sessionId) {
      return res.status(402).send("Session ID is required");
    }

    // 1. Verify the payment with PayU
    const isPaymentValid = await verifyPayUPayment(response);
    if (!isPaymentValid) {
      return res.status(403).send("Payment verification failed");
    }

    // 2. Update the payment session
    const updatedSession = await PaymentSession.findByIdAndUpdate(
      sessionId,
      {
        status: "completed",
        metaData: {
          ...response,
          paymentId: response.payuMoneyId || response.txnid,
        },
      },
      { new: true }
    );

    if (!updatedSession) {
      return res.status(404).send("Payment session not found");
    }

    // 3. Prepare the payment data for payedForMeeting endpoint
    const paymentData = {
      amount: updatedSession.amount,
      razorpay_payment_id: response.payuMoneyId || response.txnid,
      razorpay_order_id: response.txnid,
      razorpay_signature: response.hash,
    };

    const payedResponse = await axios.post(
      `https://advizy.onrender.com/api/v1/meeting/payedformeeting`,
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!payedResponse.data.success) {
      throw new Error("Payment processing failed");
    }

    const videoCallData = {
      title: updatedSession.metaData.serviceTitle || "Consultation",
      preferred_region: "ap-southeast-1",
    };

    const videoCallResponse = await axios.post(
      `https://advizy.onrender.com/api/v1/meeting/createVideoCall`,
      videoCallData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!videoCallResponse.data.success) {
      throw new Error("Video call creation failed");
    }

    const successToken = crypto.randomBytes(16).toString("hex");

    const confirmationData = {
      sessionId,
      token: successToken,
      bookingDetails: {
        image:
          updatedSession.metaData.expertImage ||
          "https://via.placeholder.com/100",
        name: updatedSession.metaData.expertName || "Expert",
        title: updatedSession.metaData.serviceTitle || "Consultation",
        sessionDuration: updatedSession.metaData.duration || "60 mins",
        price: updatedSession.amount,
        date: new Date(updatedSession.date).toLocaleDateString("en-IN", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
        }),
        time: {
          startTime: updatedSession.startTime,
          endTime: updatedSession.endTime,
        },
      },
    };

    await PaymentSession.findByIdAndUpdate(sessionId, {
      successToken,
      processingCompleted: true,
    });

    const redirectUrl = new URL("https://www.advizy.in/payu-payment-success");
    redirectUrl.searchParams.append("data", JSON.stringify(confirmationData));
    redirectUrl.searchParams.append("sessionId", sessionId);
    redirectUrl.searchParams.append("token", successToken);

    return res.redirect(redirectUrl.toString());
  } catch (error) {
    console.error("Payment success handler error:", error);

    // Update session with error status if processing failed
    if (sessionId) {
      await PaymentSession.findByIdAndUpdate(sessionId, {
        status: "processing_failed",
        error: error.message,
      });
    }

    res.redirect(
      `https://www.advizy.in/payu-payment-failure?error=${encodeURIComponent(
        error.message
      )}`
    );
  }
};
const failure = async (req, res, next) => {
  try {
    const response = req.body;
    console.log("Payment Failed:", response);
    return res.redirect("https://www.advizy.in/payu-payment-failure");
  } catch (error) {
    return next(new AppError(error, 503));
  }
};

export { payupay, success, failure };
