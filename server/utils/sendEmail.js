import nodemailer from 'nodemailer';

const sendEmail = async function(email, subject, message) {
    try {
        // Log environment variables (mask sensitive data)
        const smtpHost = process.env.smtphost;
        const smtpPort = process.env.smtpport;
        const emailUser = process.env.emailuser;
        const fromEmail = process.env.fromemail;

        console.log(`=== Email Configuration ===`);
        console.log(`SMTP Host: ${smtpHost || 'NOT SET'}`);
        console.log(`SMTP Port: ${smtpPort || 'NOT SET'}`);
        console.log(`Email User: ${emailUser ? emailUser.substring(0, 5) + '***' : 'NOT SET'}`);
        console.log(`From Email: ${fromEmail || 'NOT SET'}`);

        if (!smtpHost || !smtpPort || !emailUser || !fromEmail) {
            throw new Error('Missing SMTP configuration. Check environment variables: smtphost, smtpport, emailuser, emailpass, fromemail');
        }

        // Determine secure setting based on port
        // Port 587 = TLS (secure: false), Port 465 = SSL (secure: true)
        const secure = parseInt(smtpPort) === 465;
        
        console.log(`Using secure: ${secure} for port ${smtpPort}`);

        let transporter = nodemailer.createTransport({
            host: smtpHost,
            port: parseInt(smtpPort),
            secure: secure, // true for 465, false for 587
            auth: {
                user: emailUser,
                pass: process.env.emailpass,
            },
            tls: {
                rejectUnauthorized: false // Allow self-signed certificates
            },
            // Add timeout settings
            connectionTimeout: 10000, // 10 seconds
            socketTimeout: 10000, // 10 seconds
        });

        console.log(`Attempting to send email to: ${email}`);
        console.log(`Subject: ${subject}`);

        const result = await transporter.sendMail({
            from: `Advizy <${fromEmail}>`,
            to: email,
            subject: subject,
            html: message
        });

        console.log(`✅ Email sent successfully to ${email}. Message ID: ${result.messageId}`);
        return result;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        console.error('Error code:', error.code);
        console.error('Error details:', error);
        
        // Provide specific error messages based on error type
        if (error.code === 'ETIMEDOUT') {
            throw new Error('Email service timeout - SMTP server is not responding. Check host and port.');
        } else if (error.code === 'ENOTFOUND') {
            throw new Error('Email service not found - Invalid SMTP host address.');
        } else if (error.message.includes('Invalid login')) {
            throw new Error('Email authentication failed - Check emailuser and emailpass.');
        }
        
        throw new Error(`Could not send email: ${error.message}`);
    }
};

export default sendEmail;
