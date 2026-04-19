import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import {
  ArrowRight,
  BookOpenText,
  CalendarDays,
  ChevronRight,
  Clock3,
  HeartHandshake,
  Landmark,
  MapPin,
  Megaphone,
  Quote,
  ShieldCheck,
  Play,
  Users,
} from 'lucide-react';

const formatDate = (value, options) =>
  new Date(value).toLocaleDateString(undefined, options);

const Home = () => {
  const [latestPamphlet, setLatestPamphlet] = useState(null);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [testimonies, setTestimonies] = useState([]);
  const [go, setGo] = useState(null);
  const [latestSermon, setLatestSermon] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3); // slides.length is 3
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const responses = await Promise.all([
          supabase.from('programmes').select('*').order('occurrence', { ascending: false }),
          supabase.from('weekly_materials').select('*').order('week_date', { ascending: false }).limit(1),
          supabase.from('events').select('*').gte('date', new Date().toISOString().split('T')[0]).order('date', { ascending: true }).limit(3),
          supabase.from('announcements').select('*').order('created_at', { ascending: false }).limit(3),
          supabase.from('testimonies').select('*').eq('is_approved', true).order('created_at', { ascending: false }).limit(3),
          supabase.from('leaders').select('*').ilike('role', '%General Overseer%').limit(1).single(),
          supabase.from('sermons').select('*').order('date', { ascending: false }).limit(1)
        ]);

        if (responses[0].data) setProgrammes(responses[0].data);
        if (responses[1].data?.length) setLatestPamphlet(responses[1].data[0]);
        setUpcomingEvents(responses[2].data || []);
        setAnnouncements(responses[3].data || []);
        setTestimonies(responses[4].data || []);
        if (responses[5].data) setGo(responses[5].data);
        if (responses[6].data?.length) setLatestSermon(responses[6].data[0]);
      } catch (err) {
        console.error('Error fetching home data:', err);
      }
    };

    fetchHomeData();
  }, []);

  const weeklyProgs = programmes.filter((programme) => programme.occurrence === 'Weekly');
  const monthlyProgs = programmes.filter((programme) => programme.occurrence === 'Monthly');

  const pillars = [
    {
      title: 'Worship',
      description: 'Reverent gatherings designed for heartfelt praise, spiritual renewal, and genuine fellowship.',
      icon: Landmark,
    },
    {
      title: 'Word',
      description: 'Bible-based teaching that forms disciples, strengthens conviction, and builds mature believers.',
      icon: BookOpenText,
    },
    {
      title: 'Prayer',
      description: 'A praying church where burdens are shared, faith is stirred, and lives are lifted before God.',
      icon: HeartHandshake,
    },
  ];

  const slides = [
    {
      url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2073&auto=format&fit=crop',
      title: 'A beautiful church home for worship, word, and prayer.',
      subtitle: 'Successful Christian Missions International is a Pentecostal church founded in Ile-Ife, Nigeria, dedicated to ministering the gospel through Worship, Word, and Prayer.',
      tag: 'Successful Christian Missions'
    },
    {
      url: 'https://ik.imagekit.io/scmchurch/daniel-schaffer-arwwg4geM2A-unsplash.jpg',
      title: 'Built on the solid rock of God\'s eternal word.',
      subtitle: 'Our teachings center on salvation, holiness, the kingdom of God, peace, love, and hope as revealed by the Holy Spirit.',
      tag: 'Our Vision'
    },
    {
      url: 'https://ik.imagekit.io/scmchurch/jametlene-reskp-YUVZOGlHfdk-unsplash.jpg',
      title: 'United in prayer, strengthened in fellowship.',
      subtitle: 'Join a community of believers dedicated to kingdom expansion and spiritual excellence since July 18, 1999.',
      tag: 'Our Mission'
    },
  ];

  return (
    <div className="bg-scm-cream text-slate-900 overflow-x-hidden">
      {/* Premium Hero Section */}
      <section className="relative min-h-[100dvh] w-full bg-scm-blue text-white">
        {/* Slideshow */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
              index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110'
            }`}
          >
            <img
              src={slide.url}
              alt="Church architecture"
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-scm-blue/80 via-transparent to-scm-blue" />
          </div>
        ))}

        {/* Hero Content */}
        <div className="relative h-full flex flex-col justify-center pt-16 pb-12 md:pb-20">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-4 md:mt-12 text-left">
            <div className="max-w-4xl mx-0">
              <div className="overflow-hidden mb-6">
                <span className="inline-block text-scm-accent font-sans font-semibold uppercase tracking-[0.4em] text-xs sm:text-sm tracking-widest">
                  Successful Christian Missions
                </span>
              </div>
              
              <h1 className="text-[2.5rem] leading-[1.1] sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold tracking-tight mb-4 md:mb-6 animate-fade-in">
                {slides[currentSlide].title}
              </h1>
              
              <p className="text-[15px] sm:text-base md:text-xl text-slate-300 max-w-xl leading-relaxed mb-8 animate-fade-in [animation-delay:200ms] pr-2 sm:pr-0">
                {slides[currentSlide].subtitle}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fade-in [animation-delay:400ms] w-full sm:w-auto">
                <Link to="/about" className="btn-primary border-none text-[14px] w-full sm:w-auto text-center justify-center py-3.5">
                  Discover Our Ministry
                  <ArrowRight size={18} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/prayer-request" className="border border-white/50 text-white px-6 py-3.5 rounded-xl font-semibold tracking-wide hover:bg-white hover:text-scm-blue transition-all duration-300 active:scale-95 text-[14px] inline-flex items-center justify-center w-full sm:w-auto">
                  Submit Prayer Request
                </Link>
              </div>

              {/* Indicators */}
              <div className="absolute bottom-12 left-4 sm:left-6 lg:left-8 hidden sm:flex gap-4">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`group relative h-12 w-1 overflow-hidden rounded-full transition-all duration-500 ${
                      index === currentSlide ? 'h-20 bg-scm-accent' : 'bg-white/20 hover:bg-white/40'
                    }`}
                  >
                    <span className="sr-only">Slide {index + 1}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan A Visit - New Visitor Module */}
      <section className="py-12 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-[#050b14] rounded-[1.5rem] md:rounded-[2rem] overflow-hidden flex flex-col-reverse md:flex-row shadow-2xl">
            <div className="md:w-1/2 p-8 sm:p-12 lg:p-20 flex flex-col justify-center text-white">
              <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4 block">New Here?</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 md:mb-6 leading-tight">Plan Your Visit This Sunday</h2>
              <p className="text-slate-400 font-sans leading-relaxed mb-8 md:mb-10 max-w-md text-sm md:text-base">
                We'd love to host you. Join us for a powerful time of worship, community, and the timeless truth of God's Word. 
              </p>
              <div className="space-y-6 mb-10 font-sans text-[13px]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                    <Clock3 size={16} className="text-scm-accent" />
                  </div>
                  <div>
                    <strong className="block text-white mb-0.5">Service Times</strong>
                    <span className="text-slate-400">Sundays at 8:30 AM</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center shrink-0">
                    <MapPin size={16} className="text-scm-accent" />
                  </div>
                  <div>
                    <strong className="block text-white mb-0.5">Location</strong>
                    <span className="text-slate-400">Irebami Street, Ile Ife</span>
                  </div>
                </div>
              </div>
              <div>
                <Link to="/contact" className="bg-white text-[#050b14] px-8 py-5 inline-flex items-center font-sans font-bold uppercase tracking-widest text-[11px] hover:bg-scm-accent hover:text-white transition-colors">
                  Get Directions <ArrowRight size={14} className="ml-3" />
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 relative min-h-[250px] md:min-h-[400px]">
              <img src="https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80" alt="Welcome Team" className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section - Modern Card Layout */}
      <section className="py-12 md:py-16 relative bg-scm-cream/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-3 md:mb-4 block">Our Foundations</span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-scm-blue mb-4 md:mb-6 leading-tight">The Three Pillars of Our Ministry</h2>
            <div className="w-16 md:w-24 h-1 bg-scm-accent mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-10">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="premium-card group p-8 md:p-12 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-scm-light text-scm-blue flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-scm-blue group-hover:text-white transition-all duration-500">
                    <Icon size={28} className="stroke-[1.5px]" />
                  </div>
                  <h3 className="text-2xl font-serif font-bold mb-4">{pillar.title}</h3>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    {pillar.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* General Overseer Section - Premium Editorial Look */}
      {go && (
        <section className="py-12 md:py-16 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-full md:w-1/2 h-full bg-slate-50/50 skew-y-6 md:-skew-x-12 md:translate-x-1/4 pointer-events-none" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-10 md:gap-20 items-center">
              <div className="relative group">
                <div className="relative rounded-[2rem] overflow-hidden aspect-[4/5] shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
                  <img 
                    src="https://ik.imagekit.io/scmchurch/Professor%20R.%20A.%20Adedoyin.jpg?updatedAt=1774710168274" 
                    alt={go.name || "General Overseer"} 
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                {/* Floating Badge */}
                <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] hidden md:block border border-slate-50 backdrop-blur-md">
                  <Quote size={32} className="text-scm-accent mb-3 opacity-80" />
                  <p className="text-sm font-sans font-medium text-slate-600 max-w-[200px]">
                    "Leading souls to eternal excellence through Christ."
                  </p>
                </div>
              </div>

              <div className="text-center md:text-left">
                <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-3 md:mb-4 block">Our Spiritual Leader</span>
                <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-scm-blue mb-6 md:mb-8 leading-tight">
                  Meet {go.name}
                </h2>
                <div className="space-y-6 text-base md:text-lg text-slate-600 leading-relaxed font-medium">
                  <p>{go.bio || "A visionary leader dedicated to spiritual excellence and kingdom expansion."}</p>
                  <p className="text-scm-blue font-serif italic text-xl border-l-4 border-scm-accent pl-6 py-2">
                    "Our mission is to build a community where every soul finds purpose, peace, and power in God's presence."
                  </p>
                </div>
                <div className="mt-8 md:mt-12">
                  <Link to="/leadership" className="btn-primary w-full md:w-auto inline-flex justify-center">
                    View Leadership Team
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Latest Message Media Block */}
      <section className="py-20 bg-[#050b14] relative text-white border-t border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col md:flex-row justify-between items-center md:items-end gap-6 text-center md:text-left">
            <div>
              <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-3 md:mb-4 block">Watch Online</span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold">Catch Up On The Word</h2>
            </div>
            <Link to="/study-material" className="text-[11px] font-sans font-bold uppercase tracking-[0.2em] hover:text-scm-accent transition-colors flex items-center pt-2 md:pt-0 mx-auto md:mx-0 bg-white/5 md:bg-transparent px-6 py-3 md:px-0 md:py-0 rounded-full md:rounded-none">
              All Media <ArrowRight size={14} className="ml-2" />
            </Link>
          </div>
          
          <a 
            href={latestSermon?.video_url || '#'} 
            target="_blank" 
            rel="noreferrer"
            className="relative aspect-video w-full rounded-none md:rounded-2xl overflow-hidden group cursor-pointer border border-white/5 bg-slate-900 shadow-2xl block"
          >
            <img 
              src={latestSermon?.thumbnail_url || "https://images.unsplash.com/photo-1551829142-d9b8e5fa666e?auto=format&fit=crop&q=80"} 
              alt="Latest Sermon" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-700 group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050b14]/90 via-[#050b14]/30 to-transparent" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-scm-accent group-hover:border-scm-accent transition-all duration-500 scale-90 group-hover:scale-100 shadow-2xl">
                <Play fill="currentColor" size={28} className="ml-1 text-white" />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-12">
              <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur border border-white/10 text-white text-[9px] font-sans font-bold uppercase tracking-widest mb-3 md:mb-4 rounded-md">Latest Message</div>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold mb-2 md:mb-3 tracking-tight">
                {latestSermon?.title || "The Power of Unwavering Faith"}
              </h3>
              <p className="text-slate-400 font-sans text-xs sm:text-sm">
                {latestSermon ? `${latestSermon.preacher} • ${latestSermon.service_type}` : `Pastor (Prof.) Rufus A. Adedoyin • Sunday Service`}
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* Upcoming Events - Clean List Style */}
      <section className="py-12 md:py-16 bg-scm-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 md:mb-12 gap-6 md:gap-8 text-center md:text-left">
            <div className="max-w-2xl">
              <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-3 md:mb-4 block">Join Our Gatherings</span>
              <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-scm-blue">Upcoming Events</h2>
            </div>
            <Link to="/events" className="btn-outline group w-full md:w-auto flex justify-center mt-2 md:mt-0">
              View All Events
              <ArrowRight size={18} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid gap-6 md:gap-8">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <div key={event.id} className="premium-card flex flex-col md:flex-row items-center p-8 md:p-12 group hover:bg-white transition-all">
                  <div className="flex flex-col items-center justify-center text-center px-10 md:border-r border-slate-100 mb-8 md:mb-0">
                    <span className="text-5xl font-serif font-bold text-scm-blue block mb-2">
                      {new Date(event.date).getDate()}
                    </span>
                    <span className="text-scm-accent font-sans font-bold uppercase tracking-widest text-sm">
                      {new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}
                    </span>
                  </div>
                  
                  <div className="md:px-12 flex-1">
                    <h3 className="text-2xl font-serif font-bold text-scm-blue mb-4 group-hover:text-scm-accent transition-colors">
                      {event.title}
                    </h3>
                    <div className="flex flex-wrap gap-6 text-slate-500 font-medium">
                      <div className="flex items-center gap-2">
                        <Clock3 size={18} className="text-scm-accent" />
                        <span>{event.time || '10:00 AM'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-scm-accent" />
                        <span>{event.location || 'Main Sanctuary'}</span>
                      </div>
                    </div>
                  </div>

                  <Link to="/events" className="mt-8 md:mt-0 p-4 rounded-full bg-slate-50 text-scm-blue hover:bg-scm-blue hover:text-white transition-all duration-300">
                    <ChevronRight size={24} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100">
                <p className="text-slate-400 font-serif italic text-xl">New events coming soon. Stay tuned.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Ministries Connect Section */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-4 block">Connect & Grow</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-[#050b14]">Find Your Community</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Ministry Card 1 */}
            <div className="group relative aspect-[4/5] overflow-hidden bg-slate-900 cursor-pointer">
              <img src="https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80" alt="Youth Ministry" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-all duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1 sm:mb-2">Youth Ministry</h3>
                <p className="text-slate-300 font-sans text-xs sm:text-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100">Empowering the next generation.</p>
              </div>
            </div>

            {/* Ministry Card 2 */}
            <div className="group relative aspect-[4/5] overflow-hidden bg-slate-900 cursor-pointer">
              <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80" alt="Women's Fellowship" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-all duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1 sm:mb-2">Women's Fellowship</h3>
                <p className="text-slate-300 font-sans text-xs sm:text-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100">Building strong pillars of faith.</p>
              </div>
            </div>

            {/* Ministry Card 3 */}
            <div className="group relative aspect-[4/5] overflow-hidden bg-slate-900 cursor-pointer">
              <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80" alt="Men's Fellowship" className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-all duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-8 w-full translate-y-0 md:translate-y-4 md:group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-white mb-1 sm:mb-2">Men's Fellowship</h3>
                <p className="text-slate-300 font-sans text-xs sm:text-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 delay-100">Leading with wisdom and courage.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonies - Clean Airy Section */}
      <section className="py-12 md:py-16 bg-scm-cream relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-10 md:mb-12">
            <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs mb-3 md:mb-4 block">God's Faithfulness</span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold mb-4 md:mb-8 text-scm-blue leading-tight">Voices of Victory</h2>
            <p className="text-slate-500 text-sm md:text-lg font-medium">Real stories of transformation and divine intervention within our community.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {testimonies.map((testimony) => (
              <div key={testimony.id} className="premium-card p-8 md:p-10 relative group border border-slate-100">
                <Quote size={40} className="text-scm-accent absolute top-8 left-8 opacity-20" />
                <div className="relative z-10 pt-4">
                  <p className="text-slate-600 mb-8 font-serif leading-relaxed text-lg">
                    "{testimony.content.substring(0, 150)}..."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-scm-light flex items-center justify-center font-serif font-bold text-scm-blue">
                      {testimony.name[0]}
                    </div>
                    <div>
                      <h4 className="font-serif font-bold text-scm-blue">{testimony.name}</h4>
                      <span className="text-xs text-scm-accent font-bold uppercase tracking-widest">Testifier</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
