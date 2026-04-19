import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Settings as SettingsIcon, Save, Globe, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { IKContext, IKUpload } from 'imagekitio-react';
import { imagekitConfig, IMAGEKIT_FOLDER_PATH, authenticator } from '../services/imagekit';

const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingSlide, setUploadingSlide] = useState(null);
  const [settings, setSettings] = useState({
    ministry_name: '',
    ministry_logo: 'https://ik.imagekit.io/scmchurch/WhatsApp_Image_2026-03-27_at_05.29.17-removebg-preview.png',
    vision: '',
    mission: '',
    description: '',
    phone: '',
    email: '',
    address: '',
    social_links: {
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: ''
    },
    pillars: [],
    hero_slides: []
  });

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('settings')
        .select('*')
        .single();

      if (data) {
        setSettings(data);
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const { error } = await supabase
      .from('settings')
      .update(settings)
      .eq('id', settings.id);

    if (!error) {
      toast.success('Settings updated successfully!');
    } else {
      toast.error('Error updating settings: ' + error.message);
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scm-blue"></div>
        <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Loading Ministry Profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-10 md:p-14 rounded-[50px] shadow-2xl border border-gray-100">
        <div className="flex items-center space-x-8">
           <div className="w-20 h-20 bg-scm-blue text-white rounded-[30px] flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <SettingsIcon size={40} />
           </div>
           <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2">Ministry <span className="text-scm-blue">Settings</span></h1>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">Global Identity Management</p>
           </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* General Information */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white p-10 md:p-14 rounded-[50px] shadow-2xl border border-gray-100 space-y-10">
            <h3 className="text-2xl font-black text-gray-900 flex items-center underline decoration-scm-blue/20 underline-offset-8 mb-4">
               <Globe className="mr-4 text-scm-blue" size={28} /> Core Identity
            </h3>
            
            <div className="grid grid-cols-1 gap-10">
              <div className="space-y-3 group">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-scm-blue transition-colors">Official Ministry Name</label>
                <input
                  required
                  className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-bold text-gray-900"
                  value={settings.ministry_name}
                  onChange={(e) => setSettings({ ...settings, ministry_name: e.target.value })}
                  placeholder="Successful Christian Missions"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3 group">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-scm-blue transition-colors">Vision Statement</label>
                  <textarea
                    rows="3"
                    className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-bold text-gray-900"
                    value={settings.vision}
                    onChange={(e) => setSettings({ ...settings, vision: e.target.value })}
                    placeholder="Enter ministry vision..."
                  />
                </div>
                <div className="space-y-3 group">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-scm-blue transition-colors">Mission Statement</label>
                  <textarea
                    rows="3"
                    className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-bold text-gray-900"
                    value={settings.mission}
                    onChange={(e) => setSettings({ ...settings, mission: e.target.value })}
                    placeholder="Enter ministry mission..."
                  />
                </div>
              </div>

              <div className="space-y-3 group">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-scm-blue transition-colors">Brief History / Description</label>
                <textarea
                  rows="5"
                  className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-bold text-gray-900"
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                />
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-10 grid grid-cols-1 gap-10">
              <h4 className="text-xl font-black text-gray-900 border-l-4 border-scm-blue pl-4">Mission Pillars</h4>
              {(settings.pillars || []).map((pillar, idx) => (
                <div key={`pillar-${idx}`} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-black uppercase tracking-widest text-gray-400">Pillar {idx + 1}</span>
                   </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <input
                       className="px-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-scm-blue font-bold text-sm"
                       value={pillar.title}
                       onChange={(e) => {
                         const newPillars = [...settings.pillars];
                         newPillars[idx].title = e.target.value;
                         setSettings({ ...settings, pillars: newPillars });
                       }}
                       placeholder="Title"
                     />
                     <input
                       className="px-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-scm-blue font-bold text-sm"
                       value={pillar.icon}
                       onChange={(e) => {
                         const newPillars = [...settings.pillars];
                         newPillars[idx].icon = e.target.value;
                         setSettings({ ...settings, pillars: newPillars });
                       }}
                       placeholder="Lucide Icon Name"
                     />
                     <textarea
                       className="px-4 py-3 sm:col-span-2 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-scm-blue font-medium text-sm"
                       value={pillar.description}
                       onChange={(e) => {
                         const newPillars = [...settings.pillars];
                         newPillars[idx].description = e.target.value;
                         setSettings({ ...settings, pillars: newPillars });
                       }}
                       placeholder="Description"
                       rows="2"
                     />
                   </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-10 grid grid-cols-1 gap-10">
              <h4 className="text-xl font-black text-gray-900 border-l-4 border-scm-blue pl-4">Hero Slides</h4>
              {(settings.hero_slides || []).map((slide, idx) => (
                <div key={`slide-${idx}`} className="bg-gray-50 p-6 rounded-3xl border border-gray-100 space-y-4">
                   <div className="flex justify-between items-center mb-2">
                     <span className="text-xs font-black uppercase tracking-widest text-gray-400">Slide {idx + 1}</span>
                   </div>
                   <div className="grid grid-cols-1 gap-4">
                     <input
                       className="px-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-scm-blue font-bold text-sm"
                       value={slide.title}
                       onChange={(e) => {
                         const newSlides = [...settings.hero_slides];
                         newSlides[idx].title = e.target.value;
                         setSettings({ ...settings, hero_slides: newSlides });
                       }}
                       placeholder="Main Title"
                     />
                     <input
                       className="px-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-scm-blue font-bold text-sm"
                       value={slide.tag}
                       onChange={(e) => {
                         const newSlides = [...settings.hero_slides];
                         newSlides[idx].tag = e.target.value;
                         setSettings({ ...settings, hero_slides: newSlides });
                       }}
                       placeholder="Small Tag / Overline"
                     />
                     <div className="relative">
                        <IKContext {...imagekitConfig} authenticator={authenticator}>
                          <IKUpload
                            fileName={`hero_slide_${idx}.jpg`}
                            folder={IMAGEKIT_FOLDER_PATH}
                            onUploadStart={() => setUploadingSlide(idx)}
                            onSuccess={(res) => {
                              const newSlides = [...settings.hero_slides];
                              newSlides[idx].url = res.url;
                              setSettings({ ...settings, hero_slides: newSlides });
                              setUploadingSlide(null);
                              toast.success(`Slide ${idx + 1} image uploaded!`);
                            }}
                            onError={(err) => {
                              console.error(err);
                              setUploadingSlide(null);
                              toast.error(`Failed to upload slide ${idx + 1} image.`);
                            }}
                            className="hidden"
                            id={`slide-upload-${idx}`}
                          />
                        </IKContext>
                        <label htmlFor={`slide-upload-${idx}`} className="w-full flex justify-center items-center px-4 py-3 bg-white border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-scm-blue hover:bg-scm-blue/5 transition-all">
                          {uploadingSlide === idx ? <Loader2 size={16} className="animate-spin text-scm-blue mr-2" /> : <ImageIcon size={16} className="text-gray-400 mr-2 transition-colors" />}
                          <span className="font-bold text-gray-500 text-sm">
                             {slide.url ? 'Change Slide Image' : 'Upload Slide Image'}
                          </span>
                        </label>
                     </div>
                     <textarea
                       className="px-4 py-3 bg-white border-2 border-gray-100 rounded-xl focus:outline-none focus:border-scm-blue font-medium text-sm"
                       value={slide.subtitle}
                       onChange={(e) => {
                         const newSlides = [...settings.hero_slides];
                         newSlides[idx].subtitle = e.target.value;
                         setSettings({ ...settings, hero_slides: newSlides });
                       }}
                       placeholder="Subtitle describing the slide"
                       rows="2"
                     />
                   </div>
                </div>
              ))}
            </div>

          </div>

          {/* Contact Information */}
          <div className="bg-white p-10 md:p-14 rounded-[50px] shadow-2xl border border-gray-100 space-y-10">
            <h3 className="text-2xl font-black text-gray-900 flex items-center underline decoration-scm-red/20 underline-offset-8 mb-4">
               <MapPin className="mr-4 text-scm-red" size={28} /> Global Contact Info
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-3 group">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-scm-blue transition-colors">Official Phone</label>
                <div className="relative">
                  <Phone size={18} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-scm-blue transition-colors" />
                  <input
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-bold text-gray-900"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    placeholder="+234..."
                  />
                </div>
              </div>
              <div className="space-y-3 group">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-scm-blue transition-colors">Official Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-scm-blue transition-colors" />
                  <input
                    type="email"
                    className="w-full pl-14 pr-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-bold text-gray-900"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    placeholder="info@scm.org"
                  />
                </div>
              </div>
              <div className="md:col-span-2 space-y-3 group">
                <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-scm-blue transition-colors">Physical Address</label>
                <textarea
                  rows="3"
                  className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-bold text-gray-900"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  placeholder="Enter full address..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar: Logo & Socials */}
        <div className="space-y-10">
          <div className="bg-white p-10 rounded-[50px] shadow-2xl border border-gray-100 space-y-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-gray-50 opacity-10 group-hover:opacity-100 transition-opacity">
               <ImageIcon size={100} />
            </div>
            <h3 className="text-xl font-black text-gray-900 underline decoration-scm-blue/20 underline-offset-8 relative z-10">Branding</h3>
            
            <div className="space-y-6 relative z-10 text-center">
              <div className="w-40 h-40 mx-auto bg-gray-50 rounded-[40px] border-4 border-dashed border-gray-100 flex items-center justify-center overflow-hidden relative group/logo">
                {settings.ministry_logo ? (
                  <img src={settings.ministry_logo} alt="Logo" className="w-full h-full object-contain p-4" />
                ) : (
                  <ImageIcon size={48} className="text-gray-200" />
                )}
              </div>
              <div className="space-y-3 group/upload">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Upload Ministry Logo</label>
                <div className="relative">
                   <IKContext {...imagekitConfig} authenticator={authenticator}>
                     <IKUpload
                       fileName="ministry_logo.png"
                       folder={IMAGEKIT_FOLDER_PATH}
                       onUploadStart={() => setUploadingLogo(true)}
                       onSuccess={(res) => {
                         setSettings({ ...settings, ministry_logo: res.url });
                         setUploadingLogo(false);
                         toast.success('Logo uploaded successfully!');
                       }}
                       onError={(err) => {
                         console.error(err);
                         setUploadingLogo(false);
                         toast.error('Logo upload failed. Verify ImageKit keys.');
                       }}
                       className="hidden"
                       id="logo-upload"
                     />
                   </IKContext>
                   <label htmlFor="logo-upload" className="w-full flex justify-center items-center px-4 py-3 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-scm-blue hover:bg-scm-blue/5 transition-all">
                     {uploadingLogo ? <Loader2 size={16} className="animate-spin text-scm-blue mr-2" /> : <ImageIcon size={16} className="text-gray-400 group-hover/upload:text-scm-blue mr-2 transition-colors" />}
                     <span className="font-bold text-gray-400 group-hover/upload:text-scm-blue transition-colors text-sm">
                        {settings.ministry_logo ? 'Change Logo Image' : 'Click to Upload Logo'}
                     </span>
                   </label>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-10 rounded-[50px] shadow-2xl border border-gray-100 space-y-8">
            <h3 className="text-xl font-black text-gray-900 underline decoration-scm-red/20 underline-offset-8">Social Presence</h3>
            
            <div className="space-y-6">
              {[
                { key: 'facebook', icon: Facebook, color: 'text-blue-600', label: 'Facebook' },
                { key: 'twitter', icon: Twitter, color: 'text-sky-400', label: 'Twitter (X)' },
                { key: 'instagram', icon: Instagram, color: 'text-pink-600', label: 'Instagram' },
                { key: 'youtube', icon: Youtube, color: 'text-red-600', label: 'YouTube' },
              ].map((social) => (
                <div key={social.key} className="space-y-2 group">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center">
                    <social.icon size={14} className={`mr-2 ${social.color}`} /> {social.label}
                  </label>
                  <input
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-xl focus:outline-none focus:border-scm-blue transition-all font-bold text-gray-900 text-sm"
                    value={settings.social_links[social.key]}
                    onChange={(e) => setSettings({ 
                      ...settings, 
                      social_links: { ...settings.social_links, [social.key]: e.target.value } 
                    })}
                    placeholder={`https://${social.key}.com/...`}
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full py-6 bg-scm-blue text-white rounded-[30px] font-black text-lg hover:bg-blue-900 transition-all shadow-2xl hover:shadow-scm-blue/40 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center disabled:opacity-70 group"
          >
            {submitting ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <>
                <Save size={24} className="mr-3 group-hover:scale-125 transition-transform" />
                Publish Updates
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;