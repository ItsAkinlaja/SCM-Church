import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { IKContext, IKUpload } from 'imagekitio-react';
import { imagekitConfig, IMAGEKIT_FOLDER_PATH, authenticator } from '../services/imagekit';
import { FileText, Plus, Edit2, Trash2, Search, X, Save, Calendar, Download, FilePlus, Loader2, Sparkles, FileSearch, ArrowRight } from 'lucide-react';

const AdminPamphlets = () => {
  const [pamphlets, setPamphlets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPamphlet, setEditingPamphlet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    week_date: '',
    file_url: '',
    description: '',
  });

  useEffect(() => {
    const fetchPamphlets = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('weekly_materials')
        .select('*')
        .order('week_date', { ascending: false });

      if (data) setPamphlets(data);
      setLoading(false);
    };

    fetchPamphlets();
  }, []);

  const handleUploadSuccess = (res) => {
    setFormData({ ...formData, file_url: res.url });
    setUploading(false);
  };

  const handleUploadError = (err) => {
    console.error('Upload Error:', err);
    setUploading(false);
    alert('File upload failed. Please check your ImageKit configuration.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const fetchPamphlets = async () => {
      const { data } = await supabase
        .from('weekly_materials')
        .select('*')
        .order('week_date', { ascending: false });
      if (data) setPamphlets(data);
    };

    if (editingPamphlet) {
      const { error } = await supabase
        .from('weekly_materials')
        .update(formData)
        .eq('id', editingPamphlet.id);
      if (!error) {
        setShowModal(false);
        fetchPamphlets();
      }
    } else {
      const { error } = await supabase
        .from('weekly_materials')
        .insert([formData]);
      if (!error) {
        setShowModal(false);
        fetchPamphlets();
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      const { error } = await supabase
        .from('weekly_materials')
        .delete()
        .eq('id', id);
      if (!error) {
        const { data } = await supabase
          .from('weekly_materials')
          .select('*')
          .order('week_date', { ascending: false });
        if (data) setPamphlets(data);
      }
    }
  };

  const openModal = (pamphlet = null) => {
    if (pamphlet) {
      setEditingPamphlet(pamphlet);
      setFormData({
        title: pamphlet.title,
        week_date: pamphlet.week_date,
        file_url: pamphlet.file_url,
        description: pamphlet.description || '',
      });
    } else {
      setEditingPamphlet(null);
      setFormData({
        title: '',
        week_date: '',
        file_url: '',
        description: '',
      });
    }
    setShowModal(true);
  };

  const filteredPamphlets = pamphlets.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-12 md:p-16 rounded-[60px] shadow-2xl border border-gray-100 relative overflow-hidden group">
         <div className="absolute top-0 left-0 w-96 h-96 bg-scm-gold/5 rounded-full -ml-48 -mt-48 group-hover:scale-150 transition-transform duration-700"></div>
         <div className="flex items-center space-x-10 relative z-10">
            <div className="w-24 h-24 bg-scm-gold text-white rounded-[40px] flex items-center justify-center shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
               <FileText size={48} />
            </div>
            <div>
               <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-3 leading-tight">Study <span className="text-scm-gold">Materials</span></h1>
               <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs flex items-center">
                  <Sparkles size={14} className="mr-2 text-scm-blue" />
                  Library Count: {pamphlets.length} Guides
               </p>
            </div>
         </div>
         <button
           onClick={() => openModal()}
           className="px-12 py-6 bg-scm-blue text-white rounded-3xl font-black hover:bg-blue-900 transition-all shadow-xl hover:shadow-scm-blue/40 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center group relative z-10 overflow-hidden"
         >
           <FilePlus size={24} className="mr-3 group-hover:scale-125 transition-transform" />
           Upload New Guide
         </button>
      </div>

      {/* Materials Table/List */}
      <div className="bg-white rounded-[60px] shadow-2xl border border-gray-100 overflow-hidden relative group">
        <div className="p-12 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8 bg-gray-50/30">
           <div className="relative w-full md:w-96 group/search">
              <FileSearch className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within/search:text-scm-gold transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search study titles..."
                className="w-full pl-16 pr-6 py-5 bg-white border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-gold focus:ring-8 focus:ring-scm-gold/5 transition-all font-bold text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-12 py-8 text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Material Info</th>
                <th className="px-8 py-8 text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Study Date</th>
                <th className="px-8 py-8 text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Access</th>
                <th className="px-12 py-8 text-right text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-12 py-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-6">
                       <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-scm-gold"></div>
                       <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Browsing Library...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredPamphlets.map((pamphlet) => (
                <tr key={pamphlet.id} className="hover:bg-gray-50/80 transition-all group/row">
                  <td className="px-12 py-10">
                    <div className="flex items-center space-x-8">
                       <div className="w-16 h-16 bg-scm-gold/10 text-scm-gold rounded-2xl flex items-center justify-center font-black group-hover/row:rotate-12 group-hover/row:scale-110 transition-all duration-500 shadow-sm border border-scm-gold/10">
                          <FileText size={28} />
                       </div>
                       <div>
                          <div className="font-black text-gray-900 text-xl mb-1 group-hover/row:text-scm-gold transition-colors">{pamphlet.title}</div>
                          <div className="text-gray-400 font-medium text-sm line-clamp-1 max-w-md">{pamphlet.description || "No description provided."}</div>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-10">
                    <div className="flex flex-col">
                       <span className="text-gray-900 font-black text-lg">{new Date(pamphlet.week_date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</span>
                       <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">{new Date(pamphlet.week_date).getFullYear()}</span>
                    </div>
                  </td>
                  <td className="px-8 py-10">
                    <a href={pamphlet.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-scm-blue hover:text-white transition-all shadow-sm group-hover/row:shadow-xl">
                      <Download size={14} className="mr-2" /> View PDF
                    </a>
                  </td>
                  <td className="px-12 py-10 text-right">
                    <div className="flex items-center justify-end space-x-4 opacity-0 group-hover/row:opacity-100 transition-all transform translate-x-10 group-hover/row:translate-x-0">
                      <button onClick={() => openModal(pamphlet)} className="p-4 bg-white text-gray-400 hover:text-scm-blue hover:bg-scm-blue/5 rounded-2xl border border-gray-100 shadow-xl transition-all hover:scale-110">
                        <Edit2 size={20} />
                      </button>
                      <button onClick={() => handleDelete(pamphlet.id)} className="p-4 bg-white text-gray-400 hover:text-scm-red hover:bg-scm-red/5 rounded-2xl border border-gray-100 shadow-xl transition-all hover:scale-110">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPamphlets.length === 0 && !loading && (
                <tr>
                  <td colSpan="4" className="px-12 py-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-8">
                       <div className="w-32 h-32 bg-gray-50 rounded-[40px] flex items-center justify-center text-gray-100">
                          <FileText size={64} />
                       </div>
                       <div>
                          <p className="text-2xl font-black text-gray-300 mb-2">Library is empty.</p>
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Upload your first weekly study material above.</p>
                       </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-[60px] shadow-2xl max-w-3xl w-full overflow-hidden relative animate-scale-up border-4 border-white">
            <div className="bg-scm-gold p-14 text-center relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-700"></div>
               <button onClick={() => setShowModal(false)} className="absolute top-10 right-10 p-4 bg-white/10 text-white hover:bg-white hover:text-scm-gold rounded-3xl transition-all shadow-2xl">
                 <X size={24} />
               </button>
               <h2 className="text-5xl font-black text-white mb-3 underline decoration-white/20 underline-offset-8 leading-tight">
                  {editingPamphlet ? 'Edit Guide' : 'Publish Study'}
               </h2>
               <p className="text-white/40 text-xs font-black uppercase tracking-[0.4em]">Resource Management System</p>
            </div>

            <form onSubmit={handleSubmit} className="p-14 lg:p-20 space-y-12">
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-4 group md:col-span-2">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-gold transition-colors">Study Title</label>
                      <input required className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-gold focus:ring-8 focus:ring-scm-gold/5 transition-all font-black text-gray-900 text-xl" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Living in the Word" />
                   </div>
                   
                   <div className="space-y-4 group">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-gold transition-colors">Week Date</label>
                      <input type="date" required className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-gold focus:ring-8 focus:ring-scm-gold/5 transition-all font-bold text-gray-900" value={formData.week_date} onChange={(e) => setFormData({ ...formData, week_date: e.target.value })} />
                   </div>

                   <div className="space-y-4 group">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-gold transition-colors">File Upload (PDF/Image)</label>
                      <div className="relative group/upload">
                         <IKContext {...imagekitConfig} authenticator={authenticator}>
                           <IKUpload
                             fileName="study_material"
                             folder={IMAGEKIT_FOLDER_PATH}
                             onUploadStart={() => setUploading(true)}
                             onSuccess={handleUploadSuccess}
                             onError={handleUploadError}
                             className="hidden"
                             id="pamphlet-upload"
                           />
                         </IKContext>
                         <label htmlFor="pamphlet-upload" className="w-full flex items-center px-8 py-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:border-scm-gold hover:bg-scm-gold/5 transition-all group-focus-within:border-scm-gold">
                           {uploading ? <Loader2 size={24} className="animate-spin text-scm-gold mr-4" /> : <FilePlus size={24} className="text-gray-400 group-hover:text-scm-gold mr-4 transition-colors" />}
                           <span className="font-bold text-gray-400 group-hover:text-scm-gold transition-colors line-clamp-1">
                              {formData.file_url ? 'File Uploaded Successfully' : 'Choose Study File'}
                           </span>
                         </label>
                         {formData.file_url && (
                           <div className="mt-4 p-5 bg-scm-gold/5 border border-scm-gold/20 rounded-2xl flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                 <FileText size={24} className="text-scm-gold" />
                                 <span className="text-xs font-black text-scm-gold uppercase tracking-widest">Resource Ready</span>
                              </div>
                              <a href={formData.file_url} target="_blank" rel="noopener noreferrer" className="p-2 bg-white text-scm-gold rounded-xl shadow-md hover:scale-110 transition-transform">
                                 <ArrowRight size={16} />
                              </a>
                           </div>
                         )}
                      </div>
                   </div>
                </div>

                <div className="space-y-4 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-gold transition-colors">Brief Description (Optional)</label>
                   <textarea rows="4" className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-gold focus:ring-8 focus:ring-scm-gold/5 transition-all font-medium text-gray-900 resize-none" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="What is this week's study about?"></textarea>
                </div>
              </div>

              <div className="pt-10 flex flex-col sm:flex-row gap-8">
                <button
                  type="submit"
                  disabled={submitting || uploading || !formData.file_url}
                  className="flex-grow py-8 bg-scm-gold text-white rounded-[35px] font-black text-xl hover:bg-amber-600 transition-all shadow-2xl hover:shadow-amber-900/40 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:transform-none group"
                >
                  {submitting ? <Loader2 size={28} className="animate-spin" /> : (
                    <>
                      <Save size={28} className="mr-4 group-hover:scale-110 transition-transform" />
                      {editingPamphlet ? 'Confirm Update' : 'Publish Study Guide'}
                    </>
                  )}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="px-14 py-8 bg-gray-50 text-gray-400 rounded-[35px] font-black hover:bg-gray-100 hover:text-gray-600 transition-all shadow-inner transform active:scale-95">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPamphlets;
