'use client';

import { useEffect, useRef, useState } from "react";
import { createClient } from "next-sanity";
import imageUrlBuilder from '@sanity/image-url';

// --- SANITY CLIENT CONFIGURATION ---
const client = createClient({
  projectId: "g8867hcl", 
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: true,
});

export default function ContactPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [headerFooterSettings, setHeaderFooterSettings] = useState<any>(null);
  const formSectionRef = useRef<HTMLDivElement | null>(null);

  // Form States
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({
    name: '',
    tel: '',
    email: '',
    event: '',
    date: '',
    time: '',
    description: ''
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await client.fetch(`*[_type == "contactPage"][0]`);
        setData(result);

        const settings = await client.fetch(
          `*[_type == "headerFooter"][0] {
            whatsappSettings {
              whatsappNumber
            }
          }`
        );
        setHeaderFooterSettings(settings);
      } catch (err) {
        console.error("Sanity fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (loading) return;
    if (window.location.hash !== '#contact-form') return;

    requestAnimationFrame(() => {
      formSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    });
  }, [loading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // DIRECT GMAIL FUNCTION ---
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = data?.emailAddress || 'hello@jiffybooth.com';
    // This specific URL triggers Gmail's web compose form directly
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}&su=Enquiry for Jiffy Booth`;
    window.open(gmailUrl, '_blank');
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
    const whatsappNumber = headerFooterSettings?.whatsappSettings?.whatsappNumber || data?.whatsappNumber || '60163966562';
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
    
    setFormData({ name: '', tel: '', email: '', event: '', date: '', time: '', description: '' });
    setStatus('success');
    
    setTimeout(() => setStatus('idle'), 3000);
  };

  if (loading) return <div className="min-h-screen bg-white" />;

  return (
    <main className="min-h-screen bg-[#ffffff] font-inter overflow-x-hidden">
      {/* --- ULTRA-COMPACT HEADER --- */}
      <section className="bg-[#2c343f] py-6 md:py-10 px-6 sm:px-12 lg:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight">
              Contact Us
            </h1>
            <div className="h-1 w-12 bg-blue-400 mt-1 rounded-full hidden md:block"></div>
          </div>
          <p className="text-gray-400 text-sm md:text-base max-w-md leading-snug md:text-right">
            Have questions about our booths or want to check availability? Reach out through any channel below.       
          </p>
        </div>
      </section>

      {/* --- DYNAMIC CONTACT ZONE --- */}
      <section className="w-full bg-gray-50 py-4 md:py-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* WhatsApp Card */}
          <a href={`https://wa.me/${data?.whatsappNumber || '60163966562'}`} target="_blank" rel="noopener noreferrer" 
            className="group bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-row md:flex-col items-center md:text-center gap-6">
            
            <div className="flex-shrink-0 bg-[#25D366]/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            </div>

            <div className="flex flex-col text-left md:text-center overflow-hidden">
              <h3 className="text-[#1c2431] text-xl font-bold">WhatsApp</h3>
              <p className="text-gray-500 text-sm mt-1 italic">Chat with us instantly</p>
              <div className="mt-3 px-3 py-1.5 bg-gray-50 rounded-full text-[#1c2431] font-bold text-xs md:text-sm tracking-tight inline-block w-fit md:w-auto">
                +{data?.whatsappNumber || "60 16-396 6562"}
              </div>
            </div>
          </a>

          {/* Instagram Card */}
          <a href={`https://instagram.com/${data?.instagramUser || 'jiffybooth'}`} target="_blank" rel="noopener noreferrer" 
            className="group bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-row md:flex-col items-center md:text-center gap-6">
            <div className="flex-shrink-0 bg-[#e4405f]/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#e4405f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </div>
            <div className="flex flex-col text-left md:text-center overflow-hidden">
              <h3 className="text-[#1c2431] text-xl font-bold">Instagram</h3>
              <p className="text-gray-500 text-sm mt-1 italic">Instant profile check</p>
              <div className="mt-3 px-3 py-1.5 bg-gray-50 rounded-full text-[#1c2431] font-bold text-xs md:text-sm inline-block w-fit md:w-auto">
                @{data?.instagramUser || "jiffybooth"}
              </div>
            </div>
          </a>

          {/* Email Card  */}
          <a href="#" onClick={handleEmailClick}
            className="group bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 flex flex-row md:flex-col items-center md:text-center gap-6">
            <div className="flex-shrink-0 bg-[#2c343f]/10 w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2c343f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
            <div className="flex flex-col text-left md:text-center overflow-hidden">
              <h3 className="text-[#1c2431] text-xl font-bold">Email</h3>
              <p className="text-gray-500 text-sm mt-1 italic">Professional Enquiries</p>
              <div className="mt-3 px-3 py-1.5 bg-gray-50 rounded-full text-[#1c2431] font-bold text-xs md:text-sm truncate inline-block w-fit md:w-auto">
                {data?.emailAddress || "hello@jiffybooth.com"}
              </div>
            </div>
          </a>

        </div>
      </section>

      {/* --- TIMELINE AND FORM SECTION --- */}
      <section className="max-w-6xl mx-auto py-12 md:py-16 px-6 sm:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">
          {/* LEFT: TIMELINE */}
          <div className="flex-1 w-full relative">
            <div className="absolute top-0 -left-10 text-[10rem] font-black text-gray-50 -z-10 select-none pointer-events-none uppercase">STEPS</div>
            <h2 className="text-[#a0522d] text-3xl md:text-4xl font-bold tracking-tight mb-10 uppercase">
              {data?.bookingTitle || "How to Book?"}
            </h2>
            <div className="relative">
              <div className="absolute left-[20px] top-2 bottom-2 w-[3px] bg-[#d2b48c] z-0"></div>

              {(data?.bookingSteps || []).map((step: any, index: number) => (
                <div key={index} className="relative flex items-start gap-6 z-10 pb-8 last:pb-0 group">
                  <div className="flex-shrink-0 w-10 h-10 bg-[#8b4513] rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-md group-hover:scale-110 transition-transform">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-[#1c2431] text-lg font-black uppercase tracking-tight mb-1">{step.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed max-w-sm font-light">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: FORM */}
          <div id="contact-form" ref={formSectionRef} className="flex-1 lg:max-w-xl scroll-mt-24">
            <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-2xl text-jiffy-dark border border-gray-100">
              <h2 className="text-3xl font-bold mb-8 uppercase tracking-tighter text-[#2c343f]">Quotation Request</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="font-bold block text-sm uppercase tracking-wider text-[#2c343f]">Name:</label>
                  <input 
                    name="name"
                    type="text" 
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Full Name" 
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-[#2c343f] transition-colors" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-bold block text-sm uppercase tracking-wider text-[#2c343f]">Tel:</label>
                    <input 
                      name="tel"
                      type="tel" 
                      value={formData.tel}
                      onChange={handleChange}
                      placeholder="Phone Number" 
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-[#2c343f] transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-bold block text-sm uppercase tracking-wider text-[#2c343f]">Email:</label>
                    <input 
                      name="email"
                      type="email" 
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address" 
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-[#2c343f] transition-colors" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-bold block text-sm uppercase tracking-wider text-[#2c343f]">Event:</label>
                  <input 
                    name="event"
                    type="text" 
                    value={formData.event}
                    onChange={handleChange}
                    placeholder="e.g. Wedding, Corporate Launch" 
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:border-[#2c343f] transition-colors" 
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="font-bold block text-sm uppercase tracking-wider text-[#2c343f]">Date:</label>
                    <input 
                      name="date"
                      type="date" 
                      value={formData.date}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none text-gray-500 focus:border-[#2c343f] transition-colors" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-bold block text-sm uppercase tracking-wider text-[#2c343f]">Time:</label>
                    <input 
                      name="time"
                      type="time" 
                      value={formData.time}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none text-gray-500 focus:border-[#2c343f] transition-colors" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-bold block text-sm uppercase tracking-wider text-[#2c343f]">Description:</label>
                  <textarea 
                    name="description"
                    rows={4} 
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell us more about your event details..." 
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none resize-none focus:border-[#2c343f] transition-colors"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#2c343f] text-white font-bold py-4 rounded-xl mt-4 uppercase tracking-[0.2em] hover:bg-black transition-all active:scale-[0.98]"
                >
                  {status === 'success' ? 'Opening WhatsApp...' : 'Submit via WhatsApp'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}