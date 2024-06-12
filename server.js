const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
require('dotenv').config();

const i18next = require('i18next');
const Backend = require('i18next-node-fs-backend');
const i18nextMiddleware = require('i18next-express-middleware');

const APP_LANGUAGES = ['en', 'es', 'ca', 'it', 'fr'];

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        backend: {
            loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json'
        },
        fallbackLng: 'en',
        preload: APP_LANGUAGES
    });

app.use(i18nextMiddleware.handle(i18next));

app.get('/:lang_code', (req, res, next) => {
    const langCode = req.params.lang_code;

    if (APP_LANGUAGES.includes(langCode)) {
        req.i18n.changeLanguage(langCode);
        //next();
        res.render('index.html.ejs', { t: req.t, locale: req.locale });
    } else {
        res.status(404).render('404.html.ejs', { t: req.t, locale: req.locale });
    }
});

app.get('/', (req, res) => {
    res.render('index.html.ejs', { t: req.t, locale: req.locale });
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

// 404 not found
app.get('*', function(req, res){
    res.status(404).render('404.html.ejs', { t: req.t, locale: req.locale });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}...`);
});
