import nodemailer from 'nodemailer';

const sendEmail = async function(email, subject, message) {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.smtphost,
            port: process.env.smtpport,
            secure: false, // false for 587, true for 465
            auth: {
                user: process.env.emailuser , // Your Gmail address
                pass: process.env.emailpass, // Your app-specific password
            },
            tls: {
                rejectUnauthorized: false // Allow self-signed certificates
            }
        });

        await transporter.sendMail({
            from: `Advizy <${process.env.fromemail}>`, // Sender's email
            to: email,
            subject: subject,
            html: message
        }); 
        console.log(`Email sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Could not send email. Please try again later.');
    }
};

export default sendEmail;
