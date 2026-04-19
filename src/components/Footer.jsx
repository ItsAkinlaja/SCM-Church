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

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) setSettings(data);
    };

    fetchSettings();
  }, []);

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
    <footer className="bg-[#050b14] text-white pt-24 pb-8 border-t border-slate-900 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Typographic CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-b border-white/10 pb-16 mb-16 gap-10">
          <div className="max-w-2xl">
            <span className="block text-scm-accent font-sans font-bold uppercase tracking-[0.3em] text-[10px] sm:text-xs mb-6">Next Steps</span>
            <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tight leading-[1.1]">
              Worship with us <br/>this Sunday.
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
            <Link to="/contact" className="bg-white text-[#050b14] px-8 py-5 flex items-center justify-center font-sans font-bold uppercase tracking-widest text-[11px] hover:bg-scm-accent transition-colors">
              Plan A Visit <ArrowRight size={14} className="ml-2" />
            </Link>
            <Link to="/prayer-request" className="border border-white/20 text-white px-8 py-5 flex items-center justify-center font-sans font-bold uppercase tracking-widest text-[11px] hover:bg-white hover:text-[#050b14] transition-colors">
              Prayer Request
            </Link>
          </div>
        </div>

        {/* Structured Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-20 mb-20">
          <div className="md:col-span-4 lg:col-span-5">
            <Link to="/" className="block mb-8">
              <img 
                src="https://ik.imagekit.io/scmchurch/WhatsApp_Image_2026-03-27_at_05.29.17-removebg-preview.png?updatedAt=1774595668191" 
                alt="SCM Church Logo" 
                className="h-20 w-auto object-contain opacity-95 hover:opacity-100 transition-opacity" 
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-8 font-sans">
              {settings?.description || "A Christ-centered ministry committed to discipleship, spiritual formation, and sharing the gospel with clarity and compassion."}
            </p>
            <div className="flex gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.key} href={item.href} target="_blank" rel="noreferrer" className="w-10 h-10 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-white hover:text-[#050b14] transition-colors">
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="md:col-span-4 lg:col-span-3">
            <h4 className="text-white font-sans font-bold uppercase tracking-[0.2em] text-[11px] mb-8">Quick Links</h4>
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

          <div className="md:col-span-4 lg:col-span-4">
            <h4 className="text-white font-sans font-bold uppercase tracking-[0.2em] text-[11px] mb-8">Visit Us</h4>
            <div className="space-y-6 text-slate-400 text-[13px] font-sans leading-relaxed">
               <p className="flex items-start gap-4">
                 <MapPin size={18} className="text-scm-accent shrink-0 mt-0.5 opacity-80" />
                 <span>{settings?.address || 'Irebami Street, Off Fajuyi Road, Ile Ife. Box 1726, lle-Ife, Osun State, Nigeria'}</span>
               </p>
               <p className="flex items-center gap-4">
                 <Phone size={18} className="text-scm-accent shrink-0 opacity-80" />
                 <span>{settings?.phone || '+234 803 382 9978'}</span>
               </p>
            </div>
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
