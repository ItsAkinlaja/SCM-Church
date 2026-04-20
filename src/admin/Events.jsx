import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { IKContext, IKUpload } from 'imagekitio-react';
import { imagekitConfig, IMAGEKIT_FOLDER_PATH, authenticator } from '../services/imagekit';
import { Calendar, Plus, Edit2, Trash2, Search, X, Save, Clock, MapPin, Image, Loader2, CalendarIcon, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    banner_url: '',
  });

  const fetchEvents = useCallback(async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (data) setEvents(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let ignore = false;
    async function loadEvents() {
      const { data } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (!ignore) {
        if (data) setEvents(data);
        setLoading(false);
      }
    }
    loadEvents();
    return () => {
      ignore = true;
    };
  }, []); // Only fetch on mount, manual refreshes use fetchEvents

  const handleUploadSuccess = (res) => {
    setFormData({ ...formData, banner_url: res.url });
    setUploading(false);
  };

  const handleUploadError = (err) => {
    console.error('Upload Error:', err);
    setUploading(false);
    toast.error('Upload failed. Please check your ImageKit configuration.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (editingEvent) {
      const { error } = await supabase
        .from('events')
        .update(formData)
        .eq('id', editingEvent.id);
      if (!error) {
        setShowModal(false);
        fetchEvents();
        toast.success("Event updated successfully!");
      } else {
        toast.error("Failed to update event: " + error.message);
      }
    } else {
      const { error } = await supabase
        .from('events')
        .insert([formData]);
      if (!error) {
        setShowModal(false);
        fetchEvents();
        toast.success("Event created successfully!");
      } else {
        toast.error("Failed to create event: " + error.message);
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);
      if (!error) {
        const { data } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });
        if (data) setEvents(data);
        toast.success("Event deleted successfully!");
      } else {
        toast.error("Failed to delete event: " + error.message);
      }
    }
  };

  const openModal = (event = null) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        title: event.title,
        date: event.date,
        time: event.time || '',
        location: event.location || '',
        description: event.description || '',
        banner_url: event.banner_url || '',
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        banner_url: '',
      });
    }
    setShowModal(true);
  };

  return (
    <div className="space-y-6 sm:space-y-12 pb-20 overflow-x-hidden" translate="no" suppressHydrationWarning>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 bg-white p-6 sm:p-12 md:p-16 rounded-[30px] sm:rounded-[60px] shadow-2xl border border-gray-100 relative overflow-hidden group" suppressHydrationWarning>
         <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-scm-red/5 rounded-full -mr-32 -mt-32 sm:-mr-48 sm:-mt-48 group-hover:scale-150 transition-transform duration-700"></div>
         <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10 relative z-10 w-full md:w-auto">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-scm-red text-white rounded-2xl sm:rounded-[40px] flex items-center justify-center shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500 shrink-0 mx-auto sm:mx-0">
               <span className="flex items-center justify-center"><Calendar size={32} className="sm:w-12 sm:h-12" /></span>
            </div>
            <div className="text-center sm:text-left">
               <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-gray-900 mb-2 sm:mb-3 leading-tight"><span>Ministry&nbsp;</span><span className="text-scm-red">Events</span></h1>
               <p className="text-gray-400 font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-xs flex items-center justify-center sm:justify-start">
                  <span>Scheduled Programs:&nbsp;{events.length}</span>
               </p>
            </div>
         </div>
         <button
           onClick={() => openModal()}
           className="w-full md:w-auto mt-4 md:mt-0 px-6 sm:px-12 py-4 sm:py-6 bg-scm-blue text-white rounded-2xl sm:rounded-3xl font-black hover:bg-blue-900 transition-all shadow-xl hover:shadow-scm-blue/40 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center group relative z-10 overflow-hidden"
         >
           <span className="flex items-center justify-center"><Plus size={20} className="mr-2 sm:mr-3 group-hover:rotate-90 transition-transform sm:w-6 sm:h-6" /></span>
           <span>Schedule Event</span>
         </button>
      </div>

      {/* Events Grid */}
      <div key="events-grid-container" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10" suppressHydrationWarning>
        {/* Loading State */}
        <div 
          key="loading-state" 
          style={{ display: loading ? 'flex' : 'none' }}
          className="col-span-full py-24 flex-col items-center justify-center space-y-6"
        >
           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-scm-red"></div>
           <p className="text-gray-400 font-black uppercase tracking-widest text-sm"><span>Accessing&nbsp;Calendar...</span></p>
        </div>

        {/* Empty State */}
        <div 
          key="empty-state"
          style={{ display: (!loading && events.length === 0) ? 'flex' : 'none' }}
          className="col-span-full py-32 bg-gray-50 rounded-[60px] border-4 border-dashed border-gray-100 flex-col items-center justify-center text-center px-10"
        >
           <span className="flex items-center justify-center mb-8"><Calendar size={80} className="text-gray-100" /></span>
           <h3 className="text-3xl font-black text-gray-300 mb-4"><span>No&nbsp;events&nbsp;scheduled&nbsp;yet.</span></h3>
           <p className="text-gray-400 font-medium max-w-sm mb-10"><span>Get&nbsp;started&nbsp;by&nbsp;clicking&nbsp;the&nbsp;button&nbsp;above&nbsp;to&nbsp;add&nbsp;your&nbsp;first&nbsp;ministry&nbsp;event.</span></p>
           <button onClick={() => openModal()} className="px-10 py-5 bg-white text-scm-blue border-2 border-scm-blue/20 rounded-2xl font-black hover:bg-scm-blue hover:text-white transition-all shadow-xl"><span>Create&nbsp;First&nbsp;Event</span></button>
        </div>

        {/* Data Cards */}
        {events.map((event) => (
          <div 
            key={event.id} 
            style={{ display: (!loading && events.length > 0) ? 'flex' : 'none' }}
            className="group bg-white rounded-[30px] sm:rounded-[50px] shadow-2xl border border-gray-100 overflow-hidden hover:border-scm-red/20 hover:scale-[1.03] transition-all duration-700 relative flex-col"
            suppressHydrationWarning
          >
             <div className="aspect-[16/10] overflow-hidden relative bg-scm-blue" suppressHydrationWarning>
                {event.banner_url ? (
                  <img src={event.banner_url} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 opacity-90" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-200">
                     <span className="flex items-center justify-center"><CalendarIcon size={60} className="sm:w-20 sm:h-20" strokeWidth={1} /></span>
                  </div>
                )}
                
                {/* Date Tag */}
                <div className="absolute top-4 left-4 sm:top-8 sm:left-8 z-10" suppressHydrationWarning>
                   <div className="bg-white/95 backdrop-blur-md px-4 py-3 sm:px-5 sm:py-4 rounded-2xl sm:rounded-3xl shadow-2xl text-center min-w-[60px] sm:min-w-[70px] border border-gray-100 transform group-hover:-rotate-3 transition-transform">
                      <div className="text-scm-red font-black text-xl sm:text-2xl leading-none mb-1"><span>{new Date(event.date).getDate()}</span></div>
                      <div className="text-gray-400 text-[8px] sm:text-[10px] font-black uppercase tracking-widest"><span>{new Date(event.date).toLocaleDateString(undefined, { month: 'short' })}</span></div>
                   </div>
                </div>

                {/* Hover Overlay Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-scm-blue via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center p-6 sm:p-8" suppressHydrationWarning>
                   <div className="flex space-x-4 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                      <button onClick={() => openModal(event)} className="p-3 sm:p-4 bg-white text-scm-blue hover:bg-scm-blue hover:text-white rounded-xl sm:rounded-2xl shadow-xl transition-all transform hover:scale-110">
                         <span className="flex items-center justify-center"><Edit2 size={18} className="sm:w-5 sm:h-5" /></span>
                      </button>
                      <button onClick={() => handleDelete(event.id)} className="p-3 sm:p-4 bg-white text-scm-red hover:bg-scm-red hover:text-white rounded-xl sm:rounded-2xl shadow-xl transition-all transform hover:scale-110">
                         <span className="flex items-center justify-center"><Trash2 size={18} className="sm:w-5 sm:h-5" /></span>
                      </button>
                   </div>
                </div>
             </div>

             <div className="p-6 sm:p-10 flex-grow flex flex-col" suppressHydrationWarning>
                <h3 className="text-lg sm:text-2xl font-black text-gray-900 mb-4 sm:mb-6 group-hover:text-scm-red transition-colors line-clamp-1"><span>{event.title}</span></h3>
                
                <div className="space-y-4 sm:space-y-5 mb-8 sm:mb-10" suppressHydrationWarning>
                   <div className="flex items-center text-xs sm:text-sm font-bold text-gray-600">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-50 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 text-scm-red shrink-0">
                         <span className="flex items-center justify-center"><Clock size={16} className="sm:w-[18px] sm:h-[18px]" /></span>
                      </div>
                      <span className="truncate"><span>{event.time ? new Date('1970-01-01T' + event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'All Day'}</span></span>
                   </div>
                   <div className="flex items-center text-xs sm:text-sm font-bold text-gray-600">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-50 rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 text-scm-red shrink-0">
                         <span className="flex items-center justify-center"><MapPin size={16} className="sm:w-[18px] sm:h-[18px]" /></span>
                      </div>
                      <span className="line-clamp-1"><span>{event.location || 'TBA'}</span></span>
                   </div>
                </div>

                <div className="mt-auto pt-4 sm:pt-6 border-t border-gray-50 flex justify-between items-center" suppressHydrationWarning>
                   <span className="text-[8px] sm:text-[10px] font-black text-gray-300 uppercase tracking-widest"><span>Added&nbsp;{new Date(event.created_at).toLocaleDateString()}</span></span>
                   <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-50 text-gray-300 rounded-lg sm:rounded-xl flex items-center justify-center group-hover:bg-scm-red group-hover:text-white transition-colors shrink-0">
                      <span className="flex items-center justify-center"><ChevronRight size={18} className="sm:w-5 sm:h-5" /></span>
                   </div>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-[30px] sm:rounded-[60px] shadow-2xl max-w-4xl w-full my-4 sm:my-10 max-h-[90vh] sm:max-h-[85vh] flex flex-col relative animate-scale-up border-4 border-white">
            <div className="bg-scm-red p-8 sm:p-14 text-center relative overflow-hidden group shrink-0 rounded-t-[26px] sm:rounded-t-[56px]">
               <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/5 rounded-full -mr-24 -mt-24 sm:-mr-32 sm:-mt-32 group-hover:scale-150 transition-transform duration-700"></div>
               <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 sm:top-10 sm:right-10 p-2 sm:p-4 bg-white/10 text-white hover:bg-white hover:text-scm-red rounded-xl sm:rounded-3xl transition-all shadow-2xl">
                 <X size={20} className="sm:w-6 sm:h-6" />
               </button>
               <h2 className="text-3xl sm:text-5xl font-black text-white mb-2 sm:mb-3 underline decoration-white/20 underline-offset-8">
                  {editingEvent ? 'Edit Event' : 'New Program'}
               </h2>
               <p className="text-white/40 text-[10px] sm:text-xs font-black uppercase tracking-[0.4em]">Event Management System</p>
            </div>

            <div className="overflow-y-auto w-full p-6 sm:p-14 lg:p-20 flex-1">
            <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4 md:col-span-2 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-red transition-colors">Event Title</label>
                   <input required className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-red focus:ring-8 focus:ring-scm-red/5 transition-all font-black text-gray-900 text-xl" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Sunday Service, Prayer Retreat" />
                </div>
                
                <div className="space-y-4 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-red transition-colors">Program Date</label>
                   <input type="date" required className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-red focus:ring-8 focus:ring-scm-red/5 transition-all font-bold text-gray-900" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
                </div>

                <div className="space-y-4 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-red transition-colors">Start Time (Optional)</label>
                   <input type="time" className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-red focus:ring-8 focus:ring-scm-red/5 transition-all font-bold text-gray-900" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} />
                </div>

                <div className="space-y-4 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-red transition-colors">Meeting Location</label>
                   <div className="relative">
                      <MapPin size={20} className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-scm-red transition-colors" />
                      <input className="w-full pl-16 pr-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-red focus:ring-8 focus:ring-scm-red/5 transition-all font-bold text-gray-900" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Campus Chapel, Zoom" />
                   </div>
                </div>

                <div className="space-y-4 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-red transition-colors">Event Banner (ImageKit)</label>
                   <div className="relative group/upload">
                      <IKContext {...imagekitConfig} authenticator={authenticator}>
                        <IKUpload
                          fileName="event_banner.jpg"
                          folder={IMAGEKIT_FOLDER_PATH}
                          onUploadStart={() => setUploading(true)}
                          onSuccess={handleUploadSuccess}
                          onError={handleUploadError}
                          className="hidden"
                          id="banner-upload"
                        />
                      </IKContext>
                      <label htmlFor="banner-upload" className="w-full flex items-center px-8 py-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:border-scm-red hover:bg-scm-red/5 transition-all group-focus-within:border-scm-red">
                        {uploading ? <Loader2 size={24} className="animate-spin text-scm-red mr-4" /> : <Image size={24} className="text-gray-400 group-hover:text-scm-red mr-4 transition-colors" />}
                        <span className="font-bold text-gray-400 group-hover:text-scm-red transition-colors">
                           {formData.banner_url ? 'Change Banner Image' : 'Click to Upload Banner'}
                        </span>
                      </label>
                      {formData.banner_url && (
                        <div className="mt-4 relative rounded-2xl overflow-hidden h-32 border-4 border-gray-50 shadow-lg">
                           <img src={formData.banner_url} alt="Preview" className="w-full h-full object-cover" />
                           <button type="button" onClick={() => setFormData({ ...formData, banner_url: '' })} className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-xl shadow-xl hover:scale-110 transition-transform">
                              <X size={14} />
                           </button>
                        </div>
                      )}
                   </div>
                </div>

                <div className="space-y-4 md:col-span-2 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-red transition-colors">Program Description</label>
                   <textarea rows="4" className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-red focus:ring-8 focus:ring-scm-red/5 transition-all font-medium text-gray-900 resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Tell members more about this event..."></textarea>
                </div>
              </div>

              <div className="pt-6 sm:pt-10 flex flex-col sm:flex-row gap-4 sm:gap-8">
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="w-full sm:flex-grow py-5 sm:py-8 bg-scm-red text-white rounded-[20px] sm:rounded-[35px] font-black text-lg sm:text-xl hover:bg-red-700 transition-all shadow-2xl hover:shadow-red-900/40 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center disabled:opacity-70 group order-1"
                >
                  {submitting ? <Loader2 size={24} className="animate-spin sm:w-7 sm:h-7" /> : (
                    <>
                      <Save size={20} className="mr-2 sm:mr-4 group-hover:scale-110 transition-transform sm:w-7 sm:h-7 shrink-0" />
                      {editingEvent ? 'Confirm Changes' : 'Publish Program'}
                    </>
                  )}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="w-full sm:w-auto px-6 sm:px-14 py-5 sm:py-8 bg-gray-50 text-gray-400 rounded-[20px] sm:rounded-[35px] font-black hover:bg-gray-100 hover:text-gray-600 transition-all shadow-inner transform active:scale-95 order-2">
                  Discard
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEvents;
