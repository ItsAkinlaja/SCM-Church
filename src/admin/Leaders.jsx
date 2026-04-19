import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { IKContext, IKUpload } from 'imagekitio-react';
import { imagekitConfig, IMAGEKIT_FOLDER_PATH, authenticator } from '../services/imagekit';
import { UserCircle, Plus, Edit2, Trash2, Search, X, Save, ShieldCheck, Briefcase, Building2, Image, Loader2, Sparkles, UserPlus } from 'lucide-react';

const AdminLeaders = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingLeader, setEditingLeader] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    department: '',
    photo_url: '',
  });

  useEffect(() => {
    const fetchLeaders = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('leaders')
        .select('*')
        .order('created_at', { ascending: true });

      if (data) setLeaders(data);
      setLoading(false);
    };

    fetchLeaders();
  }, []);

  const handleUploadSuccess = (res) => {
    setFormData({ ...formData, photo_url: res.url });
    setUploading(false);
  };

  const handleUploadError = (err) => {
    console.error('Upload Error:', err);
    setUploading(false);
    alert('Photo upload failed. Please check your ImageKit configuration.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const fetchLeaders = async () => {
      const { data } = await supabase
        .from('leaders')
        .select('*')
        .order('created_at', { ascending: true });
      if (data) setLeaders(data);
    };

    if (editingLeader) {
      const { error } = await supabase
        .from('leaders')
        .update(formData)
        .eq('id', editingLeader.id);
      if (!error) {
        setShowModal(false);
        fetchLeaders();
      }
    } else {
      const { error } = await supabase
        .from('leaders')
        .insert([formData]);
      if (!error) {
        setShowModal(false);
        fetchLeaders();
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to remove this leader?')) {
      const { error } = await supabase
        .from('leaders')
        .delete()
        .eq('id', id);
      if (!error) {
        const { data } = await supabase
          .from('leaders')
          .select('*')
          .order('created_at', { ascending: true });
        if (data) setLeaders(data);
      }
    }
  };

  const openModal = (leader = null) => {
    if (leader) {
      setEditingLeader(leader);
      setFormData({
        name: leader.name,
        role: leader.role,
        department: leader.department || '',
        photo_url: leader.photo_url || '',
      });
    } else {
      setEditingLeader(null);
      setFormData({
        name: '',
        role: '',
        department: '',
        photo_url: '',
      });
    }
    setShowModal(true);
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 bg-white p-6 sm:p-12 md:p-16 rounded-[30px] sm:rounded-[60px] shadow-2xl border border-gray-100 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-scm-blue/5 rounded-full -mr-32 -mt-32 sm:-mr-48 sm:-mt-48 group-hover:scale-150 transition-transform duration-700"></div>
         <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10 relative z-10 w-full md:w-auto">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-scm-blue text-white rounded-2xl sm:rounded-[40px] flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 shrink-0">
               <ShieldCheck size={32} className="sm:w-12 sm:h-12" />
            </div>
            <div>
               <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 mb-2 sm:mb-3 leading-tight">Ministry <span className="text-scm-blue">Leaders</span></h1>
               <p className="text-gray-400 font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-xs flex items-center">
                  <Sparkles size={14} className="mr-2 text-scm-gold shrink-0" />
                  Leadership Team: {leaders.length} Active
               </p>
            </div>
         </div>
         <button
           onClick={() => openModal()}
           className="w-full md:w-auto mt-4 md:mt-0 px-6 sm:px-12 py-4 sm:py-6 bg-scm-blue text-white rounded-2xl sm:rounded-3xl font-black hover:bg-blue-900 transition-all shadow-xl hover:shadow-scm-blue/40 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center group relative z-10 overflow-hidden"
         >
           <UserPlus size={20} className="mr-2 sm:mr-3 group-hover:scale-110 transition-transform sm:w-6 sm:h-6" />
           Appoint Leader
         </button>
      </div>

      {/* Leaders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {loading ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center space-y-6">
             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-scm-blue"></div>
             <p className="text-gray-400 font-black uppercase tracking-widest text-sm">Reviewing Profiles...</p>
          </div>
        ) : leaders.map((leader) => (
          <div key={leader.id} className="group bg-white rounded-[50px] shadow-2xl border border-gray-100 overflow-hidden hover:border-scm-blue/20 hover:scale-[1.03] transition-all duration-700 relative flex flex-col">
             <div className="aspect-[10/12] overflow-hidden relative bg-gray-50">
                {leader.photo_url ? (
                  <img src={leader.photo_url} alt={leader.name} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 opacity-90" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-100">
                     <UserCircle size={120} strokeWidth={1} />
                  </div>
                )}
                
                {/* Role Badge */}
                <div className="absolute top-6 left-6 z-10">
                   <div className="bg-scm-blue text-white px-5 py-2.5 rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-2xl transform -rotate-3 group-hover:rotate-0 transition-transform">
                      {leader.role}
                   </div>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-gradient-to-t from-scm-blue/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center p-8">
                   <div className="flex space-x-4 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                      <button onClick={() => openModal(leader)} className="p-4 bg-white text-scm-blue hover:bg-scm-blue hover:text-white rounded-2xl shadow-xl transition-all transform hover:scale-110">
                         <Edit2 size={20} />
                      </button>
                      <button onClick={() => handleDelete(leader.id)} className="p-4 bg-white text-scm-red hover:bg-scm-red hover:text-white rounded-2xl shadow-xl transition-all transform hover:scale-110">
                         <Trash2 size={20} />
                      </button>
                   </div>
                </div>
             </div>

             <div className="p-6 sm:p-10 text-center flex-grow flex flex-col">
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 mb-2 group-hover:text-scm-blue transition-colors">{leader.name}</h3>
                <p className="text-scm-red text-[10px] font-black uppercase tracking-[0.3em] mb-6">{leader.department || "General Ministry"}</p>
                <div className="mt-auto pt-6 border-t border-gray-50 flex justify-center items-center">
                   <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Added {new Date(leader.created_at).toLocaleDateString()}</span>
                </div>
             </div>
          </div>
        ))}
        {leaders.length === 0 && !loading && (
          <div className="col-span-full py-32 bg-gray-50 rounded-[60px] border-4 border-dashed border-gray-100 flex flex-col items-center justify-center text-center px-10">
             <UserCircle size={80} className="text-gray-100 mb-8" />
             <h3 className="text-3xl font-black text-gray-300 mb-4">No leadership profiles.</h3>
             <p className="text-gray-400 font-medium max-w-sm mb-10">Get started by adding your ministry leaders to the portal.</p>
             <button onClick={() => openModal()} className="px-10 py-5 bg-white text-scm-blue border-2 border-scm-blue/20 rounded-2xl font-black hover:bg-scm-blue hover:text-white transition-all shadow-xl">Appoint First Leader</button>
          </div>
        )}
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
                  {editingLeader ? 'Update Profile' : 'New Leader'}
               </h2>
               <p className="text-white/40 text-[10px] sm:text-xs font-black uppercase tracking-[0.4em]">Leadership Registry Center</p>
            </div>

            <div className="overflow-y-auto w-full p-6 sm:p-14 lg:p-20 flex-1">
            <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
              <div className="space-y-8 sm:space-y-12">
                <div className="space-y-4 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-blue transition-colors">Leader's Full Name</label>
                   <input required className="w-full px-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-blue focus:ring-8 focus:ring-scm-blue/5 transition-all font-black text-gray-900 text-xl" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Bro. John Doe" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-4 group">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-blue transition-colors">Role / Title</label>
                      <div className="relative">
                         <Briefcase size={20} className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-scm-blue transition-colors" />
                         <input required className="w-full pl-16 pr-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-blue focus:ring-8 focus:ring-scm-blue/5 transition-all font-bold text-gray-900" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} placeholder="e.g. President, Secretary" />
                      </div>
                   </div>

                   <div className="space-y-4 group">
                      <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-blue transition-colors">Department</label>
                      <div className="relative">
                         <Building2 size={20} className="absolute left-7 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-scm-blue transition-colors" />
                         <input className="w-full pl-16 pr-8 py-6 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-blue focus:ring-8 focus:ring-scm-blue/5 transition-all font-bold text-gray-900" value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} placeholder="e.g. Choir, Welfare" />
                      </div>
                   </div>
                </div>

                <div className="space-y-4 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] ml-2 group-focus-within:text-scm-blue transition-colors">Leader's Photo (ImageKit)</label>
                   <div className="relative group/upload">
                      <IKContext {...imagekitConfig} authenticator={authenticator}>
                        <IKUpload
                          fileName="leader_photo.jpg"
                          folder={IMAGEKIT_FOLDER_PATH}
                          onUploadStart={() => setUploading(true)}
                          onSuccess={handleUploadSuccess}
                          onError={handleUploadError}
                          className="hidden"
                          id="photo-upload"
                        />
                      </IKContext>
                      <label htmlFor="photo-upload" className="w-full flex items-center px-8 py-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:border-scm-blue hover:bg-scm-blue/5 transition-all group-focus-within:border-scm-blue">
                        {uploading ? <Loader2 size={24} className="animate-spin text-scm-blue mr-4" /> : <Image size={24} className="text-gray-400 group-hover:text-scm-blue mr-4 transition-colors" />}
                        <span className="font-bold text-gray-400 group-hover:text-scm-blue transition-colors">
                           {formData.photo_url ? 'Profile Photo Uploaded' : 'Upload Profile Picture'}
                        </span>
                      </label>
                      {formData.photo_url && (
                        <div className="mt-8 flex justify-center">
                           <div className="relative w-32 h-32 rounded-full overflow-hidden border-8 border-gray-50 shadow-2xl">
                              <img src={formData.photo_url} alt="Preview" className="w-full h-full object-cover" />
                              <button type="button" onClick={() => setFormData({ ...formData, photo_url: '' })} className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                 <X size={24} />
                              </button>
                           </div>
                        </div>
                      )}
                   </div>
                </div>
              </div>

              <div className="pt-6 sm:pt-10 flex flex-col sm:flex-row gap-4 sm:gap-8">
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="w-full sm:flex-grow py-5 sm:py-8 bg-scm-blue text-white rounded-[20px] sm:rounded-[35px] font-black text-lg sm:text-xl hover:bg-blue-900 transition-all shadow-2xl hover:shadow-scm-blue/40 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center disabled:opacity-50 group order-1"
                >
                  {submitting ? <Loader2 size={24} className="animate-spin sm:w-7 sm:h-7" /> : (
                    <>
                      <Save size={20} className="mr-2 sm:mr-4 group-hover:scale-110 transition-transform sm:w-7 sm:h-7 shrink-0" />
                      {editingLeader ? 'Save Changes' : 'Confirm Appointment'}
                    </>
                  )}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="w-full sm:w-auto px-6 sm:px-14 py-5 sm:py-8 bg-gray-50 text-gray-400 rounded-[20px] sm:rounded-[35px] font-black hover:bg-gray-100 hover:text-gray-600 transition-all shadow-inner transform active:scale-95 order-2">
                  Cancel
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

export default AdminLeaders;
