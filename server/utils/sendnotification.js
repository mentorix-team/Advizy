// sendnotification.js
import twilio from 'twilio';

const accountSid = process.env.accountSid ; 
const authToken =  process.env.authToken ; 
const fromNumber = process.env.fromNumber

const client = twilio(accountSid, authToken);

export const sendOtpMessage = async (to, otp) => {
    try {
        const message = await client.messages.create({
            body: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
            from: fromNumber,
            to: `+${to}` // Ensure the country code is included
        });
        return { success: true, message: `OTP sent to ${to}` };
    } catch (error) {
        console.error("Error sending OTP:", error.message);
        throw new Error("Failed to send OTP. Please try again.");
    }
};
