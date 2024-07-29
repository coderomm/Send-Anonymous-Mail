require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const mongoose = require('mongoose');
const EmailRecord = require('./models/EmailRecords');

const app = express();
const PORT = process.env.PORT || 5000;

async function dbConnect() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Successfully connected to MongoDB Atlas!');
    } catch (error) {
        console.log('Unable to connect to MongoDB Atlas! error: ', error);
    }
}
dbConnect();

app.use(bodyParser.json());
app.use(cors({ origin: 'https://send-anonymous-mail.vercel.app' }));

app.post('/send-email', async (req, res) => {
    const { to, subject, text } = req.body;
    if (!to || !subject || !text) {
        return res.status(400).send('All fields are required.');
    }
    try {
        const transport = nodemailer.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            },
            logger: true,
            debug: true,
        });
        const mailOptions = {
            from: process.env.GMAIL_USER,
            to,
            subject,
            text
        };

        const result = await transport.sendMail(mailOptions);
        console.log('Email sent:', result)
        const emailRecord = new EmailRecord({ to, subject, text });
        await emailRecord.save();
        res.status(200).send(result);
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).send(error.toString());
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
