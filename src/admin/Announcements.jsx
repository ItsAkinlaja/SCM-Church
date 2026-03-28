import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Megaphone, Plus, Edit2, Trash2, Search, X, Save, Clock, Loader2, Sparkles, Send, BellRing } from 'lucide-react';

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

  useEffect(() => {
    const fetchAnnouncements = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setAnnouncements(data);
      setLoading(false);
    };

    fetchAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const fetchAnnouncements = async () => {
      const { data } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setAnnouncements(data);
    };

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
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-12 md:p-16 rounded-[60px] shadow-2xl border border-gray-100 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-96 h-96 bg-scm-blue/5 rounded-full -mr-48 -mt-48 group-hover:scale-150 transition-transform duration-700"></div>
         <div className="flex items-center space-x-10 relative z-10">
            <div className="w-24 h-24 bg-scm-blue text-white rounded-[40px] flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
               <Megaphone size={48} />
            </div>
            <div>
               <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-3 leading-tight">Ministry <span className="text-scm-blue">Alerts</span></h1>
               <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs flex items-center">
                  <BellRing size={14} className="mr-2 text-scm-red animate-bounce" />
                  Active Updates: {announcements.length}
               </p>
            </div>
         </div>
         <button
           onClick={() => openModal()}
           className="px-12 py-6 bg-scm-red text-white rounded-3xl font-black hover:bg-red-700 transition-all shadow-xl hover:shadow-red-900/40 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center group relative z-10"
         >
           <Send size={24} className="mr-3 group-hover:translate-x-1 transition-transform" />
           Post Announcement
         </button>
      </div>

      {/* Announcements List */}
      <div className="grid grid-cols-1 gap-10">
        {loading ? (
          <div className="py-32 flex flex-col items-center justify-center space-y-6">
             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-scm-blue"></div>
             <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Accessing Alerts...</p>
          </div>
        ) : announcements.map((ann) => (
          <div key={ann.id} className="group bg-white p-12 rounded-[50px] shadow-2xl border border-gray-100 hover:border-scm-blue/20 hover:scale-[1.01] transition-all duration-500 relative flex flex-col md:flex-row items-center gap-12">
             <div className="w-24 h-24 bg-scm-blue/5 text-scm-blue rounded-[35px] flex items-center justify-center shrink-0 shadow-inner group-hover:bg-scm-blue group-hover:text-white transition-all duration-700">
                <Megaphone size={40} />
             </div>
             
             <div className="flex-grow space-y-4 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                   <h3 className="text-3xl font-black text-gray-900 group-hover:text-scm-blue transition-colors leading-tight">{ann.title}</h3>
                   <span className="px-4 py-1.5 bg-scm-red/10 text-scm-red text-[10px] font-black uppercase tracking-widest rounded-full self-center">
                      New
                   </span>
                </div>
                <p className="text-gray-500 font-medium text-lg leading-relaxed">{ann.content}</p>
                <div className="flex items-center justify-center md:justify-start text-xs font-black text-gray-300 uppercase tracking-widest pt-4">
                   <Clock size={14} className="mr-2" /> Published on {new Date(ann.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </div>
             </div>

             <div className="flex space-x-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-10 group-hover:translate-x-0">
                <button onClick={() => openModal(ann)} className="p-5 bg-white text-gray-400 hover:text-scm-blue hover:bg-scm-blue/5 rounded-2xl border border-gray-100 shadow-xl transition-all hover:scale-110">
                  <Edit2 size={24} />
                </button>
                <button onClick={() => handleDelete(ann.id)} className="p-5 bg-white text-gray-400 hover:text-scm-red hover:bg-scm-red/5 rounded-2xl border border-gray-100 shadow-xl transition-all hover:scale-110">
                  <Trash2 size={24} />
                </button>
             </div>
          </div>
        ))}
        {announcements.length === 0 && !loading && (
          <div className="py-32 bg-gray-50 rounded-[60px] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center text-center px-10">
             <BellRing size={80} className="text-gray-100 mb-8" />
             <h3 className="text-3xl font-black text-gray-300 mb-4">No active announcements.</h3>
             <p className="text-gray-400 font-medium max-w-sm">Keep your community updated by posting your first ministry alert above.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[60px] shadow-2xl max-w-2xl w-full overflow-hidden relative animate-scale-up border-4 border-white">
            <div className="bg-scm-blue p-14 text-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-700"></div>
               <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 p-4 bg-white/10 text-white hover:bg-white hover:text-scm-blue rounded-3xl transition-all shadow-2xl">
                 <X size={24} />
               </button>
               <h2 className="text-5xl font-black text-white mb-3 underline decoration-white/20 underline-offset-8 leading-tight">
                  {editingAnnouncement ? 'Edit Post' : 'Post Update'}
               </h2>
               <p className="text-white/40 text-xs font-black uppercase tracking-[0.4em]">Announcement Dispatch Center</p>
            </div>

            <form onSubmit={handleSubmit} className="p-14 lg:p-20 space-y-12">
              <div className="space-y-12">
                <div className="space-y-4 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-blue transition-colors">Announcement Title</label>
                   <input required className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-blue focus:ring-8 focus:ring-scm-blue/5 transition-all font-black text-gray-900 text-xl" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. New Meeting Time" />
                </div>
                
                <div className="space-y-4 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-blue transition-colors">Detailed Content</label>
                   <textarea required rows="6" className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-blue focus:ring-8 focus:ring-scm-blue/5 transition-all font-medium text-gray-900 resize-none leading-relaxed" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Write your announcement message here..."></textarea>
                </div>
              </div>

              <div className="pt-10 flex flex-col sm:flex-row gap-8">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-grow py-8 bg-scm-blue text-white rounded-[35px] font-black text-xl hover:bg-blue-900 transition-all shadow-2xl hover:shadow-scm-blue/40 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center disabled:opacity-50 group"
                >
                  {submitting ? <Loader2 size={28} className="animate-spin" /> : (
                    <>
                      <Save size={28} className="mr-4 group-hover:scale-110 transition-transform" />
                      {editingAnnouncement ? 'Save Changes' : 'Broadcast Now'}
                    </>
                  )}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-14 py-8 bg-gray-50 text-gray-400 rounded-[35px] font-black hover:bg-gray-100 hover:text-gray-600 transition-all shadow-inner transform active:scale-95">
                  Discard
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;
