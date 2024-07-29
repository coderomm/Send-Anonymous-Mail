import { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface FormData {
  to: string;
  subject: string;
  text: string;
}

interface Errors {
  to?: string;
  subject?: string;
  text?: string;
}

function App() {
  const [formData, setFormData] = useState<FormData>({
    to: '',
    subject: '',
    text: '',
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: '',
    });
  };

  const validateForm = () => {
    let errors: Errors = {};
    if (!formData.to) errors.to = 'Recipient email is required';
    if (!formData.subject) errors.subject = 'Subject is required';
    if (!formData.text) errors.text = 'Email text is required';
    return errors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setIsSending(true);
    setStatusMessage('Sending email...');
    try {
      const response = await axios.post('https://send-anonymous-mail.onrender.com/send-email', formData);
      console.log(response)
      setFormData({
        to: '',
        subject: '',
        text: '',
      });
    } catch (error: any) {
      console.error('Error sending email:', error);
      setStatusMessage(`Failed to send email: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSending(false);
      setStatusMessage('Email sent successfully!');
      setTimeout(() => {
        setStatusMessage('');
      }, 2000)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Send Anonymous Email</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="to" className="block text-sm font-medium text-gray-700">To:</label>
            <input
              type="email"
              name="to"
              value={formData.to}
              onChange={handleChange}
              disabled={isSending}
              className={`mt-1 block w-full rounded-md shadow-sm border-2 p-1 ${errors.to ? 'border-red-500' : 'border-[#213547]'
                }`}
            />
            {errors.to && <p className="text-red-500 text-xs mt-1">{errors.to}</p>}
          </div>
          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject:</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              disabled={isSending}
              className={`mt-1 block w-full rounded-md shadow-sm border-2 p-1 ${errors.subject ? 'border-red-500' : 'border-[#213547]'
                }`}
            />
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
          </div>
          <div>
            <label htmlFor="text" className="block text-sm font-medium text-gray-700">Text:</label>
            <textarea
              name="text"
              value={formData.text}
              onChange={handleChange}
              disabled={isSending}
              className={`mt-1 block w-full rounded-md shadow-sm border-2 p-1 ${errors.text ? 'border-red-500' : 'border-[#213547]'
                }`}
            />
            {errors.text && <p className="text-red-500 text-xs mt-1">{errors.text}</p>}
          </div>
          <button
            type="submit"
            disabled={isSending}
            className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-md font-medium text-white ${isSending ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
          >
            {isSending ? 'Sending...' : 'Send Email'}
          </button>
          {statusMessage && <p className="text-center mt-4">{statusMessage}</p>}
        </form>
      </div>
    </div>
  );
}

export default App