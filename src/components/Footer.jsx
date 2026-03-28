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
    <footer className="relative overflow-hidden bg-[#071126] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,104,88,0.20),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(244,197,66,0.12),transparent_30%)]" />
      <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-16 sm:px-6 lg:px-8 lg:pt-20">
        <div className="rounded-[2rem] border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.25)] backdrop-blur-sm sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d96858]">Stay Connected</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Worship with us, grow with us, and stay close to ministry life.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
                {settings?.mission ||
                  'Empowering people for a meaningful life in Christ through worship, the Word, and prayer.'}
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row lg:justify-end">
              <Link
                to="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#b53a2d] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#982b20]"
              >
                Contact Us
              </Link>
              <Link
                to="/prayer-request"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 bg-white/6 px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-[#d96858]/60 hover:bg-white/10"
              >
                Send Prayer Request
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.05fr_0.95fr_1fr]">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              {settings?.ministry_logo ? (
                <div className="rounded-2xl bg-white/95 px-4 py-3 shadow-lg">
                  <img src={settings.ministry_logo} alt="Logo" className="h-14 w-auto object-contain sm:h-16" />
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#b53a2d] shadow-lg">
                  <span className="text-xl font-black text-white">SCM</span>
                </div>
              )}
              <div>
                <div className="text-lg font-bold sm:text-xl">
                  {settings?.ministry_name || 'Successful Christian Missions'}
                </div>
                <div className="text-sm font-medium text-white/58">A church family built on worship, word, and prayer.</div>
              </div>
            </div>

            <p className="max-w-xl text-sm leading-7 text-white/68 sm:text-base">
              {settings?.description ||
                'A Christ-centered ministry committed to discipleship, spiritual formation, and sharing the gospel with clarity and compassion.'}
            </p>

            {socialLinks.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.key}
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={item.label}
                      className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/12 bg-white/6 text-white/72 transition hover:-translate-y-1 hover:border-[#d96858]/60 hover:bg-[#b53a2d] hover:text-white"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d96858]">Quick Links</p>
              <div className="mt-5 grid gap-3">
                {quickLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="inline-flex min-h-11 items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-white/78 transition hover:bg-white/8 hover:text-white"
                  >
                    <span>{link.name}</span>
                    <ArrowRight size={16} className="text-[#d96858]" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d96858]">Admin</p>
              <div className="mt-5">
                <Link
                  to="/admin"
                  className="inline-flex min-h-11 items-center justify-between rounded-2xl px-4 py-3 text-sm font-semibold text-white/72 transition hover:bg-white/8 hover:text-white"
                >
                  <span>Open Admin Portal</span>
                  <ArrowRight size={16} className="text-[#d96858]" />
                </Link>
              </div>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/5 p-6 sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d96858]">Contact Details</p>
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-4 rounded-2xl border border-white/8 bg-[#0d1b36] px-4 py-4">
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#b53a2d]/15 text-[#ef9487]">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/42">Address</div>
                  <div className="mt-2 text-sm leading-6 text-white/80 sm:text-base">
                    {settings?.address || 'Irebami Street, Off Fajuyi Road, Ile Ife'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/8 bg-[#0d1b36] px-4 py-4">
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#b53a2d]/15 text-[#ef9487]">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/42">Phone</div>
                  <div className="mt-2 text-sm leading-6 text-white/80 sm:text-base">
                    {settings?.phone || '+234 803 382 9978'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-white/8 bg-[#0d1b36] px-4 py-4">
                <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#b53a2d]/15 text-[#ef9487]">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/42">Email</div>
                  <div className="mt-2 break-words text-sm leading-6 text-white/80 sm:text-base">
                    {settings?.email || 'info@scm.org.ng'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/42">
            &copy; {currentYear} {settings?.ministry_name || 'Successful Christian Missions'}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
