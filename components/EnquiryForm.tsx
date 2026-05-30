'use client';

import { useState } from "react";

type EnquiryFormProps = {
  whatsappNumber?: string;
  isDarkBackground?: boolean;
};

export default function EnquiryForm({ whatsappNumber = '60172082266', isDarkBackground = false }: EnquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    tel: '',
    email: '',
    event: '',
    date: '',
    time: '',
    description: ''
  });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const message = `
*Quotation Request*

*Name:* ${formData.name}
*Tel:* ${formData.tel}
*Email:* ${formData.email}
*Event:* ${formData.event}
*Date:* ${formData.date}
*Time:* ${formData.time || 'Not specified'}
*Description:* ${formData.description || 'Not provided'}
    `.trim();

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    
    setFormData({ name: '', tel: '', email: '', event: '', date: '', time: '', description: '' });
    setStatus('success');
    
    setTimeout(() => setStatus('idle'), 3000);
  };

  const labelClass = `font-bold block text-sm uppercase tracking-wider ${isDarkBackground ? 'text-white' : 'text-jiffy-dark'}`;
  const inputClass = "w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-jiffy-dark transition-colors text-jiffy-dark";

  return (
    <div className={`bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl text-jiffy-dark ${isDarkBackground ? 'border border-gray-100' : ''}`}>
      <h2 className="text-3xl font-bold mb-8 uppercase tracking-tighter">Quotation Request</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="name" className={labelClass}>Name:</label>
          <input 
            id="name"
            name="name"
            type="text" 
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Full Name" 
            required
            className={inputClass} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="tel" className={labelClass}>Tel:</label>
            <input 
              id="tel"
              name="tel"
              type="tel" 
              value={formData.tel}
              onChange={handleChange}
              placeholder="Phone Number" 
              required
              className={inputClass} 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className={labelClass}>Email:</label>
            <input 
              id="email"
              name="email"
              type="email" 
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address" 
              required
              className={inputClass} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="event" className={labelClass}>Event:</label>
          <input 
            id="event"
            name="event"
            type="text" 
            value={formData.event}
            onChange={handleChange}
            placeholder="e.g. Wedding, Corporate Launch" 
            required
            className={inputClass} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="date" className={labelClass}>Date:</label>
            <input 
              id="date"
              name="date"
              type="date" 
              value={formData.date}
              onChange={handleChange}
              required
              className={`${inputClass} text-gray-500`} 
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="time" className={labelClass}>Time:</label>
            <input 
              id="time"
              name="time"
              type="time" 
              value={formData.time}
              onChange={handleChange}
              className={`${inputClass} text-gray-500`} 
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className={labelClass}>Description:</label>
          <textarea 
            id="description"
            name="description"
            rows={4} 
            value={formData.description}
            onChange={handleChange}
            placeholder="Tell us more about your event..." 
            className={`${inputClass} resize-none`}
          ></textarea>
        </div>

        <button 
          type="submit"
          className="w-full bg-jiffy-dark text-white font-bold py-4 rounded-xl mt-4 uppercase tracking-widest hover:bg-black transition-all active:scale-[0.98]"
        >
          {status === 'success' ? 'Opening WhatsApp...' : 'Submit via WhatsApp'}
        </button>
      </form>
    </div>
  );
}
