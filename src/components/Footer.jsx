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
    <footer className="relative overflow-hidden bg-scm-blue text-white pt-24 pb-12">
      {/* Premium Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-scm-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-scm-red/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Newsletter / CTA Section */}
        <div className="relative mb-20">
          <div className="gold-gradient p-[1px] rounded-[3rem]">
            <div className="bg-scm-blue rounded-[3rem] px-8 py-12 sm:px-16 sm:py-20 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" />
              <div className="relative z-10 max-w-3xl mx-auto">
                <span className="inline-block text-scm-accent font-sans font-bold uppercase tracking-[0.4em] mb-6">Experience God With Us</span>
                <h2 className="text-4xl sm:text-6xl font-serif font-bold mb-8 leading-tight">
                  Worship with us, grow with us, and stay close to ministry life.
                </h2>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link to="/contact" className="btn-primary bg-white text-scm-blue hover:bg-scm-cream">
                    Contact Us
                  </Link>
                  <Link to="/prayer-request" className="btn-outline border-white text-white hover:bg-white hover:text-scm-blue">
                    Prayer Request
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link to="/" className="block mb-8">
              <img 
                src="https://ik.imagekit.io/scmchurch/WhatsApp_Image_2026-03-27_at_05.29.17-removebg-preview.png?updatedAt=1774595668191" 
                alt="SCM Church Logo" 
                className="h-28 w-auto object-contain drop-shadow-2xl brightness-0 invert opacity-90 hover:opacity-100 transition-opacity" 
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
              {settings?.description || "A Christ-centered ministry committed to discipleship, spiritual formation, and sharing the gospel with clarity and compassion."}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:bg-scm-accent hover:border-scm-accent hover:text-white transition-all duration-300"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-8">Quick Links</h4>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-slate-400 hover:text-scm-accent transition-colors duration-300 text-sm font-medium flex items-center group">
                    <span className="w-0 group-hover:w-4 h-[1px] bg-scm-accent mr-0 group-hover:mr-3 transition-all duration-300" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-8">Our Mission</h4>
            <p className="text-slate-400 text-sm leading-relaxed italic font-serif">
              "{settings?.mission || 'Empowering people for a meaningful life in Christ through worship, the Word, and prayer.'}"
            </p>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-white font-serif font-bold text-lg mb-8">Visit Us</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-scm-accent">
                  <MapPin size={18} />
                </div>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  {settings?.address || 'Irebami Street, Off Fajuyi Road, Ile Ife'}
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shrink-0 text-scm-accent">
                  <Phone size={18} />
                </div>
                <p className="text-slate-400 text-sm font-medium">
                  {settings?.phone || '+234 803 382 9978'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.2em]">
            © {currentYear} Successful Christian Missions International. All Rights Reserved.
          </p>
          <div className="flex gap-8">
            <Link to="/admin" className="text-slate-500 hover:text-white text-[11px] font-bold uppercase tracking-[0.2em] transition-colors">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
