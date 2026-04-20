import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { Video, Trash2, Plus, X, UploadCloud, Loader2, PlayCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { IKContext, IKUpload } from 'imagekitio-react';
import { imagekitConfig, IMAGEKIT_FOLDER_PATH, authenticator } from '../services/imagekit';

const Sermons = () => {
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    preacher: 'Pastor (Prof.) Rufus A. Adedoyin', 
    service_type: 'Sunday Service', 
    video_url: '', 
    thumbnail_url: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetchSermons = useCallback(async () => {
    const { data, error } = await supabase
      .from('sermons')
      .select('*')
      .order('date', { ascending: false });

    if (!error && data) setSermons(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSermons();
  }, [fetchSermons]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from('sermons').insert([formData]);
    
    if (!error) {
      setShowForm(false);
      setFormData({ 
        title: '', 
        preacher: 'Pastor (Prof.) Rufus A. Adedoyin', 
        service_type: 'Sunday Service', 
        video_url: '', 
        thumbnail_url: '',
        date: new Date().toISOString().split('T')[0]
      });
      fetchSermons();
      toast.success("Sermon added successfully!");
    } else {
      toast.error("Error adding sermon: " + error.message);
    }
    setSaving(false);
  };

  const deleteSermon = async (id) => {
    if (window.confirm('Are you sure you want to delete this sermon record?')) {
      const { error } = await supabase.from('sermons').delete().eq('id', id);
      if (!error) {
        setSermons(sermons.filter(s => s.id !== id));
        toast.success("Sermon deleted successfully!");
      } else {
        toast.error("Failed to delete sermon: " + error.message);
      }
    }
  };

  // Helper to extract YouTube ID for auto-thumbnail if thumbnail not provided
  const getYouTubeThumbnail = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&]{11})/);
    return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null;
  };

  return (
    <div className="space-y-6 sm:space-y-12 pb-20 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">Sermons & Media</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Manage videos displayed in the 'Catch Up On The Word' section</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary w-full sm:w-auto"
        >
          <Plus size={20} className="inline mr-2" /> Add Sermon
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative animate-fade-in my-8 max-h-[90vh] flex flex-col">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors z-10">
              <X size={20} />
            </button>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-scm-blue mb-6 pr-8">Add New Sermon</h2>
            
            <div className="overflow-y-auto flex-1 pr-2 -mr-2">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Sermon Title *</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-scm-blue" />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Preacher *</label>
                <input required type="text" value={formData.preacher} onChange={e => setFormData({...formData, preacher: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-scm-blue" />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Service Type *</label>
                <select required value={formData.service_type} onChange={e => setFormData({...formData, service_type: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-scm-blue">
                  <option>Sunday Service</option>
                  <option>Bible Study</option>
                  <option>Special Event</option>
                  <option>Retreat Message</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Date Delivered *</label>
                <input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-scm-blue" />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Video URL (YouTube/Vimeo) *</label>
                <input required type="url" value={formData.video_url} onChange={e => {
                  const url = e.target.value;
                  const ytThumb = getYouTubeThumbnail(url);
                  setFormData({...formData, video_url: url, thumbnail_url: ytThumb || formData.thumbnail_url});
                }} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-scm-blue" placeholder="https://youtube.com/watch?v=..." />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Custom Thumbnail (Optional)</label>
                <div className="relative group/upload">
                   <IKContext {...imagekitConfig} authenticator={authenticator}>
                     <IKUpload
                       fileName="sermon_thumbnail.jpg"
                       folder={IMAGEKIT_FOLDER_PATH}
                       onUploadStart={() => setUploading(true)}
                       onSuccess={(res) => {
                         setFormData({...formData, thumbnail_url: res.url});
                         setUploading(false);
                         toast.success('Thumbnail uploaded successfully!');
                       }}
                       onError={(err) => {
                         console.error(err);
                         setUploading(false);
                         toast.error('Thumbnail upload failed.');
                       }}
                       className="hidden"
                       id="thumbnail-upload"
                     />
                   </IKContext>
                   <label htmlFor="thumbnail-upload" className="w-full flex items-center px-4 py-3 bg-gray-50 border border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-scm-blue hover:bg-scm-blue/5 transition-all group-focus-within:border-scm-blue">
                     {uploading ? <Loader2 size={20} className="animate-spin text-scm-blue mr-3" /> : <UploadCloud size={20} className="text-gray-400 group-hover:text-scm-blue mr-3 transition-colors" />}
                     <span className="font-bold text-gray-400 group-hover:text-scm-blue transition-colors text-sm">
                        {formData.thumbnail_url ? 'Change Thumbnail Image' : 'Upload Custom Thumbnail (Auto-fetches from YouTube if empty)'}
                     </span>
                   </label>
                </div>
              </div>

              {formData.thumbnail_url && (
                <div className="md:col-span-2 pt-2">
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Thumbnail Preview:</p>
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 object-cover w-1/2">
                    <img src={formData.thumbnail_url} alt="Preview" className="w-full h-full object-cover" onError={(e) => {e.target.style.display='none';}} />
                  </div>
                </div>
              )}

              <div className="md:col-span-2 flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-100 mt-4 pb-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 font-bold text-gray-600 hover:text-gray-900 transition-colors w-full sm:w-auto text-center order-2 sm:order-1">Cancel</button>
                <button type="submit" disabled={saving} className="btn-primary disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto order-1 sm:order-2">
                  {saving ? <><Loader2 className="animate-spin inline mr-2" size={18} /> Saving...</> : 'Save Sermon'}
                </button>
              </div>
            </form>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-scm-blue" size={40} /></div>
      ) : sermons.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-20 flex flex-col items-center text-center text-gray-400">
          <Video size={64} className="mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">No Sermons Uploaded</h3>
          <p className="mb-6 max-w-sm">Add a YouTube link to feature your latest message on the homepage.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={20} className="inline mr-2" /> Add Sermon</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sermons.map(sermon => (
            <div key={sermon.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm flex flex-col group relative">
              {sermons[0].id === sermon.id && (
                <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-scm-accent text-white text-xs font-bold uppercase tracking-widest rounded shadow-md">
                  Active Homepage Video
                </div>
              )}
              
              <div className="aspect-video bg-slate-900 relative">
                <img src={sermon.thumbnail_url || 'https://images.unsplash.com/photo-1551829142-d9b8e5fa666e?auto=format&fit=crop&q=80'} alt="Thumbnail" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <a href={sermon.video_url} target="_blank" rel="noreferrer" className="absolute inset-0 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-black/40 transition-all">
                  <PlayCircle size={48} className="mb-2 drop-shadow-lg" />
                  <span className="text-sm font-bold tracking-widest uppercase text-shadow-sm">Watch Video</span>
                </a>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-serif font-bold text-xl text-gray-900 mb-2 line-clamp-2">{sermon.title}</h3>
                <p className="text-sm text-gray-600 font-medium mb-1">{sermon.preacher}</p>
                <div className="flex justify-between items-center text-xs text-gray-400 font-bold uppercase tracking-widest mt-auto pt-4">
                  <span>{new Date(sermon.date).toLocaleDateString()}</span>
                  <span>{sermon.service_type}</span>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                <button onClick={() => deleteSermon(sermon.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded flex items-center transition-colors">
                  <Trash2 size={16} className="mr-2" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Sermons;
