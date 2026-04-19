import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { supabase } from '../services/supabaseClient';
import { MapPin, Clock, Calendar as CalendarIcon, Info, X } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const localizer = momentLocalizer(moment);

const Events = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (data) {
          const formattedEvents = data.map((event) => ({
            id: event.id,
            title: event.title,
            start: new Date(event.date + 'T' + (event.time || '00:00:00')),
            end: new Date(event.date + 'T' + (event.time || '23:59:59')),
            allDay: !event.time,
            resource: event,
          }));
          setEvents(formattedEvents);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event.resource);
  };

  return (
    <div className="flex flex-col min-h-screen bg-scm-cream">
      <PageHeader 
        title="Church Calendar" 
        subtitle="Join our community in fellowship"
        image="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
      />

      {/* Calendar Section - Premium Card */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="premium-card bg-white p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-bl-[120px] -z-0" />
          
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
              <div>
                <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.4em] text-xs mb-3 block">Monthly Overview</span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-scm-blue">Interactive Calendar</h2>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                  <div className="w-3 h-3 rounded-full bg-scm-blue" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-widest text-slate-500">Service</span>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="h-[600px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scm-accent"></div>
              </div>
            ) : (
              <div className="h-[700px] font-sans">
                <style>{`
                  .rbc-calendar { font-family: 'Inter', sans-serif; }
                  .rbc-header { padding: 15px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; font-size: 11px; color: #64748b; border-bottom: 2px solid #f1f5f9; }
                  .rbc-off-range-bg { background: #f8fafc; }
                  .rbc-today { background: #fffbeb; }
                  .rbc-event { transition: all 0.3s ease; }
                  .rbc-event:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
                  .rbc-toolbar button { font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; font-size: 11px; border-radius: 99px; padding: 8px 20px; transition: all 0.3s; }
                  .rbc-toolbar button:hover { background: #0f172a; color: white; }
                  .rbc-toolbar button.rbc-active { background: #c29a5b; color: white; border-color: #c29a5b; }
                `}</style>
                <Calendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  onSelectEvent={handleSelectEvent}
                  views={['month', 'week', 'agenda']}
                  eventPropGetter={() => ({
                    style: {
                      backgroundColor: '#0f172a',
                      borderRadius: '12px',
                      border: 'none',
                      padding: '8px 12px',
                      fontSize: '12px',
                      fontWeight: '700',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }
                  })}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Upcoming List Section - Modern Grid */}
      <section className="py-32 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.4em] text-xs mb-4 block">Schedule of Events</span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-scm-blue">Upcoming Activities</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {events.length > 0 ? (
              events.slice(0, 6).map((evt) => {
                const event = evt.resource;
                return (
                  <div key={event.id} className="premium-card group cursor-pointer" onClick={() => setSelectedEvent(event)}>
                     <div className="p-10">
                       <div className="flex justify-between items-start mb-10">
                          <div className="bg-slate-50 px-5 py-4 rounded-2xl shadow-inner text-center min-w-[80px] group-hover:bg-scm-blue transition-colors duration-500">
                             <div className="text-scm-blue font-serif font-bold text-3xl leading-none group-hover:text-white transition-colors">
                                {moment(event.date).format('DD')}
                             </div>
                             <div className="text-slate-400 text-[10px] font-sans font-bold uppercase tracking-widest mt-2 group-hover:text-scm-accent transition-colors">
                                {moment(event.date).format('MMM')}
                             </div>
                          </div>
                          <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-scm-accent group-hover:text-white transition-all duration-500 shadow-sm">
                             <CalendarIcon size={20} className="stroke-[1.5px]" />
                          </div>
                       </div>
                       
                       <h3 className="text-2xl font-serif font-bold text-scm-blue mb-6 group-hover:text-scm-accent transition-colors duration-500 line-clamp-2 leading-tight">
                         {event.title}
                       </h3>
                       
                       <div className="space-y-4 text-slate-500 text-sm font-medium">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-scm-accent group-hover:bg-white transition-colors">
                               <Clock size={16} />
                             </div>
                             <span>{event.time ? moment(event.time, 'HH:mm:ss').format('h:mm A') : 'All Day'}</span>
                          </div>
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-scm-accent group-hover:bg-white transition-colors">
                               <MapPin size={16} />
                             </div>
                             <span className="line-clamp-1">{event.location || 'Main Sanctuary'}</span>
                          </div>
                       </div>
                     </div>
                  </div>
                );
              })
            ) : (
              !loading && (
                <div className="col-span-full text-center py-32 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                   <p className="text-slate-400 font-serif italic text-xl">No upcoming events scheduled at this time.</p>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Event Details Modal - Premium Reveal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-scm-blue/90 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[3rem] shadow-2xl max-w-4xl w-full overflow-hidden relative animate-scale-up border border-white/20">
             <button 
               onClick={() => setSelectedEvent(null)}
               className="absolute top-8 right-8 p-3 rounded-full bg-slate-100 text-slate-500 hover:bg-scm-red hover:text-white transition-all z-20 shadow-sm"
             >
               <X size={20} />
             </button>

             <div className="flex flex-col md:flex-row">
               <div className="md:w-2/5 relative h-64 md:h-auto bg-scm-blue overflow-hidden">
                 {selectedEvent.banner_url ? (
                   <img src={selectedEvent.banner_url} alt={selectedEvent.title} className="w-full h-full object-cover opacity-80" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center">
                     <CalendarIcon size={64} className="text-white/20" />
                   </div>
                 )}
                 <div className="absolute inset-0 bg-gradient-to-t from-scm-blue to-transparent md:bg-gradient-to-r" />
               </div>

               <div className="md:w-3/5 p-12 lg:p-16">
                 <div className="inline-flex items-center px-5 py-2 rounded-full bg-scm-accent/10 text-scm-accent text-xs font-bold uppercase tracking-widest mb-8">
                   <CalendarIcon size={14} className="mr-2" />
                   {moment(selectedEvent.date).format('MMMM Do, YYYY')}
                 </div>
                 
                 <h2 className="text-3xl md:text-5xl font-serif font-bold text-scm-blue mb-8 leading-tight">{selectedEvent.title}</h2>
                 
                 <div className="grid grid-cols-2 gap-8 mb-10">
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-scm-accent shadow-inner">
                        <Clock size={20} />
                     </div>
                     <div>
                        <div className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-1">Time</div>
                        <div className="text-scm-blue font-serif font-bold">{selectedEvent.time ? moment(selectedEvent.time, 'HH:mm:ss').format('h:mm A') : 'All Day'}</div>
                     </div>
                   </div>
                   <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-scm-accent shadow-inner">
                        <MapPin size={20} />
                     </div>
                     <div>
                        <div className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-widest mb-1">Location</div>
                        <div className="text-scm-blue font-serif font-bold">{selectedEvent.location || 'TBA'}</div>
                     </div>
                   </div>
                 </div>

                 <div className="space-y-4">
                   <h4 className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center">
                      <Info size={14} className="mr-2" />
                      About This Event
                   </h4>
                   <p className="text-slate-600 font-medium leading-relaxed text-lg italic font-serif">
                     "{selectedEvent.description || 'Join us for this amazing fellowship opportunity! We look forward to seeing you there.'}"
                   </p>
                 </div>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
