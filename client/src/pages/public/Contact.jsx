import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Send,
  Clock,
  Loader2,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ArrowDown,
  ExternalLink,
  Truck,
  ArrowRight,
  Instagram,
} from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { inquiryService } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export const Contact = () => {
  const { settings } = useSettings();
  const { addToast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const cleanPhone = (settings.phone || '+91 8045811438').replace(/[^\d+]/g, '');
  const cleanWhatsapp = (settings.whatsapp || '+91 9811000000').replace(/[^\d]/g, '');
  const whatsappGreeting = encodeURIComponent(
    `Hello ${settings.companyName || 'LightHut'}, I would like to schedule an architectural consultation and inquire about showroom luminaires.`
  );

  useEffect(() => {
    document.title = `Contact Us & Lighting Showroom | ${settings.companyName || 'LightHut'}`;
  }, [settings.companyName]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || (!formData.phone.trim() && !formData.email.trim())) {
      addToast('Please provide your name and phone number or email.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const submissionData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || `${formData.phone.replace(/[^0-9]/g, '') || 'lead'}@inquiry.lighthut.com`,
        company: formData.company.trim(),
        message: formData.message.trim() || 'Direct architectural lighting inquiry from website',
      };
      await inquiryService.createInquiry(submissionData);
      setSubmitted(true);
      addToast('Inquiry received! Our team will get back to you shortly.', 'success');
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
    } catch (err) {
      addToast('Failed to submit message. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen">
      {/* ── COMPACT HERO BANNER SECTION (Image & Heading Only) ── */}
      <section className="relative pt-28 pb-10 sm:pt-32 sm:pb-14 border-b border-neutral-200 overflow-hidden bg-neutral-950">
        {/* Architectural Background Photography */}
        <div className="absolute inset-0 z-0">
          <img
            src="/contact-banner-lighthut.jpg"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/showroom-hero-hd.jpg';
            }}
            alt="LightHut Decorative Solutions Showroom"
            className="w-full h-full object-cover object-center filter brightness-[0.82] contrast-[1.05]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-xs font-medium text-neutral-300 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
            <span className="text-[#DC2626] font-semibold">Contact Us</span>
          </nav>

          {/* Heading Only: Contact Us */}
          <h1 className="text-3xl sm:text-5xl font-serif-luxury font-bold text-white tracking-tight drop-shadow-md">
            Contact Us
          </h1>
        </div>
      </section>


      {/* ── MAIN CONTENT: CONTACT DETAILS & INQUIRY FORM ── */}
      <div id="inquiry-form" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Contacts */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-8 rounded-2xl bg-white border border-neutral-200 space-y-6 shadow-sm">
              <div>
                <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block mb-1">
                  Experience Center
                </span>
                <h3 className="font-serif-luxury text-xl text-neutral-900 font-bold">
                  {settings.companyName || 'Lighting Studio'}
                </h3>
              </div>

              {/* Official Address */}
              <div className="flex items-start gap-3.5 text-xs text-neutral-600">
                <MapPin className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                <div className="space-y-2 flex-1">
                  <div>
                    <strong className="text-neutral-900 block mb-0.5">Showroom & Works Address</strong>
                    <p className="text-neutral-700 leading-relaxed font-normal">
                      <span className="font-semibold text-neutral-900">M/S LIGHT-HUT DECORATIVE SOLUTIONS</span><br />
                      C37/4, Lawrence Road, Industrial Area<br />
                      New Delhi - 110035<br />
                      <span className="text-neutral-500 text-[11px]">(Near Metro Station Kanhaiya Nagar)</span>
                    </p>
                  </div>
                  <a
                    href="https://maps.google.com/maps?q=28.678613662719727%2C77.15131378173828&z=17&hl=en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-[#DC2626] font-semibold text-[11px] transition-colors border border-red-200/80 shadow-2xs group"
                  >
                    <MapPin className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                </div>
              </div>

              {/* Official Email */}
              <div className="flex items-start gap-3.5 text-xs text-neutral-600">
                <Mail className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block mb-0.5">Email Inquiries</strong>
                  <a href="mailto:lighthutdecorativedlh@gmail.com" className="hover:text-[#DC2626] font-medium transition-colors">
                    lighthutdecorativedlh@gmail.com
                  </a>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-3.5 text-xs text-neutral-600">
                <Clock className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-900 block mb-0.5">Showroom Operating Hours</strong>
                  <span>Monday – Saturday: 10:00 AM – 7:30 PM</span>
                  <span className="text-neutral-400 block mt-0.5">Closed on Sundays & Holidays</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Project Request Form */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-2xl bg-white border border-neutral-200 shadow-sm">
              {submitted ? (
                <div className="py-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-[#DC2626]" />
                  </div>
                  <h3 className="text-2xl font-serif-luxury text-neutral-900 font-bold mb-2">Message Dispatched</h3>
                  <p className="text-sm text-neutral-600 max-w-md mx-auto mb-6 leading-relaxed">
                    Thank you for contacting us. Our team will review your message and get back to you within one business day.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn-outline-gold px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-luxury"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-serif-luxury text-2xl text-neutral-900 font-bold mb-2">
                    Send Us a Message
                  </h3>
                  <p className="text-xs text-neutral-500 mb-8 leading-relaxed font-normal">
                    Share your requirements, desired lamp designs, or questions below. Our team is happy to assist you!
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-luxury text-neutral-600 mb-1 font-semibold">
                          Your Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Vikram Singhania"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#DC2626] text-sm shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-luxury text-neutral-600 mb-1 font-semibold">
                          Phone / WhatsApp Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98000 00000"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#DC2626] text-sm shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-luxury text-neutral-600 mb-1 font-semibold">
                          Email Address (Optional)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="e.g. vikram@studio.com"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#DC2626] text-sm shadow-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-luxury text-neutral-600 mb-1 font-semibold">
                          Studio / Architecture Firm (Optional)
                        </label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="Studio Architects LLP"
                          className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#DC2626] text-sm shadow-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-luxury text-neutral-600 mb-1 font-semibold">
                        Project Details / Notes (Optional)
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Specify fixture models, project location, finishes, and quantities required..."
                        className="w-full px-4 py-3 rounded-xl bg-white border border-neutral-300 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#DC2626] text-sm resize-none shadow-sm"
                      />
                    </div>

                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-gold w-full sm:w-auto px-10 py-3.5 rounded-xl text-xs font-bold uppercase tracking-luxury flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Transmitting...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" /> Dispatch Inquiry
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── GOOGLE MAPS SHOWROOM & LOCATION SECTION ── */}
        <div className="mt-16 pt-12 border-t border-neutral-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-xs uppercase tracking-luxury text-[#DC2626] font-bold block mb-1">
                Showroom Location
              </span>
              <h3 className="font-serif-luxury text-2xl text-neutral-900 font-bold">
                Visit Light-Hut Decorative Solutions
              </h3>
              <p className="text-xs text-neutral-500 mt-1">
                C37/4, Lawrence Road, Industrial Area, New Delhi - 110035 (Near Metro Station Kanhaiya Nagar)
              </p>
            </div>
            <a
              href="https://maps.google.com/maps?q=28.678613662719727%2C77.15131378173828&z=17&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 hover:bg-[#DC2626] text-white text-xs font-semibold tracking-wide transition-colors shadow-md group shrink-0"
            >
              <MapPin className="w-4 h-4 text-[#DC2626] group-hover:text-white transition-colors" />
              <span>Open in Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Interactive Google Maps Embed */}
          <div className="w-full h-80 sm:h-[400px] rounded-3xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-100 relative">
            <iframe
              title="Light-Hut Decorative Solutions Google Maps Location"
              src="https://maps.google.com/maps?q=28.678613662719727,77.15131378173828&hl=en&z=17&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full filter contrast-105"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
