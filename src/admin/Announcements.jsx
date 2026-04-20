import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { Megaphone, Plus, Edit2, Trash2, Search, X, Save, Clock, Loader2, Send, BellRing } from 'lucide-react';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const fetchAnnouncements = useCallback(async () => {
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setAnnouncements(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    let ignore = false;
    async function loadAnnouncements() {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (!ignore) {
        if (data) setAnnouncements(data);
        setLoading(false);
      }
    }
    loadAnnouncements();
    return () => {
      ignore = true;
    };
  }, []); // Only fetch on mount, manual refreshes use fetchAnnouncements

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (editingAnnouncement) {
      const { error } = await supabase
        .from('announcements')
        .update(formData)
        .eq('id', editingAnnouncement.id);
      if (!error) {
        setShowModal(false);
        fetchAnnouncements();
      }
    } else {
      const { error } = await supabase
        .from('announcements')
        .insert([formData]);
      if (!error) {
        setShowModal(false);
        fetchAnnouncements();
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', id);
      if (!error) {
        const { data } = await supabase
          .from('announcements')
          .select('*')
          .order('created_at', { ascending: false });
        if (data) setAnnouncements(data);
      }
    }
  };

  const openModal = (announcement = null) => {
    if (announcement) {
      setEditingAnnouncement(announcement);
      setFormData({
        title: announcement.title,
        content: announcement.content,
      });
    } else {
      setEditingAnnouncement(null);
      setFormData({
        title: '',
        content: '',
      });
    }
    setShowModal(true);
  };

  return (
    <div className="space-y-6 sm:space-y-12 pb-20 overflow-x-hidden" translate="no" suppressHydrationWarning>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 bg-white p-6 sm:p-12 md:p-16 rounded-[30px] sm:rounded-[60px] shadow-2xl border border-gray-100 relative overflow-hidden group" suppressHydrationWarning>
         <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-scm-blue/5 rounded-full -mr-32 -mt-32 sm:-mr-48 sm:-mt-48 group-hover:scale-150 transition-transform duration-700"></div>
         <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10 relative z-10 w-full md:w-auto">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-scm-blue text-white rounded-2xl sm:rounded-[40px] flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 shrink-0 mx-auto sm:mx-0">
               <span className="flex items-center justify-center"><Megaphone size={32} className="sm:w-12 sm:h-12" /></span>
            </div>
            <div className="text-center sm:text-left">
               <h1 className="text-2xl sm:text-4xl md:text-6xl font-black text-gray-900 mb-2 sm:mb-3 leading-tight"><span>Ministry&nbsp;</span><span className="text-scm-blue">Alerts</span></h1>
               <p className="text-gray-400 font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-xs flex items-center justify-center sm:justify-start">
                  <span className="flex items-center justify-center"><BellRing size={14} className="mr-2 text-scm-red animate-bounce shrink-0" /></span>
                  <span>Active Updates:&nbsp;{announcements.length}</span>
               </p>
            </div>
         </div>
         <button
           onClick={() => openModal()}
           className="w-full md:w-auto mt-4 md:mt-0 px-6 sm:px-12 py-4 sm:py-6 bg-scm-red text-white rounded-2xl sm:rounded-3xl font-black hover:bg-red-700 transition-all shadow-xl hover:shadow-red-900/40 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center group relative z-10 overflow-hidden"
         >
           <span className="flex items-center justify-center"><Plus size={20} className="mr-2 sm:mr-3 group-hover:translate-x-1 transition-transform sm:w-6 sm:h-6" /></span>
           <span>Post Announcement</span>
         </button>
      </div>

      {/* Announcements List */}
      <div key="announcements-list-container" className="grid grid-cols-1 gap-6 sm:gap-10" suppressHydrationWarning>
        {/* Loading State */}
        <div 
          key="loading-state" 
          style={{ display: loading ? 'flex' : 'none' }}
          className="py-32 flex-col items-center justify-center space-y-6"
        >
           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-scm-blue"></div>
           <p className="text-gray-400 font-black uppercase tracking-widest text-sm"><span>Accessing&nbsp;Alerts...</span></p>
        </div>

        {/* Empty State */}
        <div 
          key="empty-state"
          style={{ display: (!loading && announcements.length === 0) ? 'flex' : 'none' }}
          className="py-32 bg-gray-50 rounded-[60px] border-4 border-dashed border-gray-100 flex-col items-center justify-center text-center px-10"
        >
           <span className="flex items-center justify-center mb-8"><BellRing size={80} className="text-gray-100" /></span>
           <h3 className="text-3xl font-black text-gray-300 mb-4"><span>No&nbsp;active&nbsp;announcements.</span></h3>
           <p className="text-gray-400 font-medium max-w-sm"><span>Keep&nbsp;your&nbsp;community&nbsp;updated&nbsp;by&nbsp;posting&nbsp;your&nbsp;first&nbsp;ministry&nbsp;alert&nbsp;above.</span></p>
        </div>

        {/* Data Cards */}
        {announcements.map((ann) => (
          <div 
            key={ann.id} 
            style={{ display: (!loading && announcements.length > 0) ? 'flex' : 'none' }}
            className="group bg-white p-6 sm:p-12 rounded-[30px] sm:rounded-[50px] shadow-2xl border border-gray-100 hover:border-scm-blue/20 hover:scale-[1.01] transition-all duration-500 relative flex-col md:flex-row items-center gap-6 sm:gap-12"
            suppressHydrationWarning
          >
             <div className="w-16 h-16 sm:w-24 sm:h-24 bg-scm-blue/5 text-scm-blue rounded-2xl sm:rounded-[35px] flex items-center justify-center shrink-0 shadow-inner group-hover:bg-scm-blue group-hover:text-white transition-all duration-700" suppressHydrationWarning>
                <span className="flex items-center justify-center"><Megaphone size={32} className="sm:w-10 sm:h-10" /></span>
             </div>
             
             <div className="flex-grow space-y-4 text-center md:text-left w-full" suppressHydrationWarning>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                   <h3 className="text-xl sm:text-3xl font-black text-gray-900 group-hover:text-scm-blue transition-colors leading-tight"><span>{ann.title}</span></h3>
                   <span className="px-3 sm:px-4 py-1.5 bg-scm-red/10 text-scm-red text-[10px] font-black uppercase tracking-widest rounded-full self-center sm:self-auto shrink-0 border border-scm-red/20">
                      <span>New</span>
                   </span>
                </div>
                <p className="text-gray-500 font-medium text-sm sm:text-lg leading-relaxed"><span>{ann.content}</span></p>
                <div className="flex items-center justify-center md:justify-start text-[8px] sm:text-xs font-black text-gray-300 uppercase tracking-widest pt-4 border-t border-gray-50">
                   <span className="flex items-center justify-center"><Clock size={14} className="mr-2 shrink-0" /></span>
                   <span>Published&nbsp;on&nbsp;{new Date(ann.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                </div>
             </div>

             <div className="flex space-x-4 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all transform translate-x-0 md:translate-x-10 group-hover:translate-x-0" suppressHydrationWarning>
                <button onClick={() => openModal(ann)} className="p-3 sm:p-5 bg-white text-gray-400 hover:text-scm-blue hover:bg-scm-blue/5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-xl transition-all hover:scale-110">
                  <span className="flex items-center justify-center"><Edit2 size={20} className="sm:w-6 sm:h-6" /></span>
                </button>
                <button onClick={() => handleDelete(ann.id)} className="p-3 sm:p-5 bg-white text-gray-400 hover:text-scm-red hover:bg-scm-red/5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-xl transition-all hover:scale-110">
                  <span className="flex items-center justify-center"><Trash2 size={20} className="sm:w-6 sm:h-6" /></span>
                </button>
             </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-[30px] sm:rounded-[60px] shadow-2xl max-w-2xl w-full my-4 sm:my-10 max-h-[90vh] sm:max-h-[85vh] flex flex-col relative animate-scale-up border-4 border-white">
            <div className="bg-scm-blue p-8 sm:p-14 text-center relative overflow-hidden group shrink-0 rounded-t-[26px] sm:rounded-t-[56px]">
               <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-white/5 rounded-full -mr-24 -mt-24 sm:-mr-32 sm:-mt-32 group-hover:scale-150 transition-transform duration-700"></div>
               <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 sm:top-10 sm:right-10 p-2 sm:p-4 bg-white/10 text-white hover:bg-white hover:text-scm-blue rounded-xl sm:rounded-3xl transition-all shadow-2xl">
                 <X size={20} className="sm:w-6 sm:h-6" />
               </button>
               <h2 className="text-3xl sm:text-5xl font-black text-white mb-2 sm:mb-3 underline decoration-white/20 underline-offset-8 leading-tight">
                  {editingAnnouncement ? 'Edit Post' : 'Post Update'}
               </h2>
               <p className="text-white/40 text-[10px] sm:text-xs font-black uppercase tracking-[0.4em]">Announcement Dispatch Center</p>
            </div>

            <div className="overflow-y-auto w-full p-6 sm:p-14 lg:p-20 flex-1">
            <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
              <div className="space-y-8 sm:space-y-12">
                <div className="space-y-4 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-blue transition-colors">Announcement Title</label>
                   <input required className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-blue focus:ring-8 focus:ring-scm-blue/5 transition-all font-black text-gray-900 text-xl" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. New Meeting Time" />
                </div>
                
                <div className="space-y-4 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-blue transition-colors">Detailed Content</label>
                   <textarea required rows="6" className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-blue focus:ring-8 focus:ring-scm-blue/5 transition-all font-medium text-gray-900 resize-none leading-relaxed" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Write your announcement message here..."></textarea>
                </div>
              </div>

              <div className="pt-6 sm:pt-10 flex flex-col sm:flex-row gap-4 sm:gap-8">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:flex-grow py-5 sm:py-8 bg-scm-blue text-white rounded-[20px] sm:rounded-[35px] font-black text-lg sm:text-xl hover:bg-blue-900 transition-all shadow-2xl hover:shadow-scm-blue/40 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center disabled:opacity-50 group order-1"
                >
                  {submitting ? <Loader2 size={24} className="animate-spin sm:w-7 sm:h-7" /> : (
                    <>
                      <Save size={20} className="mr-2 sm:mr-4 group-hover:scale-110 transition-transform sm:w-7 sm:h-7 shrink-0" />
                      {editingAnnouncement ? 'Save Changes' : 'Broadcast Now'}
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

export default AdminAnnouncements;
