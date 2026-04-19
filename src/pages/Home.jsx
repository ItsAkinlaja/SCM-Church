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
        const [
          programmesResponse,
          pamphletResponse,
          eventsResponse,
          announcementsResponse,
          testimoniesResponse,
          leadersResponse,
        ] = await Promise.all([
          supabase.from('programmes').select('*').order('occurrence', { ascending: false }),
          supabase
            .from('weekly_materials')
            .select('*')
            .order('week_date', { ascending: false })
            .limit(1),
          supabase
            .from('events')
            .select('*')
            .gte('date', new Date().toISOString().split('T')[0])
            .order('date', { ascending: true })
            .limit(3),
          supabase
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(3),
          supabase
            .from('testimonies')
            .select('*')
            .eq('is_approved', true)
            .order('created_at', { ascending: false })
            .limit(3),
          supabase
            .from('leaders')
            .select('*')
            .ilike('role', '%General Overseer%')
            .single(),
        ]);

        if (programmesResponse.data) setProgrammes(programmesResponse.data);
        if (pamphletResponse.data?.length) setLatestPamphlet(pamphletResponse.data[0]);
        setUpcomingEvents(eventsResponse.data || []);
        setAnnouncements(announcementsResponse.data || []);
        setTestimonies(testimoniesResponse.data || []);
        if (leadersResponse.data) setGo(leadersResponse.data);
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
      url: 'https://ik.imagekit.io/scmchurch/edward-cisneros-lpqwPxMVUv0-unsplash.jpg',
      title: 'United in prayer, strengthened in fellowship.',
      subtitle: 'Join a community of believers dedicated to kingdom expansion and spiritual excellence since July 18, 1999.',
      tag: 'Our Mission'
    },
  ];

  return (
    <div className="bg-scm-cream text-slate-900 overflow-x-hidden">
      {/* Premium Hero Section */}
      <section className="relative h-screen min-h-[800px] w-full bg-scm-blue text-white">
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
        <div className="relative h-full flex items-center pt-24">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="overflow-hidden mb-8">
                <span className="inline-block text-scm-accent font-sans font-semibold uppercase tracking-[0.4em] text-sm tracking-widest">
                  Successful Christian Missions
                </span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-serif font-bold leading-[1.05] tracking-tight mb-8 animate-fade-in">
                {slides[currentSlide].title}
              </h1>
              
              <p className="text-lg md:text-xl text-slate-300 max-w-2xl leading-relaxed mb-12 animate-fade-in [animation-delay:200ms]">
                {slides[currentSlide].subtitle}
              </p>

              <div className="flex flex-wrap gap-6 animate-fade-in [animation-delay:400ms]">
                <Link to="/about" className="btn-primary border-none">
                  Discover Our Ministry
                  <ArrowRight size={20} className="inline-block ml-3 group-hover:translate-x-2 transition-transform" />
                </Link>
                <Link to="/prayer-request" className="btn-outline border-white text-white hover:bg-white hover:text-scm-blue">
                  Submit Prayer Request
                </Link>
              </div>

              {/* Indicators */}
              <div className="absolute bottom-12 left-4 sm:left-6 lg:left-8 flex gap-4">
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

      {/* Pillars Section - Modern Card Layout */}
      <section className="py-32 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Our Foundations</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-scm-blue mb-6">The Three Pillars of Our Ministry</h2>
            <div className="w-24 h-1 bg-scm-accent mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="premium-card group p-12 flex flex-col items-center text-center">
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
        <section className="py-32 bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50/50 -skew-x-12 translate-x-1/4 pointer-events-none" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
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

              <div>
                <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Our Spiritual Leader</span>
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-scm-blue mb-8 leading-tight">
                  Meet {go.name}
                </h2>
                <div className="space-y-6 text-lg text-slate-600 leading-relaxed font-medium">
                  <p>{go.bio || "A visionary leader dedicated to spiritual excellence and kingdom expansion."}</p>
                  <p className="text-scm-blue font-serif italic text-xl border-l-4 border-scm-accent pl-6 py-2">
                    "Our mission is to build a community where every soul finds purpose, peace, and power in God's presence."
                  </p>
                </div>
                <div className="mt-12">
                  <Link to="/leadership" className="btn-primary">
                    View Leadership Team
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events - Clean List Style */}
      <section className="py-32 bg-scm-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Join Our Gatherings</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-scm-blue">Upcoming Events</h2>
            </div>
            <Link to="/events" className="btn-outline group">
              View All Events
              <ArrowRight size={18} className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid gap-8">
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

      {/* Testimonies - Clean Airy Section */}
      <section className="py-32 bg-scm-cream relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.3em] text-xs mb-4 block">God's Faithfulness</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-8 text-scm-blue">Voices of Victory</h2>
            <p className="text-slate-500 text-lg font-medium">Real stories of transformation and divine intervention within our community.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonies.map((testimony) => (
              <div key={testimony.id} className="premium-card p-10 relative group border border-slate-100">
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
