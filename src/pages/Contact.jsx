import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Send, Globe, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { supabase } from '../services/supabaseClient';

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

  return (
    <div className="flex flex-col min-h-screen bg-scm-cream">
      <PageHeader 
        title="Get In Touch" 
        subtitle="Connect with our ministry family"
        image="https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0?q=80&w=1074&auto=format&fit=crop"
      />

      {/* Main Contact Section */}
      <section className="py-32 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* Contact Info Cards */}
            <div className="lg:col-span-5 space-y-8">
               <div className="mb-12">
                 <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.4em] text-xs mb-6 block">Contact Details</span>
                 <h2 className="text-4xl md:text-6xl font-serif font-bold text-scm-blue leading-tight mb-8">
                   We're here to <br />
                   <span className="text-scm-accent italic">serve you.</span>
                 </h2>
                 <p className="text-lg text-slate-500 font-medium leading-relaxed">
                   Whether you have a question about our services, need spiritual guidance, or want to share a testimony, we'd love to hear from you.
                 </p>
               </div>

               <div className="grid gap-6">
                 {[
                   { icon: Phone, title: 'Call Us', detail: settings?.phone || '+234 803 382 9978', color: 'text-scm-blue bg-slate-50' },
                   { icon: Mail, title: 'Email Us', detail: settings?.email || 'info@scm.org.ng', color: 'text-scm-red bg-red-50' },
                   { icon: MapPin, title: 'Visit Us', detail: settings?.address || 'Irebami Street, Off Fajuyi Road, Ile Ife', color: 'text-scm-accent bg-amber-50' },
                 ].map((item, idx) => (
                   <div key={idx} className="premium-card p-8 flex items-center group">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-8 shrink-0 transition-all duration-500 group-hover:scale-110 shadow-inner ${item.color}`}>
                         <item.icon size={28} className="stroke-[1.5px]" />
                      </div>
                      <div>
                         <h3 className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-[0.3em] mb-2">{item.title}</h3>
                         <p className="text-xl font-serif font-bold text-scm-blue leading-tight">{item.detail}</p>
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Contact Form - Premium Card */}
            <div className="lg:col-span-7">
              <div className="premium-card bg-white p-12 lg:p-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[80px] -z-0" />
                <div className="relative z-10">
                  <h3 className="text-3xl font-serif font-bold text-scm-blue mb-4">Send a Message</h3>
                  <p className="text-slate-500 font-medium mb-12">Our ministry team typically responds within 24 hours.</p>
                  
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-10" onSubmit={handleSubmit}>
                    <div className="space-y-3">
                       <label className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                       <input required type="text" className="w-full px-0 py-4 bg-transparent border-b-2 border-slate-100 focus:outline-none focus:border-scm-accent transition-all font-serif text-lg text-scm-blue placeholder:text-slate-300" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                       <input required type="email" className="w-full px-0 py-4 bg-transparent border-b-2 border-slate-100 focus:outline-none focus:border-scm-accent transition-all font-serif text-lg text-scm-blue placeholder:text-slate-300" placeholder="email@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                       <label className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Subject</label>
                       <input type="text" className="w-full px-0 py-4 bg-transparent border-b-2 border-slate-100 focus:outline-none focus:border-scm-accent transition-all font-serif text-lg text-scm-blue placeholder:text-slate-300" placeholder="How can we help?" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} />
                    </div>
                    <div className="md:col-span-2 space-y-3">
                       <label className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Message</label>
                       <textarea required rows="4" className="w-full px-0 py-4 bg-transparent border-b-2 border-slate-100 focus:outline-none focus:border-scm-accent transition-all font-serif text-lg text-scm-blue placeholder:text-slate-300 resize-none" placeholder="Write your message here..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})}></textarea>
                    </div>
                    <div className="md:col-span-2 pt-8">
                       <button disabled={status === 'loading' || status === 'success'} className="btn-primary w-full md:w-auto gold-gradient text-scm-blue border-none shadow-2xl shadow-scm-accent/20 flex items-center justify-center group disabled:opacity-70 disabled:cursor-not-allowed">
                          {status === 'loading' ? (
                            <><Loader2 size={20} className="mr-3 animate-spin"/> Sending...</>
                          ) : status === 'success' ? (
                            <><CheckCircle2 size={20} className="mr-3 text-green-600"/> Message Sent!</>
                          ) : (
                            <>Send Message <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" /></>
                          )}
                       </button>
                       {status === 'error' && <p className="text-red-500 mt-4 font-sans text-sm font-medium">There was an error sending your message. Please try again later.</p>}
                    </div>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Social Media Section - Elegant Dark */}
      <section className="py-32 bg-scm-blue text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.4em] text-xs mb-6 block">Stay Connected</span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold mb-20 leading-tight">Join Our Global Community</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {[
              { icon: Facebook, name: 'Facebook', handle: '@SCMInternational' },
              { icon: Instagram, name: 'Instagram', handle: '@scm_global' },
              { icon: Twitter, name: 'Twitter', handle: '@SCM_Connect' },
              { icon: Globe, name: 'Website', handle: 'scmchurch.org' },
            ].map((social, idx) => (
              <div key={idx} className="group cursor-pointer">
                 <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mb-8 mx-auto group-hover:bg-scm-accent group-hover:-translate-y-3 transition-all duration-500 shadow-xl border border-white/10">
                    <social.icon size={36} className="stroke-[1.5px]" />
                 </div>
                 <h4 className="text-xl font-serif font-bold mb-2">{social.name}</h4>
                 <p className="text-slate-400 font-sans font-bold text-[10px] uppercase tracking-widest group-hover:text-scm-accent transition-colors">{social.handle}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
