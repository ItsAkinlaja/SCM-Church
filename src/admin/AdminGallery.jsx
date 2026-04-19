import { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { Image as ImageIcon, Trash2, Plus, X, UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';
import { IKContext, IKUpload } from 'imagekitio-react';
import { imagekitConfig, authenticator, IMAGEKIT_FOLDER_PATH } from '../services/imagekit';

const AdminGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', image_url: '', category: 'General' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const ikUploadRef = useRef(null);

  const fetchGallery = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setImages(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Simple URL validation
    if (!formData.image_url.startsWith('http')) {
      alert("Please provide a valid image URL starting with http:// or https://");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from('gallery').insert([formData]);
    
    if (!error) {
      setShowForm(false);
      setFormData({ title: '', image_url: '', category: 'General' });
      setUploading(false);
      fetchGallery();
    } else {
      alert("Error adding image: " + error.message);
    }
    setSaving(false);
  };

  const deleteImage = async (id) => {
    if (window.confirm('Are you sure you want to delete this image from the gallery?')) {
      const { error } = await supabase.from('gallery').delete().eq('id', id);
      if (!error) {
        setImages(images.filter(img => img.id !== id));
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">Photo Gallery</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Manage images displayed on the public gallery page</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="btn-primary w-full sm:w-auto"
        >
          <Plus size={20} className="inline mr-2" /> Add Image
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-fade-in my-8 max-h-[90vh] flex flex-col">
            <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors z-10">
              <X size={20} />
            </button>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-scm-blue mb-6 pr-8">Add New Image</h2>
            
            <div className="overflow-y-auto flex-1 pr-2 -mr-2">
              <IKContext 
                publicKey={imagekitConfig.publicKey} 
                urlEndpoint={imagekitConfig.urlEndpoint} 
                authenticator={authenticator}
              >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Image Title (Optional)</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-scm-blue focus:ring-2 focus:ring-scm-blue/20 transition-all font-medium" 
                    placeholder="e.g. Sunday Worship Setup"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-2">Upload Image *</label>
                  
                  {!formData.image_url ? (
                    <div className={`relative border-2 ${uploading ? 'border-scm-blue bg-scm-blue/5' : 'border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'} rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer group`}>
                      {uploading ? (
                        <>
                          <Loader2 size={32} className="text-scm-blue animate-spin mb-3" />
                          <p className="text-sm font-bold text-scm-blue">Uploading to ImageKit...</p>
                          <p className="text-xs text-gray-400 mt-1">Please do not close this window</p>
                        </>
                      ) : (
                        <>
                          <UploadCloud size={40} className="text-gray-400 group-hover:text-scm-blue transition-colors mb-3" />
                          <p className="text-sm font-medium text-gray-600">Click to browse or drag and drop</p>
                          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP (Max 5MB)</p>
                          
                          <IKUpload
                            fileName="gallery_image"
                            folder={`${IMAGEKIT_FOLDER_PATH}/gallery`}
                            tags={["gallery"]}
                            useUniqueFileName={true}
                            onUploadStart={() => setUploading(true)}
                            onSuccess={(res) => {
                              setFormData({...formData, image_url: res.url});
                              setUploading(false);
                            }}
                            onError={(err) => {
                              console.error(err);
                              alert("Upload failed. Verify ImageKit keys and permissions.");
                              setUploading(false);
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center text-green-700">
                        <CheckCircle2 size={24} className="mr-3 text-green-500" />
                        <div>
                          <p className="font-bold text-sm">Image Uploaded Successfully!</p>
                          <a href={formData.image_url} target="_blank" rel="noreferrer" className="text-xs text-green-600 hover:text-green-800 underline mt-1 block truncate max-w-xs cursor-pointer">
                            {formData.image_url}
                          </a>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => setFormData({...formData, image_url: ''})}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                        title="Remove image and upload another"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  )}
                </div>

                {formData.image_url && (
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-2">Preview:</p>
                    <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 object-cover">
                      <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-100 pb-2">
                  <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 font-bold text-gray-600 hover:text-gray-900 transition-colors w-full sm:w-auto text-center order-2 sm:order-1">Cancel</button>
                  <button type="submit" disabled={saving || uploading || !formData.image_url} className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto order-1 sm:order-2">
                    {saving ? <><Loader2 className="animate-spin inline mr-2" size={18} /> Saving...</> : 'Save Image'}
                  </button>
                </div>
              </form>
            </IKContext>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-scm-blue" size={40} /></div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-20 flex flex-col items-center text-center text-gray-400">
          <ImageIcon size={64} className="mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-gray-600 mb-2">No Images Uploaded</h3>
          <p className="mb-6 max-w-sm">The gallery is currently empty. Add your first image to populate the public gallery page.</p>
          <button onClick={() => setShowForm(true)} className="btn-primary"><Plus size={20} className="inline mr-2" /> Add Image</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map(img => (
            <div key={img.id} className="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm group">
              <div className="aspect-square bg-gray-100 relative overflow-hidden">
                <img src={img.image_url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <button onClick={() => deleteImage(img.id)} className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 hover:scale-110 transition-all shadow-lg" title="Delete Image">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
              {img.title && (
                <div className="p-4 border-t border-gray-100">
                  <h3 className="font-bold text-gray-900 truncate">{img.title}</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{new Date(img.created_at).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminGallery;
