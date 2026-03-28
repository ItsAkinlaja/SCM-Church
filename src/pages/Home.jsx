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
  const [settings, setSettings] = useState(null);
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
          settingsResponse,
          programmesResponse,
          pamphletResponse,
          eventsResponse,
          announcementsResponse,
          testimoniesResponse,
          leadersResponse,
        ] = await Promise.all([
          supabase.from('settings').select('*').single(),
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

        if (settingsResponse.data) setSettings(settingsResponse.data);
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

  const ministryHighlights = [
    {
      value: `${weeklyProgs.length || 3}+`,
      label: 'Weekly gatherings',
    },
    {
      value: `${monthlyProgs.length || 3}+`,
      label: 'Monthly expressions',
    },
    {
      value: `${testimonies.length || 3}+`,
      label: 'Recent testimonies',
    },
  ];

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
      subtitle: settings?.description || 'Experience the divine presence in an atmosphere of reverence and love.',
      tag: 'Successful Christian Missions'
    },
    {
      url: 'https://images.unsplash.com/photo-1548625361-195fe5772df8?q=80&w=2072&auto=format&fit=crop',
      title: 'Built on the solid rock of God\'s eternal word.',
      subtitle: settings?.vision || 'Where sound biblical teaching forms the foundation of our faith.',
      tag: 'Our Vision'
    },
    {
      url: 'https://images.unsplash.com/photo-1477617722074-45613a51bf6d?q=80&w=2070&auto=format&fit=crop',
      title: 'United in prayer, strengthened in fellowship.',
      subtitle: settings?.mission || 'Join a community of believers dedicated to kingdom expansion.',
      tag: 'Our Mission'
    },
  ];

  return (
    <div className="bg-[#f8f4ea] text-slate-900">
      <section className="relative h-[90vh] min-h-[700px] w-full overflow-hidden bg-[#071126] text-white">
        {/* Slideshow Images */}
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.url}
              alt="Church architecture"
              className={`h-full w-full object-cover transition-transform duration-[10000ms] ease-linear ${
                index === currentSlide ? 'scale-110' : 'scale-100'
              } opacity-40`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071126] via-[#071126]/40 to-transparent" />
          </div>
        ))}

        {/* Hero Content Overlay */}
        <div className="relative flex h-full items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="max-w-3xl">
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/8 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.32em] text-[#d96858]">
                  Successful Christian Missions
                </div>
                <h1 className="max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight transition-all duration-700 sm:text-7xl lg:text-8xl">
                  {slides[currentSlide].title}
                </h1>
                <p className="mt-8 max-w-2xl text-lg leading-8 text-white/80 transition-all duration-700 sm:text-xl">
                  {slides[currentSlide].subtitle}
                </p>

                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    to="/about"
                    className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#f4c542] px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#071126] transition hover:bg-[#ffd86c]"
                  >
                    Discover Our Ministry
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    to="/prayer-request"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-[#f4c542]/60 hover:bg-white/14"
                  >
                    Submit Prayer Request
                  </Link>
                </div>

                {/* Slideshow Indicators */}
                <div className="mt-12 flex gap-3">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        index === currentSlide ? 'w-12 bg-[#f4c542]' : 'w-4 bg-white/30 hover:bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="hidden lg:flex lg:items-center">
                <div className="w-full space-y-6 rounded-[2.5rem] border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl transition-all duration-700 hover:bg-white/10">
                  <div className="flex items-center justify-between border-b border-white/10 pb-6">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d96858]">Next Service</p>
                      <h2 className="mt-2 text-2xl font-bold">House of Worship</h2>
                    </div>
                    <div className="rounded-2xl bg-[#f4c542]/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4c542]">
                      Sunday 8:30am
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-sm font-medium leading-7 text-white/70">
                      Join us for a life-transforming encounter with the Word and a time of heartfelt praise and prayer.
                    </p>
                    <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-[#d96858]">
                      <Landmark size={16} />
                      Ministry Headquarters
                    </div>
                  </div>

                  <div className="rounded-3xl bg-[#f4c542] p-6 text-[#071126]">
                    <div className="flex items-center gap-3">
                      <Quote size={20} className="opacity-40" />
                      <p className="text-sm font-bold italic leading-6">
                        "Developing spiritual leaders of excellence to take the gospel to the world."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="relative py-20 z-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-3">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div
                  key={pillar.title}
                  className="rounded-[2rem] border border-[#e7dcc2] bg-white px-7 py-8 shadow-[0_20px_70px_rgba(7,17,38,0.08)]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fde5df] text-[#b53a2d]">
                    <Icon size={26} />
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-slate-900">{pillar.title}</h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="overflow-hidden py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div className="relative">
              <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-[#f4c542]/10 blur-3xl" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[3rem] border-8 border-white shadow-2xl">
                {go?.photo_url && go.photo_url !== 'blog_img' ? (
                  <img
                    src={go.photo_url}
                    alt={go.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src="https://ik.imagekit.io/scmchurch/Professor%20R.%20A.%20Adedoyin.jpg"
                    alt="Pastor Prof. Rufus A. Adedoyin"
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071126]/60 to-transparent" />
                <div className="absolute bottom-8 left-8 right-8">
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#f4c542]">General Overseer</p>
                  <h3 className="mt-2 text-2xl font-bold text-white">{go?.name || 'Pastor Prof. Rufus A. Adedoyin'}</h3>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#b53a2d]/10 bg-[#b53a2d]/5 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.32em] text-[#b53a2d]">
                A Message of Hope
              </div>
              <h2 className="text-4xl font-bold leading-[1.15] tracking-tight text-slate-900 sm:text-5xl">
                Welcome to a place where faith finds expression.
              </h2>
              <div className="mt-8 space-y-6 text-lg leading-8 text-slate-600">
                <p>
                  {go?.bio ||
                    'Successful Christian Missions (SCM) is a global ministry dedicated to raising spiritual leaders of excellence and taking the message of Christ to the world. We believe in the transformative power of God’s Word and the importance of a vibrant prayer life.'}
                </p>
                <p>
                  Whether you are joining us for the first time or looking for a spiritual home, we welcome you with open arms. Together, we are building a community of believers who are passionate about God and committed to fulfilling His purpose on earth.
                </p>
              </div>
              <div className="mt-10 flex items-center gap-6">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#b53a2d] transition hover:text-[#982b20]"
                >
                  Our Core Values
                  <ArrowRight size={18} />
                </Link>
                <div className="h-10 w-px bg-slate-200" />
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#f4c542]/20 flex items-center justify-center">
                    <Quote size={18} className="text-[#071126]" />
                  </div>
                  <span className="text-sm font-bold italic text-[#071126]">"Leading with Excellence"</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ministry Life / Programmes Section */}
      <section className="relative overflow-hidden py-24">
        {/* Background Decorative Elements */}
        <div className="absolute right-0 top-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-[#f4c542]/5 blur-3xl" />
        <div className="absolute left-0 bottom-1/4 -z-10 h-[400px] w-[400px] rounded-full bg-[#b53a2d]/5 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#b53a2d]">Rhythm of Worship</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">Our weekly & monthly gatherings</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              Join us in any of our scheduled services designed to deepen your spiritual walk and foster genuine community.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Weekly Activities */}
            <div className="group relative overflow-hidden rounded-[3rem] bg-white p-8 shadow-[0_24px_80px_rgba(7,17,38,0.06)] transition-all duration-500 hover:shadow-[0_32px_96px_rgba(7,17,38,0.1)] lg:p-12">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Weekly Activities</h3>
                  <div className="mt-2 h-1 w-12 bg-[#b53a2d] transition-all duration-500 group-hover:w-24" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fbf7eb] text-[#b53a2d]">
                  <CalendarDays size={24} />
                </div>
              </div>

              <div className="space-y-6">
                {weeklyProgs.length > 0 ? (
                  weeklyProgs.map((item, index) => (
                    <div
                      key={item.id || `${item.title}-${item.day_of_week}-${item.time}-${index}`}
                      className="group/item relative flex items-center justify-between gap-6 rounded-[2rem] border border-[#f1e9d5] bg-white p-6 transition-all duration-300 hover:border-[#b53a2d]/30 hover:bg-[#fbf7eb]"
                    >
                      <div className="flex items-center gap-5">
                        <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-[#071126] text-white shadow-lg">
                          <span className="text-[10px] font-bold uppercase leading-none opacity-60">Day</span>
                          <span className="mt-1 text-sm font-bold">{item.day_of_week?.slice(0, 3) || 'Wkly'}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 group-hover/item:text-[#b53a2d] transition-colors">{item.title}</h4>
                          <p className="text-sm text-slate-500">{item.day_of_week ? `Every ${item.day_of_week}` : 'Consistent Gathering'}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 text-sm font-bold text-[#b53a2d]">
                          <Clock3 size={14} />
                          {item.time}
                        </div>
                        <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Join Us</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[2rem] border-2 border-dashed border-[#f1e9d5] px-8 py-12 text-center text-slate-500">
                    <p>Our weekly activities are being updated. Check back soon for the full schedule.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Monthly Expressions */}
            <div className="group relative overflow-hidden rounded-[3rem] bg-[#071126] p-8 shadow-[0_24px_80px_rgba(7,17,38,0.2)] lg:p-12">
              <div className="absolute right-0 top-0 h-32 w-32 translate-x-16 -translate-y-16 rounded-full bg-[#d96858]/10 blur-2xl" />
              
              <div className="relative mb-10 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white">Monthly Expressions</h3>
                  <div className="mt-2 h-1 w-12 bg-[#d96858] transition-all duration-500 group-hover:w-24" />
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-[#d96858]">
                  <Users size={24} />
                </div>
              </div>

              <div className="relative space-y-6">
                {monthlyProgs.length > 0 ? (
                  monthlyProgs.map((item, index) => (
                    <div
                      key={item.id || `${item.title}-${item.day_of_week}-${item.time}-${index}`}
                      className="group/item relative flex items-center justify-between gap-6 rounded-[2rem] border border-white/5 bg-white/5 p-6 transition-all duration-300 hover:border-[#d96858]/30 hover:bg-white/10"
                    >
                      <div className="flex items-center gap-5">
                        <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl bg-[#d96858] text-white shadow-lg shadow-[#d96858]/20">
                          <span className="text-[10px] font-bold uppercase leading-none opacity-80">Freq</span>
                          <span className="mt-1 text-sm font-bold">Mthly</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-white group-hover/item:text-[#d96858] transition-colors">{item.title}</h4>
                          <p className="text-sm text-white/50">{item.day_of_week || 'Monthly Special Gathering'}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-2 text-sm font-bold text-[#d96858]">
                          <Clock3 size={14} />
                          {item.time}
                        </div>
                        <span className="mt-1 text-[10px] font-bold uppercase tracking-wider text-white/30">Don't Miss</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[2rem] border-2 border-dashed border-white/10 px-8 py-12 text-center text-white/40">
                    <p>Monthly ministry moments will be displayed here as they are announced.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-12 text-center">
                <Link
                  to="/events"
                  className="inline-flex items-center gap-3 rounded-full bg-white/5 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
                >
                  View All Events
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#071126] py-32 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#d96858]">
                Kingdom Calendar
              </div>
              <h2 className="text-4xl font-bold tracking-tight sm:text-6xl">Moments to worship together</h2>
              <p className="mt-6 text-lg leading-8 text-white/60">
                Every gathering is an opportunity to encounter God, grow in the Word, and build lasting spiritual fellowship.
              </p>
            </div>
            <Link
              to="/events"
              className="group inline-flex items-center gap-3 rounded-full bg-[#d96858] px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#ef9487]"
            >
              See All Events
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-20 grid gap-8 md:grid-cols-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <article
                  key={event.id}
                  className="group relative flex flex-col overflow-hidden rounded-[3rem] border border-white/10 bg-white/5 transition-all duration-500 hover:bg-white/10 hover:shadow-2xl hover:shadow-black/40"
                >
                  <div className="aspect-[16/11] overflow-hidden">
                    {event.banner_url ? (
                      <img
                        src={event.banner_url}
                        alt={event.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-white/5">
                        <CalendarDays size={48} className="text-white/10" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-8">
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#d96858]" />
                      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#d96858]">
                        {formatDate(event.date, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    <h3 className="mt-4 text-2xl font-bold group-hover:text-[#d96858] transition-colors">{event.title}</h3>
                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/50">
                      {event.description || 'Join us for a meaningful gathering filled with worship, teaching, and fellowship.'}
                    </p>
                    <div className="mt-auto pt-8">
                      <Link to={`/events`} className="text-[11px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors">
                        Event Details →
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[3rem] border-2 border-dashed border-white/10 bg-white/5 px-8 py-20 text-center text-white/40 md:col-span-3">
                <CalendarDays size={48} className="mx-auto mb-6 text-white/10" />
                <p className="text-lg">Upcoming event information will appear here soon.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Study Materials & Announcements */}
      <section className="bg-[#fbf7eb] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Latest Study Material */}
            <div className="relative overflow-hidden rounded-[3rem] bg-white p-10 shadow-[0_24px_80px_rgba(7,17,38,0.04)]">
              <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-[#f4c542]/10 blur-3xl" />
              
              <div className="relative">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fde5df] text-[#b53a2d]">
                  <BookOpenText size={32} />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#b53a2d]">Weekly Study Guide</p>
                <h3 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">
                  {latestPamphlet ? latestPamphlet.title : 'Deepen your knowledge of the Word'}
                </h3>
                <p className="mt-6 text-lg leading-8 text-slate-600">
                  {latestPamphlet
                    ? `Our latest teaching pamphlet for the week of ${formatDate(latestPamphlet.week_date, { month: 'long', day: 'numeric', year: 'numeric' })} is now available for download.`
                    : 'Access our weekly study materials and ministry guides to stay grounded in sound biblical teaching throughout the week.'}
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link
                    to="/study-material"
                    className="inline-flex items-center gap-2 rounded-full bg-[#071126] px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#102042]"
                  >
                    Download Latest Guide
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </div>
            </div>

            {/* Ministry Updates */}
            <div className="relative overflow-hidden rounded-[3rem] border border-[#f1e9d5] bg-white/50 p-10 backdrop-blur-sm">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#b53a2d]">Latest Updates</p>
                  <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Ministry Announcements</h3>
                </div>
                <Megaphone className="text-[#b53a2d]" size={28} />
              </div>

              <div className="space-y-6">
                {announcements.length > 0 ? (
                  announcements.map((announcement) => (
                    <div
                      key={announcement.id}
                      className="group relative rounded-2xl border border-[#f1e9d5] bg-white p-6 transition-all duration-300 hover:border-[#b53a2d]/20 hover:shadow-md"
                    >
                      <h4 className="text-lg font-bold text-slate-900 group-hover:text-[#b53a2d] transition-colors">{announcement.title}</h4>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{announcement.content}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                          {formatDate(announcement.created_at, { dateStyle: 'medium' })}
                        </span>
                        <ChevronRight size={14} className="text-[#b53a2d] opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border-2 border-dashed border-[#f1e9d5] px-6 py-10 text-center text-slate-500">
                    <p>No active announcements at the moment. Please check back later.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Community & Testimonies */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[800px] w-[800px] rounded-full bg-[#f4c542]/5 blur-[120px]" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Prayer Section */}
            <div className="group relative flex flex-col justify-center rounded-[3rem] bg-white p-10 shadow-[0_32px_96px_rgba(7,17,38,0.08)] lg:p-16">
              <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-[#b53a2d]/5 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#b53a2d]">
                Intercession
              </div>
              <h2 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">A church that stands with you.</h2>
              <p className="mt-8 text-lg leading-8 text-slate-600">
                No matter what you're facing, you don't have to carry it alone. Our prayer team is dedicated to standing in faith with you.
              </p>

              <div className="mt-12 space-y-6">
                <div className="flex items-start gap-6 group/item">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fbf7eb] text-[#b53a2d] transition-transform group-hover/item:scale-110">
                    <ShieldCheck size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Total Confidentiality</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Your prayer requests are handled with the utmost discretion and spiritual care.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-6 group/item">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fbf7eb] text-[#b53a2d] transition-transform group-hover/item:scale-110">
                    <Users size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">United in Faith</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      We believe in the corporate power of prayer to bring about divine breakthroughs.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <Link
                  to="/prayer-request"
                  className="inline-flex items-center gap-3 rounded-full bg-[#071126] px-10 py-5 text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-[#102042] hover:shadow-xl"
                >
                  Send Prayer Request
                  <ArrowRight size={18} />
                </Link>
              </div>
            </div>

            {/* Testimonies Section */}
            <div className="flex flex-col">
              <div className="mb-12 flex items-end justify-between">
                <div>
                  <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-[#d96858]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.3em] text-[#d96858]">
                    Praise Reports
                  </div>
                  <h2 className="text-4xl font-bold tracking-tight text-slate-900">God’s faithfulness.</h2>
                </div>
                <Link
                  to="/testimonies"
                  className="hidden text-sm font-bold uppercase tracking-widest text-[#b53a2d] transition hover:text-[#982b20] sm:block"
                >
                  View All →
                </Link>
              </div>

              <div className="grid gap-6">
                {testimonies.length > 0 ? (
                  testimonies.map((testimony) => (
                    <article 
                      key={testimony.id} 
                      className="relative overflow-hidden rounded-[2.5rem] border border-[#f1e9d5] bg-white/50 p-8 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <Quote size={32} className="absolute -right-2 -top-2 text-[#d96858]/10" />
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <div key={star} className="h-1 w-4 rounded-full bg-[#f4c542]" />
                          ))}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{testimony.title}</h3>
                        <p className="mt-4 line-clamp-3 text-base leading-7 text-slate-600 italic">
                          "{testimony.content}"
                        </p>
                        <div className="mt-8 flex items-center justify-between border-t border-[#f1e9d5] pt-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-[#071126] flex items-center justify-center text-white text-xs font-bold">
                              {testimony.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{testimony.name}</p>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                {formatDate(testimony.created_at, { month: 'long', year: 'numeric' })}
                              </p>
                            </div>
                          </div>
                          <Link to="/testimonies" className="text-xs font-bold uppercase tracking-widest text-[#b53a2d]">
                            Read More
                          </Link>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-[2.5rem] border-2 border-dashed border-[#f1e9d5] p-12 text-center text-slate-400">
                    <p>Stories of God's goodness will be shared here to inspire our community.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-8 text-center sm:hidden">
                <Link
                  to="/testimonies"
                  className="text-sm font-bold uppercase tracking-widest text-[#b53a2d]"
                >
                  View All Testimonies →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
