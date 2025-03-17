import crypto from 'crypto';
import AppError from '../utils/AppError.js';
import axios from 'axios';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.razorpaykey_id,
  key_secret: process.env.razorpaykey_secret
});

const createOrder = async (req, res, next) => {
  console.log("Received request data:", req.body);

  const { amount, currency = 'INR', receipt } = req.body;

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ success: false, message: "Invalid amount" });
  }

  try {
    const uniqueReceipt = receipt || `order_${Date.now()}`;
    const options = {
      amount, // Razorpay expects amount in paise; frontend converts it before sending
      currency,
      receipt: uniqueReceipt,
    };

    console.log("Creating Razorpay order with options:", options);

    const order = await razorpay.orders.create(options);

    console.log("Razorpay order created successfully:", order);

    res.status(200).json({
      success: true,
      orderId: order.id,
      currency: order.currency,
      amount: order.amount / 100,
      receipt: order.receipt,
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error.message, error.stack);
    return next(new AppError("Error creating order", 500));
  }
};


const verifyPayment = (req, res, next) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

  try {
    console.log('Request Body:', req.body);

    // Generate the expected signature
    const generated_signature = crypto
      .createHmac('sha256', 'fG4W6CZKg62JgO74HnB66XFL') // Replace with your Razorpay secret key
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    console.log('Generated Signature:', generated_signature);
    console.log('Received Signature:', razorpay_signature);

    if (generated_signature === razorpay_signature) {
      // Verification succeeded; return details
      res.status(200).json({
        success: true,
        message: 'Payment verified successfully!',
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      });
    } else {
      console.log('Signature mismatch');
      return next(new AppError('Signature mismatch', 501));
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return next(new AppError('Error verifying payment', 500));
  }
};

const fetchPaymentDetails = async (req,res,next) => {
  try {
    const paymentId = req.body;
    const paymentDetails = await razorpay.payments.fetch(paymentId);
    console.log('Payment Details:', paymentDetails);
    res.status(200).json({
      success:true,
      message:'Payment Details',
      paymentDetails
    });
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return next(new AppError('Error fetching payment details', 500));
  }
};



// const initiatePayout = async (req, res, next) => {
//   try {
//     const { amount, accountNumber, beneficiaryName, ifsc, currency = 'INR', mode = 'IMPS' } = req.body;
//     console.log(req.body)
//     if (!amount || !accountNumber || !beneficiaryName || !ifsc) {
//       return res.status(400).json({ success: false, message: 'Invalid parameters' });
//     }

//     const options = {
//       account_number: '50100561494216', // Razorpay Account Number
//       fund_account: {
//         account_type: 'saving',
//         bank_account: {
//           name: beneficiaryName,
//           ifsc,
//           account_number: accountNumber,
//         },
//       },
//       amount: amount * 100, // Amount in paise
//       currency,
//       mode,
//       purpose: 'refund', // Reason for payout
//       queue_if_low_balance: true, // Optional: Queue payout if balance is low
//       reference_id: `payout_${Date.now()}`, // Unique reference ID
//     };

//     console.log('Initiating Payout with options:', options);

//     const payout = await razorpay.payouts.create(options);

//     console.log('Payout successfully created:', payout);

//     res.status(200).json({
//       success: true,
//       payoutId: payout.id,
//       status: payout.status,
//       message: 'Payout initiated successfully!',
//     });
//   } catch (error) {
//     console.error(error);
//     next(new AppError('Error initiating payout', 500));
//   }
// };
const razorpayAPIKey = process.env.razorpaykey_id; // Your Razorpay key
const razorpayAPISecret = process.env.razorpaykey_secret; // Your Razorpay secret

const refundPayment = async (req, res, next) => {
  try {
      const { paymentId } = req.params;

      // Find the meeting with this payment ID
      const meeting = await Meeting.findOne({ razorpay_payment_id: paymentId });

      if (!meeting) {
          return res.status(404).json({ success: false, message: "Meeting not found" });
      }

      // Use the correct amount from the meeting
      const refundAmount = meeting.amount * 100; // Razorpay expects amount in paise

      const refund = await razorpay.payments.refund(paymentId, {
          amount: refundAmount,
          speed: 'normal',
          notes: { reason: 'User denied rescheduling' }
      });

      res.json({ success: true, refund });
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
  }
};


const createLinkedAccount = async (expertDetails) => {
  try {
    console.log("Creating linked account...");

    // Debugging: Log expert details
    console.log("Expert Details for Linked Account:", expertDetails);

    // Define payload for creating a linked account
    const linkedAccountPayload = {
      email: expertDetails.email,
      phone: expertDetails.contactNumber,
      legal_business_name: "Vendor Business", // Fixed for vendor
      business_type: "vendor", // Fixed for vendor
      profile: {
        // Add basic profile details here
        business_name: "Demo Vendor Business", // Replace with actual business name if required
        business_sub_type: "retail" // Example business sub-type
      }
    };

    console.log("Linked Account Payload:", linkedAccountPayload);

    // Call Razorpay API to create a linked account
    const linkedAccountResponse = await axios.post(
      'https://api.razorpay.com/v2/accounts',
      linkedAccountPayload,
      {
        auth: {
          username: razorpayAPIKey,
          password: razorpayAPISecret,
        },
      }
    );

    const linkedAccountId = linkedAccountResponse.data.id; // acc_*
    console.log("Linked account created successfully with ID:", linkedAccountId);

    return linkedAccountId;
  } catch (error) {
    console.error("Error creating linked account:", error.response?.data || error.message);
    throw new Error("Failed to create linked account");
  }
};


const createStakeholder = async (accountId, stakeholderDetails) => {
  try {
    // Stakeholder payload
    const stakeholderPayload = {
      name: stakeholderDetails.name, // Required: Name as per PAN card
      email: stakeholderDetails.email, // Optional: Email
    };

    console.log("Creating stakeholder for account:", accountId);
    console.log("Stakeholder payload:", stakeholderPayload);

    // Make the API request to create a stakeholder
    const response = await axios.post(
      `https://api.razorpay.com/v1/accounts/${accountId}/stakeholders`, // Correct endpoint
      stakeholderPayload,
      {
        auth: {
          username: razorpayAPIKey,
          password: razorpayAPISecret,
        },
      }
    );

    console.log("Stakeholder created successfully with ID:", response.data.id);
    return response.data.id;
  } catch (error) {
    console.error("Error creating stakeholder:", error.response?.data || error.message);
    throw new Error("Failed to create stakeholder");
  }
};



const requestProductConfiguration = async (accountId) => {
  try {
    console.log("Requesting product configuration for account:", accountId);

    const response = await axios.post(
      `https://api.razorpay.com/v2/accounts/${accountId}/configurations/request`,
      {}, // Assuming no additional payload is required
      {
        auth: {
          username: razorpayAPIKey,
          password: razorpayAPISecret,
        },
      }
    );

    console.log("Product configuration requested:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error requesting product configuration:", error.response?.data || error.message);
    throw new Error("Failed to request product configuration");
  }
};


const updateProductConfiguration = async (accountId, bankDetails) => {
  try {
    const payload = {
      bank_account: {
        name: bankDetails.name,
        ifsc: bankDetails.ifsc,
        account_number: bankDetails.accountNumber,
      },
    };

    console.log("Updating product configuration for account:", accountId);
    console.log("Bank details payload:", payload);

    const response = await axios.put(
      `https://api.razorpay.com/v2/accounts/${accountId}/configurations`,
      payload,
      {
        auth: {
          username: razorpayAPIKey,
          password: razorpayAPISecret,
        },
      }
    );

    console.log("Product configuration updated:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating product configuration:", error.response?.data || error.message);
    throw new Error("Failed to update product configuration");
  }
};

const initiateTransfer = async (amount, currency, accountId) => {
  try {
    const payload = {
      amount: amount * 100, // Convert to smallest currency unit (e.g., paise for INR)
      currency: currency,
      account_id: accountId,
      purpose: 'payout', // Example purpose
    };

    console.log("Initiating transfer with payload:", payload);

    const response = await axios.post(
      'https://api.razorpay.com/v1/payouts',
      payload,
      {
        auth: {
          username: razorpayAPIKey,
          password: razorpayAPISecret,
        },
      }
    );

    console.log("Transfer initiated with ID:", response.data.id);
    return response.data;
  } catch (error) {
    console.error("Error initiating transfer:", error.response?.data || error.message);
    throw new Error("Failed to initiate transfer");
  }
};
const initiatePayout = async (req, res, next) => {
  try {
    const { 
      amount, 
      accountNumber, 
      beneficiaryName, 
      ifsc, 
      email, 
      contactNumber, 
      currency = 'INR' 
    } = req.body;

    console.log(req.body); // Debugging: Log request body

    // Validate required fields
    if (!amount || !accountNumber || !beneficiaryName || !ifsc || !email || !contactNumber) {
      return next(new AppError('All fields are required', 400));
    }

    // Step 1: Create a linked account
    const accountId = await createLinkedAccount({
      name: beneficiaryName,
      email: email,
      contactNumber: contactNumber,
      accountNumber: accountNumber, // Pass account number
      ifsc: ifsc, // Pass IFSC code
    });

    // Step 2: Create a stakeholder
    const stakeholderId = await createStakeholder(accountId, {
      name: beneficiaryName,
      email: email,
    });

    // Step 3: Request product configuration
    await requestProductConfiguration(accountId);

    // Step 4: Update product configuration with bank account details
    await updateProductConfiguration(accountId, {
      name: beneficiaryName,
      ifsc,
      accountNumber,
    });

    // Step 5: Initiate transfer
    const transferResponse = await initiateTransfer(amount, currency, accountId);

    // Success response
    res.status(200).json({
      success: true,
      transferId: transferResponse.id,
      stakeholderId: stakeholderId,
      status: transferResponse.status,
      message: 'Payout initiated successfully!',
    });
  } catch (error) {
    console.error('Error initiating payout:', error);
    next(new AppError(error.message || 'Something went wrong during payout.', 500));
  }
};










// const initiatePayout = async (req, res, next) => {
//   try {
//     const {
//       amount,
//       accountNumber,
//       beneficiaryName,
//       ifsc,
//       currency = 'INR',
//     } = req.body;

//     console.log(req.body);

//     // Validate required fields
//     if (!amount || !accountNumber || !beneficiaryName || !ifsc) {
//       return next(new AppError('All fields are required',500))
//     }

//     // Step 1: Create a fund account for the beneficiary
//     const fundAccountPayload = {
//       contact: {
//         name: beneficiaryName,
//         email: `${beneficiaryName.toLowerCase().replace(/\s+/g, '')}@example.com`, // Placeholder email
//         contact: '9876543210', // Placeholder contact number
//         type: 'employee', // Set beneficiary type (e.g., employee/vendor)
//       },
//       account_type: 'bank_account',
//       bank_account: {
//         name: beneficiaryName,
//         ifsc,
//         account_number: accountNumber,
//       },
//     };

//     console.log('Creating fund account with payload:', fundAccountPayload);

//     const fundAccountResponse = await razorpay.fundAccounts.create(
//       fundAccountPayload
//     );

//     console.log('Fund account created successfully:', fundAccountResponse);

//     const fundAccountId = fundAccountResponse.id;

//     const transferPayload = {
//       account: 'acc_abcdefgh12345678', // Replace with your Razorpay account ID
//       fund_account_id: fundAccountId,
//       amount: amount * 100, // Convert to paise
//       currency,
//       notes: {
//         purpose: 'Vendor Payment', // Add purpose for clarity
//       },
//     };

//     console.log('Initiating transfer with payload:', transferPayload);

//     const transferResponse = await razorpay.transfers.create(transferPayload);

//     console.log('Transfer successfully initiated:', transferResponse);

//     res.status(200).json({
//       success: true,
//       transferId: transferResponse.id,
//       status: transferResponse.status,
//       message: 'Payout initiated successfully!',
//     });
//   } catch (error) {
//     console.error('Error initiating payout:', error);

//     const errorMessage =
//       error?.error?.description || 'Something went wrong during payout.';
//     next(new AppError(errorMessage, 500));
//   }
// };


export {
  createOrder,
  verifyPayment,
  fetchPaymentDetails,
  initiatePayout,
  refundPayment
};
