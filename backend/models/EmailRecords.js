const mongoose = require('mongoose');

const emailRecordSchema = new mongoose.Schema({
    to: { type: String, required: true },
    subject: { type: String, required: true },
    text: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
});

const EmailRecord = mongoose.model('EmailRecord', emailRecordSchema);

module.exports = EmailRecord;