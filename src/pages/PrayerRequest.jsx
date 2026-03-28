import { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { Send, Heart, ShieldCheck, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const PrayerRequest = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    request: '',
    is_private: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('prayer_requests').insert([formData]);
    if (!error) {
      setSubmitted(true);
      setFormData({ name: '', phone: '', request: '', is_private: false });
    }
    setSubmitting(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PageHeader 
        title="Prayer Requests" 
        subtitle="You don't have to walk alone. Our prayer team is ready to stand with you in faith."
        image="https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1974&auto=format&fit=crop"
      />

      {/* Main Content */}
      <section className="py-16 relative z-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {submitted ? (
            <div className="bg-white rounded-[50px] p-16 text-center shadow-2xl border border-gray-100 animate-scale-up">
               <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10">
                  <CheckCircle2 size={48} />
               </div>
               <h2 className="text-4xl font-black text-gray-900 mb-6">Request Received</h2>
               <p className="text-gray-500 text-lg mb-12 font-medium leading-relaxed">
                  Thank you for reaching out. Our prayer team has received your request and will be lifting you up in prayer. God bless you.
               </p>
               <button 
                 onClick={() => setSubmitted(false)}
                 className="px-10 py-5 bg-scm-blue text-white rounded-2xl font-black hover:bg-blue-900 transition-all"
               >
                 Submit Another Request
               </button>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-[50px] p-12 lg:p-20 shadow-inner border border-gray-100">
              <h2 className="text-4xl font-black text-gray-900 mb-4 flex items-center">
                 Share Your Burden <Heart size={32} className="ml-4 text-scm-red" />
              </h2>
              <p className="text-gray-500 text-lg mb-12 font-medium">Your request will be handled with utmost care and confidentiality.</p>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Full Name</label>
                     <input 
                       required 
                       type="text" 
                       className="w-full px-8 py-5 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue transition-all font-medium" 
                       placeholder="Your Name"
                       value={formData.name}
                       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Phone Number</label>
                     <input 
                       type="text" 
                       className="w-full px-8 py-5 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue transition-all font-medium" 
                       placeholder="+234..."
                       value={formData.phone}
                       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                     />
                  </div>
                </div>
                
                <div className="space-y-2">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Prayer Request</label>
                   <textarea 
                     required 
                     rows="6" 
                     className="w-full px-8 py-5 bg-white border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue transition-all font-medium resize-none" 
                     placeholder="How can we pray for you?"
                     value={formData.request}
                     onChange={(e) => setFormData({ ...formData, request: e.target.value })}
                   ></textarea>
                </div>

                <div className="flex items-center space-x-4 p-6 bg-white rounded-2xl border border-gray-100">
                   <input 
                     type="checkbox" 
                     id="private" 
                     className="w-6 h-6 rounded-lg text-scm-blue focus:ring-scm-blue"
                     checked={formData.is_private}
                     onChange={(e) => setFormData({ ...formData, is_private: e.target.checked })}
                   />
                   <label htmlFor="private" className="text-sm font-bold text-gray-600 cursor-pointer">
                      Keep this request private (Only seen by the Pastor/Prayer Team)
                   </label>
                </div>

                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full md:w-auto px-12 py-6 bg-scm-blue text-white rounded-2xl font-black hover:bg-blue-900 transition-all shadow-xl flex items-center justify-center disabled:opacity-70"
                >
                  {submitting ? <Loader2 size={24} className="animate-spin" /> : (
                    <>Send Prayer Request <ArrowRight size={20} className="ml-3" /></>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PrayerRequest;
