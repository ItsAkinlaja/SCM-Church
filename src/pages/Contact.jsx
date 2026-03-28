import { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter, Send, Clock, Globe, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { supabase } from '../services/supabaseClient';

const Contact = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PageHeader 
        title="Contact Us" 
        subtitle="Have questions, need prayer, or want to join a fellowship? Reach out to us anytime!"
        image="https://images.unsplash.com/photo-1516383740770-fbcc5ccbece0?q=80&w=1074&auto=format&fit=crop"
      />

      {/* Main Contact Section */}
      <section className="py-16 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-8">
               {[
                 { icon: Phone, title: 'Call Us', detail: settings?.phone || '+234 803 382 9978', color: 'bg-scm-blue/10 text-scm-blue' },
                 { icon: Mail, title: 'Email Us', detail: settings?.email || 'info@scm.org.ng', color: 'bg-scm-red/10 text-scm-red' },
                 { icon: MapPin, title: 'Visit Us', detail: settings?.address || 'Irebami Street, Off Fajuyi Road, Ile Ife', color: 'bg-scm-gold/10 text-scm-gold' },
                 { icon: Clock, title: 'Mailing Address', detail: 'Box 1726, lle-Ife, Osun State, Nigeria', color: 'bg-scm-blue/10 text-scm-blue' },
               ].map((item, idx) => (
                 <div key={idx} className="bg-white p-8 rounded-[35px] shadow-2xl border border-gray-100 flex items-start group hover:scale-105 transition-transform duration-500">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mr-6 shrink-0 shadow-lg group-hover:rotate-6 transition-transform duration-500 ${item.color}`}>
                       <item.icon size={28} />
                    </div>
                    <div>
                       <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-2">{item.title}</h3>
                       <p className="text-xl font-black text-gray-900 group-hover:text-scm-blue transition-colors leading-tight">{item.detail}</p>
                    </div>
                 </div>
               ))}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2 bg-gray-50 rounded-[50px] p-12 lg:p-20 shadow-inner border border-gray-100 group">
              <h2 className="text-4xl font-black text-gray-900 mb-4 flex items-center">
                 Send us a Message <Send size={32} className="ml-4 text-scm-red group-hover:translate-x-2 transition-transform duration-500" />
              </h2>
              <p className="text-gray-500 text-lg mb-12 font-medium">Fill out the form below and our team will get back to you shortly.</p>
              
              <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                   <input type="text" className="w-full px-8 py-5 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-medium" placeholder="Your Name" />
                </div>
                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Email Address</label>
                   <input type="email" className="w-full px-8 py-5 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-medium" placeholder="email@example.com" />
                </div>
                <div className="md:col-span-2 space-y-2">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Subject</label>
                   <input type="text" className="w-full px-8 py-5 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-medium" placeholder="How can we help?" />
                </div>
                <div className="md:col-span-2 space-y-2">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Message</label>
                   <textarea rows="6" className="w-full px-8 py-5 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-medium resize-none" placeholder="Write your message here..."></textarea>
                </div>
                <div className="md:col-span-2 pt-6">
                   <button className="w-full md:w-auto px-12 py-6 bg-scm-blue text-white rounded-2xl font-black hover:bg-blue-900 transition-all shadow-xl hover:shadow-scm-blue/40 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center">
                      Send Message <ArrowRight size={20} className="ml-3" />
                   </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="py-24 bg-scm-blue text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-black mb-12 underline decoration-scm-red/40 underline-offset-8">Connect With Us Online</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {[
              { icon: Facebook, name: 'Facebook', handle: '@SCMInternational', color: 'hover:bg-[#1877F2]' },
              { icon: Instagram, name: 'Instagram', handle: '@scm_global', color: 'hover:bg-[#E4405F]' },
              { icon: Twitter, name: 'Twitter', handle: '@SCM_Connect', color: 'hover:bg-[#1DA1F2]' },
              { icon: Globe, name: 'Website', handle: 'www.scm.org.ng', color: 'hover:bg-scm-red' },
            ].map((social, idx) => (
              <div key={idx} className={`group cursor-pointer p-8 rounded-3xl bg-white/5 border border-white/10 ${social.color} transition-all duration-500 transform hover:-translate-y-4 hover:shadow-2xl`}>
                 <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:bg-white group-hover:text-gray-900 transition-all duration-500">
                    <social.icon size={40} />
                 </div>
                 <h4 className="text-xl font-black mb-1">{social.name}</h4>
                 <p className="text-white/40 font-bold group-hover:text-white transition-colors">{social.handle}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-scm-red/20 to-transparent -z-0"></div>
      </section>
    </div>
  );
};

export default Contact;
