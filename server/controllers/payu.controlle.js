import crypto from 'crypto'
import PaymentSession from '../config/model/transaction/PayuModel.js';
import mongoose from 'mongoose';
// import axios from 'axios';
function generatePayUHash(data) {
    const hashString = `${data.key}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCbOmeInpy0GLl1/ErGzEOn7sUyHE1ZaoX/yOOZq0A64K0Pn3oAT6prU9cT5dU44OuNlop3aqnZZSWn1KiP3xrBEjQT1c1JVnbO6kDRftmcaDplg4JJsexMvKwOgf5dvHJNKCcovvUjymxwoZTKbaXtZbseekiP/0RmpsW5yFRqSnxlPNgPpBPb3PgD5up2CKfvB2fptHv1Te4ZhMMiW870QmZdP6FOmdy07hjhRAYF0Vm68QSRarddBn6ycIMkaY2Z3JUez9JGokwOt7XVCS8o5smwfFQkmcmGFtNOtzVFFzAiyW9IOCadWHmUyJOB5k467Odd7gB3jnwvVTnmT3ahAgMBAAECggEAMtV/jlgTDU+DfMXwXwYJqfchkPV/xyaBV3CcSHiyghWN1y3ssClmr9s29gcwOn495ZJFKjI+CTl8iWe1A9iWVF/3uf8sSTYNlllUfMbD0Nq5NQFKK4Qe1Ep9NgsQF/ZcoDPkDw3qDZx+wqvHpDsgOYw1KRf2p2F7LvqyidK3Ak97ZEd13rxzgivMMff6NM5PrurheQjhwuRzGAMMhd4MpKw5ZXCpNrYgKaXZStMPk1yTfFIlEHwhczYkZxvT2sb83TPUzk0HulN5cBef9ieRMeW4+shCEUYrm6qlex6DAb6Q6aexxPrb8vbKYxhTH83jMNvYLJNUQp64B25e3Oj02QKBgQC5qhnAdqDs1jeDgcVMsCJtnCJYpqH9MINQk1TQdS1lX2oH+F2K7VfpxxNBPyhYmJzK0CTH1ZCG9B/A7IPayCsQEJgPeMuTPh4XVPwFwFhJqgCj+5X6I28/jtAyootQDSOtk/spCmWKpo1/vsGT/TEDEYVRttjKJpfrMP+2gxXSDwKBgQDWCJBZ9oxesd801tGHe2oTIy0BSIf0BjPSK0s1iMUhGRG96wBml3dyojT7vk1FANlYokF5ObPy0jUEkCyCTXeVFHW2mYSXf9qv7HZimUn3D2iO5/YD0WdEHf3H/X8/RbimLCEuZrRfWQYHDb8qK+1wZGmNZLiXvsj4N5V96MYcTwKBgQCYMWGurQ+5VNhoyoXLGU7/fs+A0AdVnuDluf/6aTNvN8mZAvTbHzfDgNa902HlTiSo8/pSfTReC9vDr51eSFtUbeXYOPLXnkHYame05zj4GY0w3tjQFR/qf80W1LtSQZMPhJCL0ePuxhyTrPDNuOzmUQRyOWp4Oy6pMp9LIyVN7QKBgHYw2HW1XiJUmut0zNPB5PuYaxvQT7MDUc53NdrkIed7Dn8PrHL6pW1aAWQa3FSEeYEmaH1mzeYDCl/wtYNm/+gFGlOxRrTaV4raSy17dIrHqXdwxDurgRjubtvnMkNgXuz0ZYZYFLaqVFfE0ZGaHE36RQddXUn+gr//AcA7sFqlAoGBAK08TX9U9tFk7rZ+YtDplK46ksPXqsIzMZt3CXNEOWr+bBf/qNEG7cIiTkS9zfPWKYiTb5tOIJ4BjK3pBSSayW0YUzn+EI8HFhaFbv0dKSilmHc5FDTXmA29yanjlwqKZmtaFFxoktGwYVl6PvY6jwwk8hnq2V+RK6dyWwEQFhsM'}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
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
        status: paymentData.status || 'pending',
        paymentGateway: 'payu',
        metaData: paymentData.metaData || {} // Default empty object
      });
      
      return session;
    } catch (error) {
      console.error('Error creating payment session:', error);
      throw error;
    }
};
export const verifyPayUPayment = async (response) => {
    try {
        const hashString = `${response.key}|${response.txnid}|${response.amount}|${response.productinfo}|${response.firstname}|${response.email}|||||||||||${process.env.PAYU_SALT}`;
        const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex');
        
        if (calculatedHash !== response.hash) {
            console.error('Hash mismatch - possible tampering');
            return false;
        }
  
        if (response.status !== 'success') {
            console.error('Payment not successful according to PayU');
            return false;
        }
        return true;
    } catch (error) {
        console.error('Payment verification failed:', error);
        return false;
    }
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
        message
      } = req.body;
  
      console.log('req.body is:', req.body);
  
      // Validate required fields
      if (!userId) {
        throw new Error('User ID is required');
      }
  
      // Convert serviceId to ObjectId if possible, otherwise keep as string
      const serviceIdToUse = mongoose.Types.ObjectId.isValid(serviceId) 
        ? new mongoose.Types.ObjectId(serviceId)
        : serviceId;

    const formatTimeString = (isoString) => {
        if (!isoString.includes('T')) return isoString; // Already formatted
        const date = new Date(isoString);
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
        };
  
      const paymentSession = await createPaymentSession({
        serviceId: serviceIdToUse, 
        expertId: new mongoose.Types.ObjectId(expertId),
        userId: new mongoose.Types.ObjectId(userId),
        sessionId: `SESSION_${Date.now()}`,
        amount,
        date,
        startTime: formatTimeString(startTime),
        endTime: formatTimeString(endTime),
        message,
        status: 'pending'
      });
  
      // Rest of your PayU code...
      const payuData = {
        key: 'BbfPbe',
        txnid: txnid || `TXN${Date.now()}`,
        amount,
        firstname,
        email,
        phone,
        productinfo,
        surl: `https://www.advizy.in/payu-payment-success?sessionId=${paymentSession._id}`,
        furl: `https://www.advizy.in/payu-payment-failure?sessionId=${paymentSession._id}`,
        service_provider: 'payu_paisa'
      };
  
      const hash = generatePayUHash(payuData);

      // Generate complete HTML page with proper styling
      const html = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>Redirecting to PayU...</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  margin: 0;
                  background: #f5f5f5;
              }
              .loader {
                  border: 5px solid #f3f3f3;
                  border-top: 5px solid #3498db;
                  border-radius: 50%;
                  width: 50px;
                  height: 50px;
                  animation: spin 2s linear infinite;
              }
              @keyframes spin {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
              }
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
          </form>
          <script>
              document.getElementById('payuForm').submit();
          </script>
      </body>
      </html>
      `;

      res.set('Content-Type', 'text/html');
      res.send(html);
  } catch (error) {
      console.error("PayU payment error:", error);
      next(error);
  }
};
import axios from 'axios';

const success = async (req, res, next) => {
    try {
        const { sessionId } = req.query;
        const response = req.body;
        
        console.log("Payment Success:", response);
        
        // 1. Verify the payment with PayU
        const isPaymentValid = await verifyPayUPayment(response);
        if (!isPaymentValid) {
            return res.status(400).send("Payment verification failed");
        }
        
        // 2. Update the payment session
        const updatedSession = await PaymentSession.findByIdAndUpdate(
            sessionId,
            { 
                status: 'completed',
                metaData: {
                    ...response,
                    paymentId: response.payuMoneyId || response.txnid
                }
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
            razorpay_signature: response.hash
        };

        // 4. Call payedForMeeting endpoint
        const payedResponse = await axios.post(
            `https://advizy.onrender.com/api/v1/meeting/payedformeeting`, 
            paymentData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    // Add any required auth headers
                }
            }
        );

        if (!payedResponse.data.success) {
            throw new Error("Payment processing failed");
        }

        // 5. Prepare video call data
        const videoCallData = {
            title: updatedSession.metaData.serviceTitle || "Consultation",
            preferred_region: "ap-southeast-1"
        };

        // 6. Call createVideocall endpoint
        const videoCallResponse = await axios.post(
            `https://advizy.onrender.com/api/v1/meeting/createVideoCall`,
            videoCallData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    // Add any required auth headers
                }
            }
        );

        if (!videoCallResponse.data.success) {
            throw new Error("Video call creation failed");
        }

        // 7. Generate success token and redirect
        const successToken = crypto.randomBytes(16).toString('hex');

        const confirmationData = {
            sessionId,
            token: successToken,
            bookingDetails: {
                image: updatedSession.metaData.expertImage || 'https://via.placeholder.com/100',
                name: updatedSession.metaData.expertName || 'Expert',
                title: updatedSession.metaData.serviceTitle || 'Consultation',
                sessionDuration: updatedSession.metaData.duration || '60 mins',
                price: updatedSession.amount,
                date: new Date(updatedSession.date).toLocaleDateString("en-IN", {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                }),
                time: {
                    startTime: updatedSession.startTime,
                    endTime: updatedSession.endTime
                }
            }
        };


        await PaymentSession.findByIdAndUpdate(sessionId, { 
            successToken,
            processingCompleted: true 
        });
        
        res.redirect(`https://www.advizy.in/payu-payment-success?data=${encodeURIComponent(JSON.stringify(confirmationData))}`);        
    } catch (error) {
        console.error("Payment success handler error:", error);
        
        // Update session with error status if processing failed
        if (sessionId) {
            await PaymentSession.findByIdAndUpdate(sessionId, { 
                status: 'processing_failed',
                error: error.message 
            });
        }
        
        // Redirect to failure page with error details
        res.redirect(`${process.env.CLIENT_PAYMENT_FAILURE_URL}?error=${encodeURIComponent(error.message)}`);
    }
};
const failure = async(req,res,next) =>{
    const response = req.body;
    console.log("Payment Failed:", response);
    res.send("Payment Failed! ❌");
}



export{
    payupay,
    success,
    failure
}