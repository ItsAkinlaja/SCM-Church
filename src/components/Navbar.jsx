import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    {
      name: 'Events',
      path: '/events',
      dropdown: [
        { name: 'Church Calendar', path: '/events' },
        { name: 'Upcoming Events', path: '/events#upcoming' },
        { name: 'Past Events', path: '/events#past' },
        { name: 'Gallery', path: '/gallery' },
      ],
    },
    { name: 'Support Us', path: '/support-us' },
    { name: 'Study Guides', path: '/study-material' },
    { name: 'Our Leaders', path: '/leadership' },
    { name: 'Contact', path: '/contact' },
  ];

  const [openDropdown, setOpenDropdown] = useState(null);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'glass-nav shadow-[0_4px_40px_rgba(0,0,0,0.02)]' : 'bg-transparent text-white'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16 md:h-20' : 'h-20 md:h-24'}`}>
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-4 group">
              <img
                src="https://ik.imagekit.io/scmchurch/WhatsApp_Image_2026-03-27_at_05.29.17-removebg-preview.png?updatedAt=1774595668191"
                alt="SCM Church Logo"
                className={`w-auto object-contain transition-all duration-300 ${scrolled ? 'h-10 md:h-14 drop-shadow-xl' : 'h-12 md:h-16'}`}
              />
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative px-3"
                  onMouseEnter={() => link.dropdown && setOpenDropdown(link.name)}
                  onMouseLeave={() => link.dropdown && setOpenDropdown(null)}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center px-2 py-2 text-[15px] font-sans font-medium transition-all duration-300 relative group ${
                      scrolled 
                        ? (isActive(link.path) || openDropdown === link.name ? 'text-scm-blue' : 'text-slate-500 hover:text-scm-blue')
                        : (isActive(link.path) || openDropdown === link.name ? 'text-white' : 'text-white/80 hover:text-white')
                    }`}
                  >
                    {link.name}
                    {link.dropdown && <ChevronDown size={14} className={`ml-1 transition-transform duration-300 ${openDropdown === link.name ? 'rotate-180' : ''}`} />}
                    <span className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ${
                      scrolled ? 'bg-scm-accent' : 'bg-white'
                    } ${isActive(link.path) || openDropdown === link.name ? 'w-full' : 'w-0 group-hover:w-full'}`} />
                  </Link>

                  {link.dropdown && openDropdown === link.name && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-50 p-3 animate-fade-in z-50">
                      {link.dropdown.map(item => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="flex items-center justify-between px-5 py-4 rounded-2xl text-[13px] font-bold text-slate-600 hover:bg-slate-50 hover:text-scm-blue transition-all duration-300 group"
                        >
                          {item.name}
                          <div className="w-1.5 h-1.5 rounded-full bg-scm-accent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center ml-8">
            <Link
              to="/support-us"
              className={`py-3 px-7 text-[14px] font-sans font-bold hover:scale-105 transition-all duration-300 rounded-xl flex items-center justify-center ${
                scrolled 
                  ? 'btn-primary' 
                  : 'bg-white text-scm-blue opacity-95 hover:opacity-100'
              }`}
            >
              Join Us
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(true)}
              className={`inline-flex items-center justify-center p-2 rounded-xl focus:outline-none transition-colors ${
                scrolled ? 'text-gray-500 hover:bg-gray-50' : 'text-white hover:bg-white/10'
              }`}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav - Slider from right to left */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer Content */}
        <div
          className={`absolute top-0 right-0 h-full w-[80%] max-w-xs bg-white shadow-2xl transition-transform duration-500 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-3">
              <img
                src="https://ik.imagekit.io/scmchurch/WhatsApp_Image_2026-03-27_at_05.29.17-removebg-preview.png?updatedAt=1774595668191"
                alt="SCM Church Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 rounded-xl text-gray-400 hover:bg-gray-50 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto p-6 space-y-2">
            {navLinks.map((link) => (
              <div key={link.name}>
                {link.dropdown ? (
                  <div className="w-full">
                    <button
                      onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                      className={`w-full flex justify-between items-center px-4 py-4 rounded-2xl text-base font-black tracking-wide transition-all ${isActive(link.path) || openDropdown === link.name
                          ? 'bg-scm-blue/5 text-scm-blue'
                          : 'text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown size={20} className={`transition-transform ${openDropdown === link.name ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === link.name && (
                      <div className="pl-6 pt-2 pb-2 space-y-1 animate-fade-in-fast">
                        {link.dropdown.map(item => (
                          <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-scm-blue transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-4 rounded-2xl text-base font-black tracking-wide transition-all ${isActive(link.path)
                        ? 'bg-scm-blue/5 text-scm-blue'
                        : 'text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Footer Info */}
          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">SCM International</p>
            <p className="text-[10px] font-bold text-gray-500">Founded July 18, 1999</p>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
