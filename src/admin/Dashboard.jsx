import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminStats } from '../hooks/useAdminStats';
import {
  ArrowRight,
  Calendar,
  FileText,
  Heart,
  LayoutDashboard,
  ListChecks,
  Megaphone,
  Settings,
  Users,
  Image as ImageIcon,
  Mail,
  Video,
  UserPlus
} from 'lucide-react';

const Dashboard = () => {
  const { stats, loading } = useAdminStats();

  const statCards = [
    {
      name: 'Members',
      value: stats.members,
      note: 'Directory and pastoral follow-up',
      icon: Users,
      path: '/admin/members',
      accent: 'bg-[#071126] text-white',
    },
    {
      name: 'Programmes',
      value: stats.programmes,
      note: 'Weekly and monthly schedule',
      icon: ListChecks,
      path: '/admin/programmes',
      accent: 'bg-[#b53a2d] text-white',
    },
    {
      name: 'Events',
      value: stats.events,
      note: 'Upcoming gatherings and campaigns',
      icon: Calendar,
      path: '/admin/events',
      accent: 'bg-[#f4c542] text-[#071126]',
    },
    {
      name: 'Study Materials',
      value: stats.pamphlets,
      note: 'Weekly teaching resources',
      icon: FileText,
      path: '/admin/pamphlets',
      accent: 'bg-white text-[#071126] border border-[#eadfca]',
    },
  ];

  const actions = [
    { label: 'Manage Members', path: '/admin/members', icon: Users },
    { label: 'Inbox (Contact)', path: '/admin/messages', icon: Mail },
    { label: 'Subscribers', path: '/admin/subscribers', icon: UserPlus },
    { label: 'Update Gallery', path: '/admin/gallery', icon: ImageIcon },
    { label: 'Latest Sermon', path: '/admin/sermons', icon: Video },
    { label: 'Post Announcement', path: '/admin/announcements', icon: Megaphone },
    { label: 'Edit Programmes', path: '/admin/programmes', icon: ListChecks },
    { label: 'Update Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-[2rem] border border-[#eadfca] bg-white shadow-[0_22px_70px_rgba(7,17,38,0.08)]">
        <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10 lg:py-10">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#efd7d2] bg-[#fff1ee] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.26em] text-[#b53a2d]">
              <LayoutDashboard size={14} />
              Ministry Dashboard
            </div>
            <h2 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Keep the church website organized and active.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
              Use this admin space to manage church members, ministry content, public communication, and the materials your congregation sees every week.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/admin/members"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#071126] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white transition hover:bg-[#102042]"
              >
                Open Members
              </Link>
              <Link
                to="/"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#eadfca] bg-[#fbf7eb] px-6 py-3 text-sm font-bold uppercase tracking-[0.18em] text-slate-700 transition hover:border-[#d8c5bb] hover:text-[#b53a2d]"
              >
                View Public Site
              </Link>
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-[#071126] p-6 text-white sm:p-8">
            <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#d96858]">At a Glance</div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                { label: 'Announcements', value: stats.announcements, icon: Megaphone },
                { label: 'Leaders', value: stats.leaders, icon: Users },
                { label: 'Prayer Requests', value: 'Live', icon: Heart },
                { label: 'System', value: 'Ready', icon: Settings },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/10 bg-white/6 p-4">
                  <item.icon size={18} className="text-[#d96858]" />
                  <div className="mt-4 text-2xl font-bold text-white">{loading ? '...' : item.value}</div>
                  <div className="mt-1 text-sm text-white/62">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Link
            key={stat.name}
            to={stat.path}
            className="rounded-[1.75rem] border border-[#eadfca] bg-white p-6 shadow-[0_20px_55px_rgba(7,17,38,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_65px_rgba(7,17,38,0.10)]"
          >
            <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${stat.accent}`}>
              <stat.icon size={24} />
            </div>
            <div className="mt-6 text-[11px] font-bold uppercase tracking-[0.24em] text-slate-400">{stat.name}</div>
            <div className="mt-2 text-4xl font-bold tracking-tight text-slate-900">{loading ? '...' : stat.value}</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{stat.note}</p>
          </Link>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[2rem] border border-[#eadfca] bg-white p-6 shadow-[0_20px_55px_rgba(7,17,38,0.06)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#b53a2d]">Quick Actions</div>
              <h3 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">Move faster inside the admin</h3>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {actions.map((action) => (
              <Link
                key={action.label}
                to={action.path}
                className="flex items-center justify-between rounded-[1.5rem] border border-[#eadfca] bg-[#fbf7eb] px-5 py-5 transition hover:border-[#d8c5bb] hover:bg-white"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#b53a2d] shadow-sm">
                    <action.icon size={20} />
                  </div>
                  <span className="text-sm font-semibold text-slate-800">{action.label}</span>
                </div>
                <ArrowRight size={16} className="text-[#b53a2d]" />
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-[#071126] p-6 text-white shadow-[0_24px_70px_rgba(7,17,38,0.16)] sm:p-8">
          <div className="text-xs font-bold uppercase tracking-[0.28em] text-[#d96858]">Admin Notes</div>
          <h3 className="mt-3 text-3xl font-bold tracking-tight">Suggested next steps</h3>

          <div className="mt-8 space-y-4">
            {[
              'Import or update your full member directory so the records stay current.',
              'Review upcoming programmes and announcements before the next service week.',
              'Upload the latest study material so members can access it from the website.',
            ].map((note) => (
              <div key={note} className="rounded-[1.5rem] border border-white/10 bg-white/6 px-5 py-5 text-sm leading-7 text-white/72">
                {note}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
