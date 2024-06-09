const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const app = express();

require('dotenv').config();

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

// Serve the HTML form
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle form submission and send email
app.post('/send-email', (req, res) => {
    const { email, subject, message, name } = req.body;
    console.log('Form submission received:', req.body); // Log form data

    // Create a transporter
    let transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: 25,
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWD,
        },
    });

    // Set up email data
    let mailOptions = {
        from: 'Aida Vers <aida@aidavers.com>',
        to: 'Aida Vers <aida@aidavers.com>',
        replyTo: email,
        subject: `Contact Form Submission: ${subject}`,
        text: `You have a new contact form submission from: \n\nName: 
        ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    };
    
    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error occurred:', error.message);
            return res.status(500).send('Something Wrong: ' + error.message);
        }
        console.log('Email sent:', info.response);
        res.status(200).send('Message sent successfully!');
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});
