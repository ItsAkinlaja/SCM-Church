import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Quote, Send, CheckCircle2, Loader2, MessageSquare, ArrowRight, UserCircle } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const Testimonies = () => {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const fetchTestimonies = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('testimonies')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      if (data) setTestimonies(data);
      setLoading(false);
    };

    fetchTestimonies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('testimonies').insert([formData]);
    if (!error) {
      setSubmitted(true);
      setFormData({ name: '', title: '', content: '' });
    }
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PageHeader 
        title="Testimonies" 
        subtitle="And they overcame him by the blood of the Lamb and by the word of their testimony."
        image="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1173&auto=format&fit=crop"
      />

      {/* Main Content */}
      <section className="py-16 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Form Column */}
            <div className="lg:col-span-1">
              {submitted ? (
                <div className="bg-gray-50 rounded-[40px] p-12 text-center border border-gray-100 shadow-inner animate-scale-up">
                   <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle2 size={40} />
                   </div>
                   <h3 className="text-2xl font-black text-gray-900 mb-4">Praise God!</h3>
                   <p className="text-gray-500 font-medium mb-8">Your testimony has been submitted and is pending review. We will share it with the community soon.</p>
                   <button 
                     onClick={() => setSubmitted(false)}
                     className="w-full py-4 bg-scm-blue text-white rounded-2xl font-black hover:bg-blue-900 transition-all"
                   >
                     Share Another
                   </button>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-[40px] p-10 border border-gray-100 shadow-inner sticky top-32">
                  <h2 className="text-3xl font-black text-gray-900 mb-4 flex items-center">
                     Share Yours <MessageSquare size={24} className="ml-3 text-scm-red" />
                  </h2>
                  <p className="text-gray-500 font-medium mb-8">Let the world know what God has done for you.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Full Name</label>
                       <input 
                         required 
                         type="text" 
                         className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue transition-all font-medium" 
                         placeholder="Your Name"
                         value={formData.name}
                         onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">Testimony Title</label>
                       <input 
                         required 
                         type="text" 
                         className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue transition-all font-medium" 
                         placeholder="e.g. Divine Provision"
                         value={formData.title}
                         onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-2">The Story</label>
                       <textarea 
                         required 
                         rows="6" 
                         className="w-full px-6 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue transition-all font-medium resize-none" 
                         placeholder="Tell us what God did..."
                         value={formData.content}
                         onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                       ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      disabled={submitting}
                      className="w-full py-5 bg-scm-blue text-white rounded-2xl font-black hover:bg-blue-900 transition-all shadow-xl flex items-center justify-center disabled:opacity-70"
                    >
                      {submitting ? <Loader2 size={24} className="animate-spin" /> : (
                        <>Submit Testimony <ArrowRight size={20} className="ml-2" /></>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* List Column */}
            <div className="lg:col-span-2 space-y-12">
               <h2 className="text-4xl font-black text-gray-900 border-l-8 border-scm-red pl-6 leading-none py-2">Community Praise</h2>
               
               {loading ? (
                 <div className="py-20 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scm-blue"></div>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 gap-8">
                    {testimonies.map((t) => (
                      <div key={t.id} className="group bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 relative">
                         <Quote size={60} className="absolute top-8 right-8 text-gray-50 group-hover:text-scm-blue/5 transition-colors" />
                         <div className="relative z-10">
                            <h3 className="text-3xl font-black text-gray-900 mb-4 group-hover:text-scm-blue transition-colors leading-tight">{t.title}</h3>
                            <p className="text-gray-500 text-lg font-medium leading-relaxed mb-10 italic">"{t.content}"</p>
                            <div className="flex items-center space-x-4 pt-8 border-t border-gray-50">
                               <div className="w-12 h-12 bg-scm-red/10 rounded-xl flex items-center justify-center text-scm-red">
                                  <UserCircle size={24} />
                               </div>
                               <div>
                                  <div className="font-black text-gray-900">{t.name}</div>
                                  <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">{new Date(t.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</div>
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                    {testimonies.length === 0 && !loading && (
                      <div className="py-20 text-center bg-gray-50 rounded-[40px] border-4 border-dashed border-gray-100">
                         <Quote size={64} className="mx-auto mb-6 text-gray-200" />
                         <p className="text-xl font-black text-gray-300">No testimonies shared yet. Be the first to share!</p>
                      </div>
                    )}
                 </div>
               )}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Testimonies;
