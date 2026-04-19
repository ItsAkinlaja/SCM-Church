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
    <div className="flex flex-col min-h-screen bg-scm-cream">
      <PageHeader 
        title="Testimonies" 
        subtitle="Voices of Victory & Faith"
        image="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1173&auto=format&fit=crop"
      />

      {/* Main Content */}
      <section className="py-32 relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* Form Column - Premium Card */}
            <div className="lg:col-span-4">
              {submitted ? (
                <div className="premium-card bg-white p-12 text-center animate-scale-up">
                   <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner">
                      <CheckCircle2 size={48} className="stroke-[1.5px]" />
                   </div>
                   <h3 className="text-3xl font-serif font-bold text-scm-blue mb-6">Praise God!</h3>
                   <p className="text-slate-500 font-medium mb-10 leading-relaxed italic">"Your testimony has been submitted and is pending review. We will share it with the community soon."</p>
                   <button 
                     onClick={() => setSubmitted(false)}
                     className="btn-primary w-full gold-gradient text-scm-blue border-none"
                   >
                     Share Another
                   </button>
                </div>
              ) : (
                <div className="premium-card bg-white p-12 sticky top-32 overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[80px] transition-all duration-500 group-hover:scale-110" />
                  <div className="relative z-10">
                    <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.4em] text-xs mb-6 block">God's Faithfulness</span>
                    <h2 className="text-3xl font-serif font-bold text-scm-blue mb-4">Share Yours</h2>
                    <p className="text-slate-500 font-medium mb-10 leading-relaxed">Let the world know what God has done for you.</p>
                    
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="space-y-2">
                         <label className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                         <input 
                           required 
                           type="text" 
                           className="w-full px-0 py-4 bg-transparent border-b-2 border-slate-100 focus:outline-none focus:border-scm-accent transition-all font-serif text-lg text-scm-blue placeholder:text-slate-300" 
                           placeholder="Your Name"
                           value={formData.name}
                           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Testimony Title</label>
                         <input 
                           required 
                           type="text" 
                           className="w-full px-0 py-4 bg-transparent border-b-2 border-slate-100 focus:outline-none focus:border-scm-accent transition-all font-serif text-lg text-scm-blue placeholder:text-slate-300" 
                           placeholder="e.g. Divine Provision"
                           value={formData.title}
                           onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">The Story</label>
                         <textarea 
                           required 
                           rows="4" 
                           className="w-full px-0 py-4 bg-transparent border-b-2 border-slate-100 focus:outline-none focus:border-scm-accent transition-all font-serif text-lg text-scm-blue placeholder:text-slate-300 resize-none" 
                           placeholder="Tell us what God did..."
                           value={formData.content}
                           onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                         ></textarea>
                      </div>
                      <button 
                        type="submit" 
                        disabled={submitting}
                        className="btn-primary w-full gold-gradient text-scm-blue border-none shadow-2xl shadow-scm-accent/20 flex items-center justify-center group disabled:opacity-70"
                      >
                        {submitting ? <Loader2 size={24} className="animate-spin" /> : (
                          <>Submit Testimony <ArrowRight size={20} className="ml-3 group-hover:translate-x-2 transition-transform" /></>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* List Column */}
            <div className="lg:col-span-8">
               <div className="mb-16">
                 <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.4em] text-xs mb-6 block">Community Praise</span>
                 <h2 className="text-4xl md:text-7xl font-serif font-bold text-scm-blue leading-tight tracking-tight">Voices of Victory</h2>
               </div>
               
               {loading ? (
                 <div className="py-32 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scm-accent"></div>
                 </div>
               ) : (
                 <div className="grid grid-cols-1 gap-12">
                    {testimonies.map((t) => (
                      <div key={t.id} className="premium-card bg-white p-12 md:p-16 relative group overflow-hidden">
                         <Quote size={80} className="absolute top-10 right-10 text-slate-50 group-hover:text-scm-accent/10 transition-colors duration-500" />
                         <div className="relative z-10">
                            <h3 className="text-3xl font-serif font-bold text-scm-blue mb-8 group-hover:text-scm-accent transition-colors duration-500 leading-tight">
                              {t.title}
                            </h3>
                            <div className="relative mb-12">
                              <div className="absolute -left-8 top-0 h-full w-1 bg-scm-accent/30 rounded-full" />
                              <p className="text-slate-600 font-serif italic text-xl leading-relaxed">"{t.content}"</p>
                            </div>
                            <div className="flex items-center gap-6 pt-10 border-t border-slate-50">
                               <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-scm-accent shadow-inner group-hover:bg-scm-blue group-hover:text-white transition-all duration-500">
                                  <UserCircle size={32} className="stroke-[1.5px]" />
                               </div>
                               <div>
                                  <div className="text-xl font-serif font-bold text-scm-blue">{t.name}</div>
                                  <div className="text-[10px] font-sans font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">
                                    {new Date(t.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
                                  </div>
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                    {testimonies.length === 0 && !loading && (
                      <div className="py-32 text-center bg-white rounded-[3rem] border border-dashed border-slate-200">
                         <Quote size={64} className="mx-auto mb-8 text-slate-100" />
                         <p className="text-2xl font-serif italic text-slate-400">"No testimonies shared yet. Be the first to share your victory!"</p>
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
