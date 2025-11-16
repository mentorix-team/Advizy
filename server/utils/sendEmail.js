import nodemailer from 'nodemailer';
import axios from 'axios';

const sendEmail = async function(email, subject, message) {
    try {
        const sendgridApiKey = process.env.SENDGRID_API_KEY;
        const fromEmail = process.env.fromemail;
        const smtpHost = process.env.smtphost;
        const smtpPort = process.env.smtpport;
        const emailUser = process.env.emailuser;
        const emailPass = process.env.emailpass;

        console.log(`=== Email Configuration ===`);
        console.log(`SendGrid Key: ${sendgridApiKey ? 'SET' : 'NOT SET'}`);
        console.log(`From Email: ${fromEmail || 'NOT SET'}`);
        console.log(`SMTP Host: ${smtpHost || 'NOT SET'}`);

        let result;

        // Option 1: Use SendGrid Web API (more reliable, no SMTP firewall issues)
        if (sendgridApiKey) {
            console.log('Using SendGrid Web API...');
            
            try {
                const response = await axios.post(
                    'https://api.sendgrid.com/v3/mail/send',
                    {
                        personalizations: [
                            {
                                to: [{ email: email }],
                                subject: subject,
                            },
                        ],
                        from: {
                            email: fromEmail || 'noreply@advizy.in',
                            name: 'Advizy',
                        },
                        content: [
                            {
                                type: 'text/html',
                                value: message,
                            },
                        ],
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${sendgridApiKey}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                console.log(`✅ Email sent successfully via SendGrid Web API to ${email}`);
                result = { messageId: response.headers['x-message-id'] || 'sent' };
                return result;
            } catch (apiError) {
                console.error('SendGrid API Error:', apiError.response?.data || apiError.message);
                
                // If API fails, fall back to SMTP
                if (smtpHost && smtpPort && emailUser && emailPass) {
                    console.log('SendGrid API failed, falling back to SMTP...');
                    return await sendViaSmtp(smtpHost, smtpPort, emailUser, emailPass, fromEmail, email, subject, message);
                }
                
                throw new Error(`SendGrid API Error: ${apiError.response?.data?.errors?.[0]?.message || apiError.message}`);
            }
        }
        // Option 2: Fall back to SMTP configuration
        else if (smtpHost && smtpPort && emailUser && emailPass) {
            console.log('Using SMTP transporter...');
            return await sendViaSmtp(smtpHost, smtpPort, emailUser, emailPass, fromEmail, email, subject, message);
        } 
        else {
            throw new Error('No email service configured. Set either SENDGRID_API_KEY or smtphost/smtpport/emailuser/emailpass environment variables.');
        }
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        console.error('Error code:', error.code);
        throw new Error(`Could not send email: ${error.message}`);
    }
};

// Helper function for SMTP sending
async function sendViaSmtp(smtpHost, smtpPort, emailUser, emailPass, fromEmail, toEmail, subject, message) {
    const secure = parseInt(smtpPort) === 465;
    
    console.log(`Using secure: ${secure} for port ${smtpPort}`);

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(smtpPort),
        secure: secure,
        auth: {
            user: emailUser,
            pass: emailPass,
        },
        tls: {
            rejectUnauthorized: false
        },
        connectionTimeout: 60000,
        socketTimeout: 60000,
    });

    console.log(`Attempting to send email to: ${toEmail}`);
    console.log(`Subject: ${subject}`);

    const result = await transporter.sendMail({
        from: fromEmail || 'noreply@advizy.in',
        to: toEmail,
        subject: subject,
        html: message
    });

    console.log(`✅ Email sent successfully via SMTP to ${toEmail}. Message ID: ${result.messageId}`);
    return result;
}

export default sendEmail;
