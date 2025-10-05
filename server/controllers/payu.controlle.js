import PaymentSession from "../config/model/transaction/PayuModel.js";
import moment from "moment-timezone";
import mongoose from "mongoose";
import crypto from "crypto";
import axios from "axios"; // keep if you call other internal endpoints
import { Meeting } from "../config/model/meeting/meeting.model.js";
import User from "../config/model/user.model.js";
import { Notification } from "../config/model/Notification/notification.model.js";
import { ExpertBasics } from "../config/model/expert/expertfinal.model.js";
import { Availability } from "../config/model/calendar/calendar.model.js";
import dotenv from 'dotenv'

dotenv.config();

const {
  PAYU_KEY = "BbfPbe",
  PAYU_SALT = "ihteCewpIbsofU10x6dc8F8gYJOnL2hz",
  PAYU_ENV = "prod",
  BACKEND_URL = "https://advizy.onrender.com",
  FRONTEND_URL = "https://advizy.in",
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
    data.amount, // EXACT string you’ll post in the form
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
    PAYU_SALT,
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

  // Build the sequence in the correct order for response verification
  const seq = [
    PAYU_SALT,
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
    key,
  ].join("|");

  console.log("PayU response seq:", seq);
  const calc = crypto
    .createHash("sha512")
    .update(seq)
    .digest("hex")
    .toLowerCase();
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
    sessionId: paymentData.sessionId, // the one we also send in udf6 & udf10
    amount: paymentData.amount, // number/string is fine; schema coerces to Number
    date: paymentData.date,
    startTime: paymentData.startTime,
    endTime: paymentData.endTime,
    message: paymentData.message,
    status: "pending",
    paymentGateway: "payu",
    // Store txnid too — either add a field in schema, or at least keep it in metaData
    payuTransactionId: paymentData.txnid, // <— add this field to your schema if possible
    metaData: { ...(paymentData.metaData || {}), txnid: paymentData.txnid },
  });
}

/** ============ INITIATE PAYMENT: returns auto-submitting HTML form ============ */
export const payupay = async (req, res, next) => {
  try {
    if (!PAYU_KEY || !PAYU_SALT) {
      // throw new Error("PayU credentials missing (PAYU_KEY/PAYU_SALT).");
      return res.status(500).json({
        success: false,
        message: "PayU credentials missing"
      });
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
      key: PAYU_KEY,
      txnid,
      amount: amountString,
      firstname: firstname || "",
      email: email || "",
      phone: phone || "",
      productinfo: productinfo || "Service Booking",
      surl: `${BACKEND_URL.replace(/\/$/, '')}/api/v1/payu/success`,
      furl: `${BACKEND_URL.replace(/\/$/, '')}/api/v1/payu/failure`,
      udf1: serviceId || "",
      udf2: expertId || "",
      udf3: userId || "",
      udf4: date || "",
      udf5: message || "",
      udf6: sessionId, // <— filled now
      udf7: "",
      udf8: "",
      udf9: "",
      udf10: sessionId, // <— also filled

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
    return res.status(500).json({
      success: false,
      message: "Payment initialization failed"
    });
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
        return res.status(302).redirect(`${FRONTEND_URL}/payu-payment-failure?reason=hash&sessionId=${encodeURIComponent(sessionId)}`);
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

      // 4) Update the meeting record to mark as paid and create video call
      try {
        // Find the meeting record using the serviceId, expertId, userId, and date
        console.log("Searching for meeting with criteria:", {
          serviceId: sessionDoc.serviceId,
          expertId: sessionDoc.expertId,
          userId: sessionDoc.userId,
          date: sessionDoc.date,
        });

        // Try to find meeting with multiple date format approaches
        let meeting = await Meeting.findOne({
          serviceId: sessionDoc.serviceId,
          expertId: sessionDoc.expertId,
          userId: sessionDoc.userId,
          "daySpecific.date": sessionDoc.date,
        });

        // If not found, try with string date format
        if (!meeting) {
          const dateString = sessionDoc.date instanceof Date
            ? sessionDoc.date.toISOString().split('T')[0]
            : sessionDoc.date;

          console.log("Trying with string date format:", dateString);
          meeting = await Meeting.findOne({
            serviceId: sessionDoc.serviceId,
            expertId: sessionDoc.expertId,
            userId: sessionDoc.userId,
            "daySpecific.date": dateString,
          });
        }

        if (meeting) {
          // Update meeting as paid
          meeting.isPayed = true;
          meeting.amount = sessionDoc.amount;
          meeting.razorpay_payment_id = payuMoneyId;

          // Create video call using Dyte API
          // Create video call using Dyte API
          // Create video call using Dyte API
          try {
            const dyteResponse = await axios.post(
              'https://api.dyte.io/v2/meetings',
              {
                title: `Meeting with ${meeting.expertName}`,
                // Remove organization_id since it's not allowed in the body
                // The organization ID is already included in your auth credentials
                preferred_region: 'ap-south-1',
                record_on_start: false,
                // Only include parameters that are accepted by the API
              },
              {
                auth: {
                  username: 'a34d79f4-e39a-4eba-8966-0c4c14b53339', // This is your organization ID
                  password: '96f3307b8a180f089a90',
                },
                headers: {
                  'Content-Type': 'application/json'
                },
              }
            );

            const videoCallId = dyteResponse.data.data.id;
            meeting.videoCallId = videoCallId;
            console.log("Video call created with ID:", videoCallId);
          } catch (videoCallError) {
            // Log detailed error response
            if (videoCallError.response) {
              console.error("Dyte API Error Response:", videoCallError.response.data);
              console.error("Dyte API Error Status:", videoCallError.response.status);
            }
            console.error("Error creating video call:", videoCallError);
            // Continue with payment processing even if video call creation fails
          }

          await meeting.save();
          console.log("Meeting updated successfully:", meeting._id);

          // Update expert's availability (similar to payedForMeeting function)
          try {
            const { expertId, daySpecific } = meeting;
            const availability = await Availability.findOne({ expert_id: expertId });

            if (availability) {
              // Convert meeting details to IST for accurate comparison
              const meetingDateIST = moment.utc(daySpecific.date).tz("Asia/Kolkata").format("YYYY-MM-DD");
              const meetingStartTimeIST = moment(daySpecific.slot.startTime, "hh:mm A").format("HH:mm");
              const meetingEndTimeIST = moment(daySpecific.slot.endTime, "hh:mm A").format("HH:mm");
              const meetingDay = moment.utc(daySpecific.date).tz(availability.timezone.value).format("dddd");

              // Find the availability entry for the meeting's day
              const dayEntry = availability.daySpecific.find((day) => day.day === meetingDay);

              if (dayEntry && dayEntry.slots) {
                // Find the matching time slot within that day
                const matchingSlot = dayEntry.slots.find((slotEntry) => {
                  const slotStartTimeIST = moment.utc(slotEntry.startTime, "HH:mm").tz("Asia/Kolkata").format("HH:mm");
                  const slotEndTimeIST = moment.utc(slotEntry.endTime, "HH:mm").tz("Asia/Kolkata").format("HH:mm");
                  return meetingStartTimeIST >= slotStartTimeIST && meetingEndTimeIST <= slotEndTimeIST;
                });

                if (matchingSlot) {
                  // Find the matching date entry in the slot
                  const matchingDateEntry = matchingSlot.dates.find((dateEntry) => {
                    const storedDateIST = moment.utc(dateEntry.date).tz("Asia/Kolkata").format("YYYY-MM-DD");
                    return storedDateIST === meetingDateIST;
                  });

                  if (matchingDateEntry) {
                    // Update the matched slot with meeting ID
                    matchingDateEntry.slots.push({
                      startTime: meetingStartTimeIST,
                      endTime: meetingEndTimeIST,
                      meeting_id: meeting._id,
                    });

                    await availability.save();
                    console.log("Expert availability updated successfully");
                  }
                }
              }
            }

            // Add meeting to expert's sessions
            const expert = await ExpertBasics.findById(expertId);
            if (expert) {
              expert.sessions.push(meeting._id);
              await expert.save();
              console.log("Expert sessions updated successfully");
            }

            // Create notification
            const notification = new Notification({
              expertId: meeting.expertId,
              message: `Payment received for meeting on ${daySpecific.date} for ₹${meeting.amount}`,
              amount: meeting.amount,
            });
            await notification.save();
            console.log("Notification created successfully");

            // Send emails
            const user = await User.findById(meeting.userId);
            // if (user && expert) {
            //   const templatePath = path.join(__dirname, "./EmailTemplates/bookingconfirmation.html");
            //   let emailTemplate = fs.readFileSync(templatePath, "utf8");
            //   const fullDate = moment(meeting.daySpecific.date);
            //   const month = fullDate.format("MMMM");
            //   const datee = fullDate.format("DD");
            //   const day = fullDate.format("dddd");

            //   emailTemplate = emailTemplate.replace(/{SERVICENAME}/g, meeting.serviceName);
            //   emailTemplate = emailTemplate.replace(/{EXPERTNAME}/g, meeting.expertName);
            //   emailTemplate = emailTemplate.replace(/{USERNAME}/g, user.firstName);
            //   emailTemplate = emailTemplate.replace(/{MEETINGDATE}/g, meeting.daySpecific.date);
            //   emailTemplate = emailTemplate.replace(/{STARTTIME}/g, meeting.daySpecific.slot.startTime);
            //   emailTemplate = emailTemplate.replace(/{ENDTIME}/g, meeting.daySpecific.slot.endTime);
            //   emailTemplate = emailTemplate.replace(/{MONTH}/g, month);
            //   emailTemplate = emailTemplate.replace(/{DATE}/g, datee);
            //   emailTemplate = emailTemplate.replace(/{DAY}/g, day);

            //   await sendEmail(expert.email, "Meeting Booked", emailTemplate, true);
            //   await sendEmail(user.email, "Meeting Booked", emailTemplate, true);
            //   console.log("Emails sent successfully");
            // }
          } catch (availabilityError) {
            console.error("Error updating availability:", availabilityError);
            // Continue with payment processing even if availability update fails
          }
        } else {
          console.error("Meeting not found for update");

          // Debug: Check what meetings exist for this user
          const userMeetings = await Meeting.find({ userId: sessionDoc.userId });
          console.log("All meetings for user:", userMeetings.map(m => ({
            id: m._id,
            serviceId: m.serviceId,
            expertId: m.expertId,
            userId: m.userId,
            date: m.daySpecific?.date,
            isPayed: m.isPayed
          })));
        }
      } catch (meetingError) {
        console.error("Error updating meeting:", meetingError);
        // Continue with payment processing even if meeting update fails
      }

      // 5) Short-lived success token you can validate on frontend
      const successToken = crypto.randomBytes(16).toString("hex");
      await PaymentSession.updateOne(
        { sessionId: sessionDoc.sessionId },
        { successToken, processingCompleted: true, "metaData.successToken": successToken },
        { strict: false }
      );

      return res.status(302).redirect(
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

      // Fetch the meeting details
      let meeting = null;
      if (sessionDoc.serviceId && sessionDoc.expertId && sessionDoc.userId) {
        meeting = await Meeting.findOne({
          serviceId: sessionDoc.serviceId,
          expertId: sessionDoc.expertId,
          userId: sessionDoc.userId,
          "daySpecific.date": sessionDoc.date,
        });
      }

      // Format booking details for the frontend
      let bookingDetails = null;
      if (meeting) {
        bookingDetails = {
          image: meeting.expertImage || '', // Adjust field names as needed
          name: meeting.expertName || '',
          title: meeting.serviceName || '',
          sessionDuration: meeting.duration || '', // Adjust field names as needed
          price: meeting.amount || '',
          date: meeting.daySpecific.date || '',
          time: {
            startTime: meeting.daySpecific.slot.startTime || '',
            endTime: meeting.daySpecific.slot.endTime || ''
          }
        };
      }

      return res.status(200).json({
        success: true,
        sessionId: sessionDoc.sessionId,
        status: sessionDoc.status,
        bookingDetails
      });
    } else {
      console.error("Unknown request format");
      return res.status(302).redirect(`${FRONTEND_URL}/payu-payment-failure?reason=invalid_request`);
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
    return res.status(500).redirect(`${FRONTEND_URL}/payu-payment-failure`);
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
    return res.status(302).redirect(`${FRONTEND_URL}/payu-payment-failure`);
  } catch (err) {
    console.error("PayU failure handler error:", err);
    return res.status(302).redirect(`${FRONTEND_URL}/payu-payment-failure`);
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { sessionId, token } = req.body;

    if (!sessionId || !token) {
      return res.status(400).json({
        success: false,
        message: "Session ID and token are required",
      });
    }

    // Find the session by sessionId and token
    const sessionDoc = await PaymentSession.findOne({
      sessionId,
      successToken: token,
      processingCompleted: true,
    });

    if (!sessionDoc) {
      return res.status(404).json({
        success: false,
        message: "Invalid session or token",
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
        endTime: sessionDoc.endTime,
      },
    });
  } catch (err) {
    console.error("Payment verification error:", err);
    return res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};
