import nodemailer from 'nodemailer';

const sendEmail = async function(email, subject, message) {
    try {
        let transporter = nodemailer.createTransport({
            host: process.env.smtphost,
            port: process.env.smtppport,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.emailuser , // Your Gmail address
                pass: process.env.emailpass, // Your app-specific password
            }
        });

        await transporter.sendMail({
            from: process.env.fromemail, // Sender's email
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
