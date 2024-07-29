import { Document, Schema, model } from 'mongoose';

interface IEmailRecord extends Document {
    to: string;
    subject: string;
    text: string;
    sentAt: Date;
}

const emailRecordSchema = new Schema<IEmailRecord>({
    to: { type: String, required: true },
    subject: { type: String, required: true },
    text: { type: String, required: true },
    sentAt: { type: Date, default: Date.now },
});

const EmailRecord = model<IEmailRecord>('EmailRecord', emailRecordSchema);
export default EmailRecord;
