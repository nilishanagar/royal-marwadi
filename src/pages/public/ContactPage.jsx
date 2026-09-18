import { useState } from 'react';
import { LuMapPin, LuPhone, LuMail, LuClock, LuSend } from 'react-icons/lu';
import './ContactPage.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page contact-page">
      <section className="contact-hero">
        <div className="container">
          <span className="section-label">Get in Touch</span>
          <h1>Contact Us</h1>
          <p>Have a question or need assistance? We'd love to hear from you.</p>
        </div>
      </section>

      <section className="section container">
        <div className="contact-grid">
          <div className="contact-info-cards">
            {[
              { icon: LuMapPin, title: 'Visit Us', lines: ['42 Heritage Lane', 'Jodhpur, Rajasthan 342001'] },
              { icon: LuPhone, title: 'Call Us', lines: ['+91 98765 43210', '+91 14122 33445'] },
              { icon: LuMail, title: 'Email Us', lines: ['hello@royalmarwadi.com', 'support@royalmarwadi.com'] },
              { icon: LuClock, title: 'Working Hours', lines: ['Mon - Sat: 10am - 7pm', 'Sunday: Closed'] },
            ].map((item, i) => (
              <div key={i} className="contact-card card">
                <div className="contact-card-icon"><item.icon size={22} /></div>
                <h4>{item.title}</h4>
                {item.lines.map((l, j) => <p key={j}>{l}</p>)}
              </div>
            ))}
          </div>

          <form className="contact-form card" onSubmit={handleSubmit}>
            <h3>Send us a Message</h3>
            <div className="input-group">
              <label htmlFor="contact-name">Full Name</label>
              <input id="contact-name" className="input" placeholder="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className="input-group">
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" type="email" className="input" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div className="input-group">
              <label htmlFor="contact-subject">Subject</label>
              <input id="contact-subject" className="input" placeholder="How can we help?" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            </div>
            <div className="input-group">
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" className="input" rows="5" placeholder="Your message..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </div>
            <button type="submit" className="btn btn-accent btn-lg" style={{ width: '100%' }}>
              <LuSend size={18} /> {submitted ? 'Message Sent! ✓' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
