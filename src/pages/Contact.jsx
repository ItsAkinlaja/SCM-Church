import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Send, Globe, ArrowRight, Loader2, CheckCircle2, MessageCircle, Clock, ExternalLink, AlertCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { supabase } from '../services/supabaseClient';
import { motion } from 'framer-motion'; // eslint-disable-line no-unused-vars

const Contact = () => {
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const { error } = await supabase.from('messages').insert([formData]);
      
      if (error) throw error;
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('Error sending message:', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const contactMethods = [
    { 
      icon: Phone, 
      title: 'Call Us', 
      detail: settings?.phone || '+234 803 382 9978', 
      description: 'Monday - Friday, 9am - 5pm',
      color: 'text-scm-blue',
      bg: 'bg-blue-50/50'
    },
    { 
      icon: Mail, 
      title: 'Email Us', 
      detail: settings?.email || 'info@scmchurch.org', 
      description: 'Expect a response within 24h',
      color: 'text-[#b53a2d]',
      bg: 'bg-red-50/50'
    },
    { 
      icon: MapPin, 
      title: 'Visit Us', 
      detail: settings?.address || 'Irebami Street, Off Fajuyi Road, Ile Ife', 
      description: 'Find us in the heart of Ile-Ife',
      color: 'text-scm-accent',
      bg: 'bg-amber-50/50'
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfaf2]">
      <PageHeader 
        title="Get In Touch" 
        subtitle="We'd love to hear from you. Our ministry family is always here to listen and pray with you."
        image="https://images.unsplash.com/photo-1523199455310-87b16c0ed111?q=80&w=2070&auto=format&fit=crop"
      />

      {/* Main Contact Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-scm-accent/5 rounded-full blur-[120px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-scm-blue/5 rounded-full blur-[120px] -ml-64 -mb-64" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Contact Info Side */}
            <div className="lg:col-span-5">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-scm-accent/10 text-scm-accent font-sans font-bold uppercase tracking-[0.2em] text-[10px] mb-6">
                  <MessageCircle size={14} className="mr-2" /> Reach Out
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-scm-blue leading-[1.1] mb-8">
                  Let's start a <br />
                  <span className="text-scm-accent italic">conversation.</span>
                </h2>
                <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md">
                  Have a question, a prayer request, or a testimony to share? Fill out the form or use our contact details below.
                </p>
              </motion.div>

              <div className="space-y-6">
                {contactMethods.map((item, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group p-8 rounded-[32px] bg-white border border-slate-100 hover:border-scm-accent/30 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]"
                  >
                    <div className="flex items-start gap-6">
                      <div className={`w-14 h-14 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500`}>
                        <item.icon size={24} strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-sm font-sans font-bold text-slate-400 uppercase tracking-widest mb-1">{item.title}</h3>
                        <p className="text-xl font-serif font-bold text-scm-blue mb-1">{item.detail}</p>
                        <p className="text-sm text-slate-400 font-medium">{item.description}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Contact Form Side */}
            <div className="lg:col-span-7">
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[48px] p-10 md:p-16 lg:p-20 shadow-[0_40px_100px_rgba(7,17,38,0.05)] border border-slate-50 relative overflow-hidden"
              >
                {/* Form Background Accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#fbf7eb] rounded-bl-[120px] -z-0" />
                
                <div className="relative z-10">
                  <div className="mb-12">
                    <h3 className="text-3xl font-serif font-bold text-scm-blue mb-4">Send us a Message</h3>
                    <p className="text-slate-400 font-medium">We'll get back to you as soon as possible.</p>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="relative group">
                        <label className="block text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-scm-accent transition-colors">Full Name</label>
                        <input 
                          required 
                          type="text" 
                          placeholder="Your Name"
                          className="w-full bg-transparent border-b-2 border-slate-100 py-3 focus:outline-none focus:border-scm-accent transition-all font-serif text-lg text-scm-blue placeholder:text-slate-200"
                          value={formData.name} 
                          onChange={(e) => setFormData({...formData, name: e.target.value})} 
                        />
                      </div>
                      <div className="relative group">
                        <label className="block text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-scm-accent transition-colors">Email Address</label>
                        <input 
                          required 
                          type="email" 
                          placeholder="hello@example.com"
                          className="w-full bg-transparent border-b-2 border-slate-100 py-3 focus:outline-none focus:border-scm-accent transition-all font-serif text-lg text-scm-blue placeholder:text-slate-200"
                          value={formData.email} 
                          onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        />
                      </div>
                    </div>

                    <div className="relative group">
                      <label className="block text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-scm-accent transition-colors">Subject</label>
                      <input 
                        required 
                        type="text" 
                        placeholder="How can we help?"
                        className="w-full bg-transparent border-b-2 border-slate-100 py-3 focus:outline-none focus:border-scm-accent transition-all font-serif text-lg text-scm-blue placeholder:text-slate-200"
                        value={formData.subject} 
                        onChange={(e) => setFormData({...formData, subject: e.target.value})} 
                      />
                    </div>

                    <div className="relative group">
                      <label className="block text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-scm-accent transition-colors">Your Message</label>
                      <textarea 
                        required 
                        rows="4" 
                        placeholder="Tell us more about what's on your mind..."
                        className="w-full bg-transparent border-b-2 border-slate-100 py-3 focus:outline-none focus:border-scm-accent transition-all font-serif text-lg text-scm-blue placeholder:text-slate-200 resize-none"
                        value={formData.message} 
                        onChange={(e) => setFormData({...formData, message: e.target.value})} 
                      />
                    </div>

                    <div className="pt-6">
                      <button 
                        type="submit"
                        disabled={status === 'loading' || status === 'success'} 
                        className={`w-full md:w-auto px-12 py-5 rounded-2xl font-sans font-bold uppercase tracking-widest text-xs transition-all duration-500 flex items-center justify-center group shadow-xl ${
                          status === 'success' 
                            ? 'bg-green-500 text-white shadow-green-200' 
                            : 'bg-scm-blue text-white hover:bg-scm-blue/90 shadow-scm-blue/20 hover:-translate-y-1'
                        }`}
                      >
                        {status === 'loading' ? (
                          <><Loader2 size={18} className="mr-3 animate-spin"/> Processing...</>
                        ) : status === 'success' ? (
                          <><CheckCircle2 size={18} className="mr-3"/> Sent Successfully</>
                        ) : (
                          <>Send Message <Send size={18} className="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                        )}
                      </button>
                      
                      {status === 'error' && (
                        <p className="text-red-500 mt-6 font-sans text-sm font-bold bg-red-50 p-4 rounded-xl flex items-center">
                          <AlertCircle size={18} className="mr-2" /> Something went wrong. Please try again.
                        </p>
                      )}
                    </div>
                  </form>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* Stylized Map Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-[64px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.08)] border-8 border-[#fbf7eb]">
            <div className="absolute top-10 left-10 z-20 hidden md:block">
              <div className="bg-white/90 backdrop-blur-md p-8 rounded-[32px] shadow-xl border border-slate-100 max-w-xs">
                <div className="w-12 h-12 bg-scm-accent text-white rounded-2xl flex items-center justify-center mb-6">
                  <Clock size={24} />
                </div>
                <h4 className="text-xl font-serif font-bold text-scm-blue mb-2">Service Times</h4>
                <div className="space-y-3 text-sm text-slate-500 font-medium">
                  <p className="flex justify-between"><span>Sunday Service</span> <span className="text-scm-blue font-bold">8:00 AM</span></p>
                  <p className="flex justify-between"><span>Mid-Week Manna</span> <span className="text-scm-blue font-bold">5:00 PM</span></p>
                  <p className="flex justify-between"><span>Night of Grace</span> <span className="text-scm-blue font-bold">Last Fri</span></p>
                </div>
                <a 
                  href="https://www.google.com/maps?q=Irebami+Street,+Off+Fajuyi+Road,+Ile+Ife" 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-8 flex items-center justify-center w-full py-4 bg-scm-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-scm-blue/90 transition-all"
                >
                  Get Directions <ExternalLink size={14} className="ml-2" />
                </a>
              </div>
            </div>
            <iframe
              title="SCM Church Location Map"
              src="https://www.google.com/maps?q=Irebami+Street,+Off+Fajuyi+Road,+Ile+Ife,+Osun+State,+Nigeria&output=embed"
              width="100%"
              height="600"
              style={{ border: 0, filter: 'grayscale(0.2) contrast(1.1)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Social Connection Section */}
      <section className="py-32 bg-[#071126] text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.4em] text-[10px] mb-6 block">Global Fellowship</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-20 leading-tight">Connect with us <br /><span className="italic text-scm-accent">anywhere in the world.</span></h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {[
              { icon: Facebook, name: 'Facebook', handle: '@SCMInternational', color: 'hover:text-blue-500' },
              { icon: Instagram, name: 'Instagram', handle: '@scm_global', color: 'hover:text-pink-500' },
              { icon: Twitter, name: 'Twitter', handle: '@SCM_Connect', color: 'hover:text-sky-400' },
              { icon: Globe, name: 'Website', handle: 'scmchurch.org', color: 'hover:text-scm-accent' },
            ].map((social, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -15 }}
                className="group cursor-pointer"
              >
                <div className={`w-20 h-20 md:w-28 md:h-28 bg-white/5 rounded-[32px] md:rounded-[48px] flex items-center justify-center mb-8 mx-auto transition-all duration-500 border border-white/10 group-hover:bg-white group-hover:text-[#071126] group-hover:shadow-[0_20px_50px_rgba(255,255,255,0.1)]`}>
                  <social.icon size={32} strokeWidth={1.5} className="md:w-10 md:h-10" />
                </div>
                <h4 className="text-lg md:text-xl font-serif font-bold mb-2">{social.name}</h4>
                <p className="text-white/40 font-sans font-bold text-[10px] uppercase tracking-widest group-hover:text-scm-accent transition-colors">{social.handle}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

