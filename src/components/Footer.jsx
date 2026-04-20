import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Facebook,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState(null);
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState('idle');

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) setSettings(data);
    };

    fetchSettings();
  }, []);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubStatus('loading');
    try {
      const { error } = await supabase.from('subscribers').insert([{ email }]);
      if (error && error.code !== '23505') throw error; // Ignore duplicate email
      setSubStatus('success');
      setEmail('');
      setTimeout(() => setSubStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setSubStatus('error');
      setTimeout(() => setSubStatus('idle'), 5000);
    }
  };

  const socialLinks = [
    {
      key: 'facebook',
      icon: Facebook,
      href: settings?.social_links?.facebook,
      label: 'Facebook',
    },
    {
      key: 'instagram',
      icon: Instagram,
      href: settings?.social_links?.instagram,
      label: 'Instagram',
    },
    {
      key: 'twitter',
      icon: Twitter,
      href: settings?.social_links?.twitter,
      label: 'Twitter',
    },
    {
      key: 'youtube',
      icon: Youtube,
      href: settings?.social_links?.youtube,
      label: 'YouTube',
    },
  ].filter((item) => item.href);

  const quickLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Events', path: '/events' },
    { name: 'Study Guides', path: '/study-material' },
    { name: 'Prayer Requests', path: '/prayer-request' },
    { name: 'Testimonies', path: '/testimonies' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <footer className="bg-gradient-to-b from-[#050b14] to-black text-white pt-24 pb-8 border-t border-slate-900 mt-20 relative overflow-hidden">
      {/* Subtle watermark or atmospheric touch */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-scm-accent opacity-[0.02] blur-[100px] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Typographic CTA */}
        <div className="flex flex-col md:flex-row items-center justify-between border-b border-white/5 pb-16 mb-16 gap-10 text-center md:text-left">
          <div className="max-w-2xl">
            <span className="block text-scm-accent font-sans font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-4">Next Steps</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight leading-[1.1]">
              Worship with us <br className="hidden md:block" />this Sunday.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
            <Link to="/contact" className="bg-white text-[#050b14] px-8 py-4 sm:py-5 flex items-center justify-center font-sans font-bold uppercase tracking-widest text-[11px] hover:bg-scm-accent hover:text-white transition-all duration-300">
              Plan A Visit <ArrowRight size={14} className="ml-3" />
            </Link>
            <Link to="/prayer-request" className="border border-white/20 text-white px-8 py-4 sm:py-5 flex items-center justify-center font-sans font-bold uppercase tracking-widest text-[11px] hover:bg-white/10 transition-all duration-300">
              Prayer Request
            </Link>
          </div>
        </div>

        {/* Structured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Col */}
          <div className="md:col-span-12 lg:col-span-4 pr-0 lg:pr-8">
            <Link to="/" className="block mb-8">
              <img 
                src="https://ik.imagekit.io/scmchurch/WhatsApp_Image_2026-03-27_at_05.29.17-removebg-preview.png?updatedAt=1774595668191" 
                alt="SCM Church Logo" 
                className="h-16 w-auto object-contain opacity-90 transition-opacity" 
              />
            </Link>
            <p className="text-slate-400 text-[13px] leading-relaxed max-w-sm mb-8 font-sans">
              {settings?.description || "A Christ-centered ministry committed to discipleship, spiritual formation, and sharing the gospel with clarity and compassion."}
            </p>
            <div className="flex gap-2">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.key} href={item.href} target="_blank" rel="noreferrer" className="w-10 h-10 border border-white/10 flex items-center justify-center text-slate-400 hover:border-scm-accent hover:text-white hover:bg-scm-accent/10 transition-all duration-300">
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Col */}
          <div className="md:col-span-4 lg:col-span-2">
            <h4 className="text-white font-sans font-bold uppercase tracking-[0.2em] text-[11px] mb-8 opacity-80">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-slate-400 hover:text-white transition-colors text-[13px] font-sans flex items-center group">
                    <ArrowRight size={12} className="mr-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-scm-accent" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Col */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="text-white font-sans font-bold uppercase tracking-[0.2em] text-[11px] mb-8 opacity-80">Visit Us</h4>
            <div className="space-y-6 text-slate-400 text-[13px] font-sans leading-relaxed">
               <p className="flex items-start gap-4">
                 <MapPin size={16} className="text-scm-accent shrink-0 mt-0.5 opacity-80" />
                 <span>{settings?.address || 'Irebami Street, Off Fajuyi Road, Ile Ife. Box 1726, lle-Ife, Osun State, Nigeria'}</span>
               </p>
               <p className="flex items-center gap-4">
                 <Phone size={16} className="text-scm-accent shrink-0 opacity-80" />
                 <span>{settings?.phone || '+234 803 382 9978'}</span>
               </p>
               <p className="flex items-center gap-4">
                 <Mail size={16} className="text-scm-accent shrink-0 opacity-80" />
                 <span>{settings?.email || 'info@scmchurch.org'}</span>
               </p>
            </div>
          </div>

          {/* Newsletter Col */}
          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="text-white font-sans font-bold uppercase tracking-[0.2em] text-[11px] mb-8 opacity-80">Stay Connected</h4>
            <p className="text-slate-400 text-[13px] font-sans leading-relaxed mb-6">
              Sign up to receive weekly devotionals, upcoming events, and ministry updates directly in your inbox.
            </p>
            <form className="flex flex-col group" onSubmit={handleSubscribe}>
              <div className="flex w-full">
                <input 
                  type="email" 
                  placeholder="Email address" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/5 border border-white/10 px-4 py-3.5 text-[13px] text-white w-full focus:outline-none focus:border-scm-accent/50 transition-colors placeholder:text-slate-500 font-sans" 
                  required
                />
                <button 
                  type="submit" 
                  disabled={subStatus === 'loading' || subStatus === 'success'}
                  className="bg-white text-[#050b14] px-6 py-3.5 font-sans font-bold text-[10px] uppercase tracking-widest hover:bg-scm-accent hover:text-white transition-all duration-300 shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {subStatus === 'loading' ? '...' : subStatus === 'success' ? '✔' : 'Join'}
                </button>
              </div>
              {subStatus === 'success' && <span className="text-scm-accent text-[11px] mt-2 block font-medium">Successfully subscribed!</span>}
              {subStatus === 'error' && <span className="text-red-400 text-[11px] mt-2 block font-medium">Failed to subscribe.</span>}
            </form>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-[10px] font-sans font-bold uppercase tracking-[0.2em]">
            © {currentYear} Successful Christian Missions.
          </p>
          <Link to="/admin" className="text-slate-600 hover:text-white text-[10px] font-sans font-bold uppercase tracking-[0.2em] transition-colors">
            Admin Portal
          </Link>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
