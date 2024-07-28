import { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    text: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.to) errors.to = 'Recipient email is required';
    if (!formData.subject) errors.subject = 'Subject is required';
    if (!formData.text) errors.text = 'Email text is required';
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/send-email', formData);
      console.log(response)
      alert('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  };

  return (
    <div className='container'>
      <h1>Send Email</h1>
      <form onSubmit={handleSubmit}>
        <div className='group'>
          <label htmlFor="to">To:</label>
          <input
            type="email"
            name="to"
            value={formData.to}
            onChange={handleChange}
          />
          {errors.to && <span>{errors.to}</span>}
        </div>
        <div className='group'>
          <label htmlFor="subject">Subject:</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
          />
          {errors.subject && <span>{errors.subject}</span>}
        </div>
        <div className='group'>
          <label htmlFor="text">Text:</label>
          <textarea
            name="text"
            value={formData.text}
            onChange={handleChange}
            rows={5}
          />
          {errors.text && <span>{errors.text}</span>}
        </div>
        <button type="submit">Send Email</button>
      </form>
    </div>
  );
}

export default App
