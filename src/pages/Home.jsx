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
        ]);

        if (settingsResponse.data) setSettings(settingsResponse.data);
        if (programmesResponse.data) setProgrammes(programmesResponse.data);
        if (pamphletResponse.data?.length) setLatestPamphlet(pamphletResponse.data[0]);
        setUpcomingEvents(eventsResponse.data || []);
        setAnnouncements(announcementsResponse.data || []);
        setTestimonies(testimoniesResponse.data || []);
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

  return (
    <div className="bg-[#f8f4ea] text-slate-900">
      <section className="relative overflow-hidden bg-[#071126] text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1519491050282-cf00c82424b4?q=80&w=1974&auto=format&fit=crop"
            alt="Church congregation in worship"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(7,17,38,0.98),rgba(7,17,38,0.74),rgba(181,58,45,0.34))]" />
          <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#f4c542]/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#f4c542]/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-16 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/8 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.32em] text-[#d96858]">
              Successful Christian Missions
            </div>
            <h1 className="max-w-4xl text-5xl font-bold leading-[0.92] tracking-tight sm:text-6xl lg:text-8xl">
              A beautiful church home for worship, word, and prayer.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/78 sm:text-xl">
              {settings?.description ||
                'A Christ-centered ministry where people are discipled with clarity, welcomed with love, and strengthened to live for God with conviction.'}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/about"
                className="inline-flex items-center justify-center rounded-full bg-[#f4c542] px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-[#071126] transition hover:bg-[#ffd86c]"
              >
                Discover Our Ministry
              </Link>
              <Link
                to="/prayer-request"
                className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:border-[#f4c542]/60 hover:bg-white/14"
              >
                Submit Prayer Request
              </Link>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              {ministryHighlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-white/10 bg-white/6 px-5 py-6 backdrop-blur-sm"
                >
                  <div className="text-3xl font-bold text-[#d96858]">{item.value}</div>
                  <div className="mt-2 text-sm font-medium text-white/72">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-end">
            <div className="w-full space-y-6 rounded-[2rem] border border-white/10 bg-white/8 p-6 shadow-2xl backdrop-blur-md lg:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#d96858]">This Week</p>
                  <h2 className="mt-2 text-2xl font-bold">House of Worship</h2>
                </div>
                <div className="rounded-2xl bg-[#f4c542] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#071126]">
                  Welcome
                </div>
              </div>

              <div className="space-y-4">
                {(weeklyProgs.slice(0, 3).length ? weeklyProgs.slice(0, 3) : monthlyProgs.slice(0, 3)).map((programme, index) => (
                  <div
                    key={programme.id || `${programme.title}-${programme.day_of_week}-${programme.time}-${index}`}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-[#0e1a31]/90 px-4 py-4"
                  >
                    <div>
                      <div className="text-sm font-bold text-white">{programme.title}</div>
                      <div className="mt-1 text-sm text-white/62">{programme.day_of_week || programme.occurrence}</div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#d96858]">
                      <Clock3 size={14} />
                      {programme.time}
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-[1.75rem] bg-[#f4c542] px-5 py-5 text-[#071126]">
                <p className="text-xs font-bold uppercase tracking-[0.28em]">Our Mission</p>
                <p className="mt-3 text-sm font-semibold leading-7">
                  {settings?.mission ||
                    'Developing spiritual leaders of excellence to take the gospel of Christ to all mankind.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-8 pb-20">
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

      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
          <div className="rounded-[2.5rem] bg-white p-8 shadow-[0_24px_80px_rgba(7,17,38,0.08)] lg:p-10">
            <div className="flex flex-col gap-4 border-b border-[#eee4ce] pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#b53a2d]">Service Rhythm</p>
                <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">A structured ministry life</h2>
              </div>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-slate-700 transition hover:text-[#b53a2d]"
              >
                Explore Calendar
                <ChevronRight size={16} />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2rem] bg-[#fbf7eb] p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900">Weekly Activities</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#b53a2d]">
                    Consistent
                  </span>
                </div>
                <div className="space-y-4">
                  {weeklyProgs.length > 0 ? (
                    weeklyProgs.map((item, index) => (
                      <div
                        key={item.id || `${item.title}-${item.day_of_week}-${item.time}-${index}`}
                        className="flex items-start justify-between gap-4 rounded-2xl border border-[#eadfca] bg-white px-4 py-4"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{item.title}</div>
                          <div className="mt-1 text-sm text-slate-500">{item.day_of_week ? `Every ${item.day_of_week}` : 'Weekly'}</div>
                        </div>
                        <div className="text-sm font-semibold text-[#b53a2d]">{item.time}</div>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-2xl border border-dashed border-[#e3d6b7] px-4 py-6 text-slate-500">
                      Weekly programmes will appear here once they are updated.
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-[2rem] bg-[#071126] p-6 text-white">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold">Monthly Expressions</h3>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#d96858]">
                    Special
                  </span>
                </div>
                <div className="space-y-4">
                  {monthlyProgs.length > 0 ? (
                    monthlyProgs.map((item, index) => (
                      <div
                        key={item.id || `${item.title}-${item.day_of_week}-${item.time}-${index}`}
                        className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                      >
                        <div>
                          <div className="font-bold text-white">{item.title}</div>
                          <div className="mt-1 text-sm text-white/60">{item.day_of_week || 'Monthly'}</div>
                        </div>
                        <div className="text-sm font-semibold text-[#d96858]">{item.time}</div>
                      </div>
                    ))
                  ) : (
                    <p className="rounded-2xl border border-dashed border-white/15 px-4 py-6 text-white/60">
                      Monthly ministry moments will be displayed here.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="rounded-[2.5rem] bg-[#fff5d3] p-8 shadow-[0_20px_70px_rgba(173,124,14,0.12)]">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#b53a2d]">Study Material</p>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                {latestPamphlet ? latestPamphlet.title : 'Fresh weekly teaching guide'}
              </h3>
              <p className="mt-4 text-base leading-7 text-slate-700">
                {latestPamphlet
                  ? `Available for the week of ${formatDate(latestPamphlet.week_date, { month: 'long', day: 'numeric', year: 'numeric' })}.`
                  : 'Download the latest ministry material and keep your study life active through the week.'}
              </p>
              <div className="mt-8">
                <Link
                  to="/study-material"
                  className="inline-flex items-center gap-2 rounded-full bg-[#071126] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#102042]"
                >
                  View Study Guides
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <div className="rounded-[2.5rem] bg-white p-8 shadow-[0_20px_70px_rgba(7,17,38,0.08)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#b53a2d]">Announcements</p>
                  <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Ministry updates</h3>
                </div>
                <Megaphone className="text-[#b53a2d]" size={24} />
              </div>

              <div className="mt-8 space-y-4">
                {announcements.length > 0 ? (
                  announcements.map((announcement) => (
                    <div key={announcement.id} className="rounded-2xl border border-[#ece1c9] px-5 py-5">
                      <h4 className="text-lg font-bold text-slate-900">{announcement.title}</h4>
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{announcement.content}</p>
                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                        {formatDate(announcement.created_at, { dateStyle: 'long' })}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="rounded-2xl border border-dashed border-[#e3d6b7] px-4 py-6 text-slate-500">
                    New updates will be posted here soon.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#071126] py-24 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#d96858]">Upcoming Gatherings</p>
              <h2 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Moments to worship together</h2>
              <p className="mt-4 text-base leading-7 text-white/68">
                Every gathering is arranged to help people encounter God, grow in the Word, and build lasting fellowship.
              </p>
            </div>
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-[#d96858] transition hover:text-[#ef9487]"
            >
              See All Events
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <article
                  key={event.id}
                  className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_20px_70px_rgba(0,0,0,0.25)]"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#0d1b36]">
                    {event.banner_url ? (
                      <img
                        src={event.banner_url}
                        alt={event.title}
                        className="h-full w-full object-cover transition duration-700 hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <CalendarDays size={52} className="text-white/18" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <p className="text-xs font-bold uppercase tracking-[0.26em] text-[#d96858]">
                      {formatDate(event.date, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                    <h3 className="mt-4 text-2xl font-bold">{event.title}</h3>
                    <p className="mt-4 line-clamp-3 text-sm leading-7 text-white/65">
                      {event.description || 'Join us for a meaningful gathering filled with worship, teaching, and fellowship.'}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 px-6 py-12 text-white/65 md:col-span-3">
                Upcoming event information will appear here as soon as it is published.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="rounded-[2.5rem] bg-white p-8 shadow-[0_22px_70px_rgba(7,17,38,0.08)] lg:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#b53a2d]">Prayer Requests</p>
            <h2 className="mt-4 text-4xl font-bold tracking-tight text-slate-900">A church that stands with you in prayer</h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Share your burden with confidence. Our prayer team handles every request with care, compassion, and confidentiality.
            </p>

            <div className="mt-8 space-y-4">
              <div className="flex items-start gap-4 rounded-2xl bg-[#fbf7eb] px-5 py-5">
                <div className="mt-1 rounded-2xl bg-white p-3 text-[#b53a2d]">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Handled with discretion</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Private requests remain with the pastor and prayer team only.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl bg-[#fbf7eb] px-5 py-5">
                <div className="mt-1 rounded-2xl bg-white p-3 text-[#b53a2d]">
                  <Users size={22} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Backed by a praying community</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    We believe in standing in faith together until testimonies break forth.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/prayer-request"
                className="inline-flex items-center gap-2 rounded-full bg-[#071126] px-7 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#102042]"
              >
                Send Prayer Request
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          <div className="rounded-[2.5rem] bg-[#fffaf0] p-8 shadow-[0_22px_70px_rgba(173,124,14,0.09)] lg:p-10">
            <div className="flex flex-col gap-4 border-b border-[#eadfca] pb-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#b53a2d]">Testimonies</p>
                <h2 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">Stories of God’s faithfulness</h2>
              </div>
              <Link
                to="/testimonies"
                className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.18em] text-slate-700 transition hover:text-[#b53a2d]"
              >
                View All Testimonies
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="mt-8 grid gap-5">
              {testimonies.length > 0 ? (
                testimonies.map((testimony) => (
                  <article key={testimony.id} className="rounded-[2rem] border border-[#eadfca] bg-white px-6 py-6 shadow-sm">
                    <Quote size={28} className="text-[#d96858]" />
                    <h3 className="mt-4 text-2xl font-bold text-slate-900">{testimony.title}</h3>
                    <p className="mt-3 line-clamp-4 text-base leading-7 text-slate-600">{testimony.content}</p>
                    <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#f1e9d5] pt-4">
                      <div>
                        <div className="font-bold text-slate-900">{testimony.name}</div>
                        <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                          {formatDate(testimony.created_at, { dateStyle: 'long' })}
                        </div>
                      </div>
                      <Link
                        to="/testimonies"
                        className="text-sm font-bold uppercase tracking-[0.18em] text-[#b53a2d] transition hover:text-[#982b20]"
                      >
                        Read More
                      </Link>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[2rem] border border-dashed border-[#e3d6b7] bg-white px-6 py-12 text-slate-500">
                  Approved testimonies will appear here and help tell the story of what God is doing in this ministry.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
