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

  const upcomingEvents = events.filter(e => moment(e.start).isSameOrAfter(moment(), 'day'));
  const pastEvents = events.filter(e => moment(e.start).isBefore(moment(), 'day'));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PageHeader 
        title="Church Calendar" 
        subtitle="Join us in our upcoming activities and fellowship."
        image="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
      />

      {/* Calendar Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="h-[600px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scm-blue"></div>
            </div>
          ) : (
            <div className="h-[600px] text-gray-700">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                onSelectEvent={handleSelectEvent}
                views={['month', 'week', 'agenda']}
                eventPropGetter={() => ({
                  style: {
                    backgroundColor: '#000080',
                    borderRadius: '6px',
                    border: 'none',
                    padding: '4px 8px',
                    fontSize: '14px',
                    fontWeight: '500',
                  }
                })}
              />
            </div>
          )}
        </div>
      </section>

      {/* Upcoming List Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 flex items-center">
             <Info className="mr-3 text-scm-red" />
             Upcoming Events List
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 6).map((evt) => {
              const event = evt.resource;
              return (
                <div key={event.id} className="group bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:border-scm-blue/20 hover:bg-scm-blue/5 transition-all cursor-pointer shadow-sm hover:shadow-lg transform hover:-translate-y-1" onClick={() => setSelectedEvent(event)}>
                   <div className="flex justify-between items-start mb-6">
                      <div className="bg-white p-3 rounded-xl shadow-sm text-center min-w-[64px] border border-gray-100 group-hover:border-scm-blue/20">
                         <div className="text-scm-red font-extrabold text-xl leading-none">
                            {moment(event.date).format('DD')}
                         </div>
                         <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mt-1">
                            {moment(event.date).format('MMM')}
                         </div>
                      </div>
                      <div className="w-12 h-12 bg-scm-blue/5 rounded-full flex items-center justify-center text-scm-blue group-hover:bg-scm-blue group-hover:text-white transition-colors">
                         <CalendarIcon size={20} />
                      </div>
                   </div>
                   <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-scm-blue transition-colors line-clamp-1">{event.title}</h3>
                   <div className="space-y-3 text-gray-500 text-sm font-medium">
                      <div className="flex items-center">
                         <Clock size={16} className="mr-2 text-scm-red" />
                         {event.time ? moment(event.time, 'HH:mm:ss').format('h:mm A') : 'All Day'}
                      </div>
                      <div className="flex items-start">
                         <MapPin size={16} className="mr-2 text-scm-red mt-0.5" />
                         <span className="line-clamp-1">{event.location || 'Online / TBA'}</span>
                      </div>
                   </div>
                </div>
              );
            })}
            {events.length === 0 && !loading && (
              <div className="col-span-3 text-center py-20 text-gray-400 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                 No upcoming events scheduled.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden relative animate-scale-up">
             <button 
               onClick={() => setSelectedEvent(null)}
               className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 text-gray-500 hover:bg-scm-red hover:text-white transition-all z-10 shadow-sm"
             >
               <X size={20} />
             </button>

             {selectedEvent.banner_url && (
               <div className="h-64 w-full overflow-hidden bg-scm-blue">
                 <img src={selectedEvent.banner_url} alt={selectedEvent.title} className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
               </div>
             )}

             <div className="p-10">
               <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-scm-blue/10 text-scm-blue text-sm font-bold mb-6">
                 <CalendarIcon size={16} className="mr-2" />
                 {moment(selectedEvent.date).format('dddd, MMMM Do YYYY')}
               </div>
               
               <h2 className="text-3xl font-extrabold text-gray-900 mb-6 leading-tight">{selectedEvent.title}</h2>
               
               <div className="grid grid-cols-2 gap-8 mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
                 <div className="flex items-start space-x-3">
                   <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-scm-red">
                      <Clock size={20} />
                   </div>
                   <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Time</div>
                      <div className="text-gray-900 font-bold">{selectedEvent.time ? moment(selectedEvent.time, 'HH:mm:ss').format('h:mm A') : 'All Day'}</div>
                   </div>
                 </div>
                 <div className="flex items-start space-x-3">
                   <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-scm-red">
                      <MapPin size={20} />
                   </div>
                   <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Location</div>
                      <div className="text-gray-900 font-bold">{selectedEvent.location || 'TBA'}</div>
                   </div>
                 </div>
               </div>

               <div className="text-gray-600 leading-relaxed text-lg">
                 <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center">
                    <Info size={16} className="mr-2" />
                    Event Description
                 </h4>
                 {selectedEvent.description || 'Join us for this amazing fellowship opportunity!'}
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
