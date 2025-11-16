import nodemailer from 'nodemailer';

const sendEmail = async function(email, subject, message) {
    try {
        // Log environment variables (mask sensitive data)
        const smtpHost = process.env.smtphost;
        const smtpPort = process.env.smtpport;
        const emailUser = process.env.emailuser;
        const emailPass = process.env.emailpass;
        const fromEmail = process.env.fromemail;
        const sendgridApiKey = process.env.SENDGRID_API_KEY;

        console.log(`=== Email Configuration ===`);
        console.log(`SMTP Host: ${smtpHost || 'NOT SET'}`);
        console.log(`SMTP Port: ${smtpPort || 'NOT SET'}`);
        console.log(`Email User: ${emailUser ? emailUser.substring(0, 5) + '***' : 'NOT SET'}`);
        console.log(`From Email: ${fromEmail || 'NOT SET'}`);
        console.log(`SendGrid Key: ${sendgridApiKey ? 'SET' : 'NOT SET'}`);

        let transporter;

        // Option 1: Try SendGrid first (most reliable on cloud platforms)
        if (sendgridApiKey) {
            console.log('Using SendGrid transporter...');
            transporter = nodemailer.createTransport({
                host: 'smtp.sendgrid.net',
                port: 587,
                secure: false,
                auth: {
                    user: 'apikey',
                    pass: sendgridApiKey,
                },
                connectionTimeout: 15000,
                socketTimeout: 15000,
            });
        }
        // Option 2: Fall back to SMTP configuration
        else if (smtpHost && smtpPort && emailUser && emailPass) {
            console.log('Using SMTP transporter...');
            
            // Determine secure setting based on port
            // Port 587 = TLS (secure: false), Port 465 = SSL (secure: true)
            const secure = parseInt(smtpPort) === 465;
            
            console.log(`Using secure: ${secure} for port ${smtpPort}`);

            transporter = nodemailer.createTransport({
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
                connectionTimeout: 15000,
                socketTimeout: 15000,
            });
        } else {
            throw new Error('No email service configured. Set either SENDGRID_API_KEY or smtphost/smtpport/emailuser/emailpass environment variables.');
        }

        console.log(`Attempting to send email to: ${email}`);
        console.log(`Subject: ${subject}`);

        // Verify transporter connection before sending
        console.log('Verifying email transporter connection...');
        await transporter.verify();
        console.log('✅ Transporter verified successfully');

        const result = await transporter.sendMail({
            from: fromEmail || 'noreply@advizy.in',
            to: email,
            subject: subject,
            html: message
        });

        console.log(`✅ Email sent successfully to ${email}. Message ID: ${result.messageId}`);
        return result;
    } catch (error) {
        console.error('❌ Error sending email:', error.message);
        console.error('Error code:', error.code);
        console.error('Full error:', JSON.stringify(error, null, 2));
        
        // Provide specific error messages based on error type
        if (error.code === 'ETIMEDOUT' || error.code === 'EHOSTUNREACH') {
            throw new Error(`Email service timeout - SMTP server not responding. Config: host=${process.env.smtphost}, port=${process.env.smtpport}. Try using SendGrid (SENDGRID_API_KEY) instead.`);
        } else if (error.code === 'ENOTFOUND') {
            throw new Error(`Email service not found - Invalid SMTP host: ${process.env.smtphost}`);
        } else if (error.message.includes('Invalid login') || error.message.includes('535')) {
            throw new Error('Email authentication failed - Check emailuser and emailpass credentials.');
        } else if (error.message.includes('No email service configured')) {
            throw new Error(error.message);
        }
        
        throw new Error(`Could not send email: ${error.message}`);
    }
};

export default sendEmail;
