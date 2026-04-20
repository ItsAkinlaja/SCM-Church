import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { 
  MessageSquare, 
  Gift, 
  Bell, 
  Send, 
  CheckCircle2, 
  Clock, 
  Calendar,
  Loader2,
  Mail,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const Communication = () => {
  const [loading, setLoading] = useState(true);
  const [birthdaysToday, setBirthdaysToday] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [sendingShoutout, setSendingShoutout] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Avoid synchronous setLoading(true) in effect if already loading
      const today = new Date();
      const monthDay = `${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

      // Fetch all members (ideally filter in SQL, but for small sets frontend is fine)
      const { data: members } = await supabase.from('members').select('*');
      
      if (members) {
        const todaysBirthdays = members.filter(member => {
          if (!member.birthday) return false;
          // Birthday format is YYYY-MM-DD
          return member.birthday.endsWith(monthDay);
        });
        setBirthdaysToday(todaysBirthdays);
      }

      // Fetch upcoming events
      const { data: events } = await supabase
        .from('events')
        .select('*')
        .gte('date', today.toISOString())
        .order('date', { ascending: true })
        .limit(5);

      if (events) setUpcomingEvents(events);
      
      setLoading(false);
    };

    fetchData();
  }, []);

  const handleSendShoutout = (member, type) => {
    setSendingShoutout(member.id);
    
    // Simulate sending
    setTimeout(() => {
      setSendingShoutout(null);
      toast.success(`Birthday ${type} sent to ${member.name}!`);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="animate-spin text-scm-blue" size={40} />
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Syncing Communication Hub...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-fade-in pb-20">
      {/* Header */}
      <div className="bg-white p-10 md:p-14 rounded-[50px] shadow-2xl border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center space-x-8">
            <div className="w-20 h-20 bg-[#b53a2d] text-white rounded-[30px] flex items-center justify-center shadow-2xl transform rotate-3">
              <MessageSquare size={40} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">Communication <span className="text-[#b53a2d]">Hub</span></h1>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Automated Outreach & Reminders</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Birthdays */}
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-pink-50 text-pink-500 rounded-2xl">
                  <Gift size={24} />
                </div>
                <h3 className="text-2xl font-black text-gray-900">Today's Birthdays</h3>
              </div>
              <span className="px-4 py-1.5 bg-pink-50 text-pink-600 rounded-full text-xs font-black uppercase tracking-widest">
                {birthdaysToday.length} Celebrants
              </span>
            </div>

            {birthdaysToday.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {birthdaysToday.map((member) => (
                  <div key={member.id} className="group p-6 bg-gray-50 rounded-[30px] border border-gray-100 hover:border-pink-200 transition-all hover:bg-white hover:shadow-lg">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center font-black text-lg">
                        {member.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{member.name}</h4>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{member.department || 'General Member'}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleSendShoutout(member, 'Email')}
                        disabled={sendingShoutout === member.id}
                        className="flex-1 flex items-center justify-center space-x-2 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-scm-blue hover:text-white hover:border-scm-blue transition-all"
                      >
                        {sendingShoutout === member.id ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
                        <span>Email</span>
                      </button>
                      <button 
                        onClick={() => handleSendShoutout(member, 'SMS')}
                        disabled={sendingShoutout === member.id}
                        className="flex-1 flex items-center justify-center space-x-2 py-3 bg-white border border-gray-200 rounded-2xl text-xs font-black uppercase tracking-widest text-gray-500 hover:bg-green-500 hover:text-white hover:border-green-500 transition-all"
                      >
                        {sendingShoutout === member.id ? <Loader2 size={14} className="animate-spin" /> : <Smartphone size={14} />}
                        <span>SMS</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-gray-50 rounded-[30px] border-2 border-dashed border-gray-200">
                <Gift className="mx-auto text-gray-200 mb-4" size={48} />
                <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">No birthdays found for today</p>
              </div>
            )}
          </section>

          <section className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100">
            <div className="flex items-center space-x-4 mb-8">
              <div className="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                <Bell size={24} />
              </div>
              <h3 className="text-2xl font-black text-gray-900">Event Reminders</h3>
            </div>

            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-[30px] border border-gray-100 group hover:bg-white hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-6">
                    <div className="flex flex-col items-center justify-center w-16 h-16 bg-white rounded-2xl border border-gray-100 shadow-sm group-hover:border-blue-200">
                      <span className="text-lg font-black text-gray-900">{new Date(event.date).getDate()}</span>
                      <span className="text-[10px] font-black uppercase text-blue-500">{new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{event.title}</h4>
                      <p className="text-xs text-gray-400 font-medium">{event.location || 'Main Sanctuary'}</p>
                    </div>
                  </div>
                  <button className="flex items-center space-x-2 px-6 py-3 bg-blue-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/20">
                    <Send size={14} />
                    <span>Blast Reminder</span>
                  </button>
                </div>
              ))}
              {upcomingEvents.length === 0 && (
                <p className="text-center py-10 text-gray-400 font-medium italic">No upcoming events found</p>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Status & Automation */}
        <div className="space-y-10">
          <section className="bg-[#071126] p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
            
            <h3 className="text-xl font-black mb-8 underline decoration-[#b53a2d] underline-offset-8">Automation Status</h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-5 bg-white/5 rounded-[24px] border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-500/20 text-green-500 rounded-xl flex items-center justify-center">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-white/40">Birthday Engine</p>
                    <p className="text-sm font-bold">Active</p>
                  </div>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              </div>

              <div className="flex items-center justify-between p-5 bg-white/5 rounded-[24px] border border-white/10">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest text-white/40">Next Event Blast</p>
                    <p className="text-sm font-bold">Scheduled</p>
                  </div>
                </div>
                <span className="text-[10px] font-black bg-blue-500/20 text-blue-500 px-3 py-1 rounded-full uppercase">In 2 Days</span>
              </div>
            </div>

            <div className="mt-10 p-6 bg-[#b53a2d]/10 border border-[#b53a2d]/30 rounded-[30px]">
              <h4 className="text-sm font-black mb-3 text-[#b53a2d]">Pro Tip</h4>
              <p className="text-xs text-white/60 leading-relaxed font-medium italic">
                Automation runs every day at 8:00 AM. Ensure all member phone numbers are in international format for SMS delivery.
              </p>
            </div>
          </section>

          <section className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6">Service Providers</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-black text-[10px]">RS</div>
                  <span className="text-sm font-bold text-gray-700">Resend (Email)</span>
                </div>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Connected</span>
              </div>
              <div className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white">
                    <Smartphone size={16} />
                  </div>
                  <span className="text-sm font-bold text-gray-700">Termii (SMS)</span>
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Setup Needed</span>
              </div>
            </div>
            
            <button className="w-full mt-6 py-4 bg-gray-50 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all flex items-center justify-center">
              Configure Webhooks <ExternalLink size={14} className="ml-2" />
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Communication;
