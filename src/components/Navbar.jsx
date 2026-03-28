import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState(null);
  const location = useLocation();

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
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              {settings?.ministry_logo ? (
                <img src={settings.ministry_logo} alt="Logo" className="h-12 object-contain" />
              ) : (
                <div className="w-10 h-10 bg-scm-blue rounded-xl flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                  <span className="text-white font-black text-xl">SCM</span>
                </div>
              )}
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <div 
                  key={link.name} 
                  className="relative"
                  onMouseEnter={() => link.dropdown && setOpenDropdown(link.name)}
                  onMouseLeave={() => link.dropdown && setOpenDropdown(null)}
                >
                  <Link
                    to={link.path}
                    className={`flex items-center text-sm font-bold tracking-wide transition-all relative py-2 group ${
                      isActive(link.path) || openDropdown === link.name
                        ? 'text-scm-blue'
                        : 'text-gray-500 hover:text-scm-blue'
                    }`}
                  >
                    {link.name}
                    {link.dropdown && <ChevronDown size={16} className={`ml-1 transition-transform ${openDropdown === link.name ? 'rotate-180' : ''}`} />}
                  </Link>
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-scm-blue transform transition-transform duration-300 ${isActive(link.path) ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>

                  {link.dropdown && openDropdown === link.name && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-50 p-2 animate-fade-in-fast z-50">
                      {link.dropdown.map(item => (
                        <Link
                          key={item.name}
                          to={item.path}
                          className="block px-4 py-3 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-scm-blue"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-xl text-gray-500 hover:bg-gray-50 focus:outline-none transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <div className={`md:hidden bg-white border-t border-gray-100 shadow-xl overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-screen' : 'max-h-0'}`}>
        <div className="px-4 pt-4 pb-8 space-y-2">
          {navLinks.map((link) => (
            <div key={link.name}>
              {link.dropdown ? (
                <div className="w-full">
                  <button
                    onClick={() => setOpenDropdown(openDropdown === link.name ? null : link.name)}
                    className={`w-full flex justify-between items-center px-4 py-4 rounded-2xl text-base font-black tracking-wide transition-all ${
                      isActive(link.path) || openDropdown === link.name
                        ? 'bg-scm-blue/10 text-scm-blue'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-scm-blue'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronDown size={20} className={`transition-transform ${openDropdown === link.name ? 'rotate-180' : ''}`} />
                  </button>
                  {openDropdown === link.name && (
                    <div className="pl-8 pt-2 pb-2 space-y-2">
                      {link.dropdown.map(item => (
                        <Link
                          key={item.name}
                          to={item.path}
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 hover:text-scm-blue"
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
                  className={`block px-4 py-4 rounded-2xl text-base font-black tracking-wide transition-all ${
                    isActive(link.path)
                      ? 'bg-scm-blue/10 text-scm-blue'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-scm-blue'
                  }`}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
