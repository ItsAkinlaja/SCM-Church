import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { Quote, Trash2, Search, Loader2, CheckCircle2, XCircle, User, MessageSquare } from 'lucide-react';

const AdminTestimonies = () => {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchTestimonies = useCallback(async () => {
    const { data } = await supabase
      .from('testimonies')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setTestimonies(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTestimonies();
  }, [fetchTestimonies]);

  const handleApprove = async (id, status) => {
    const { error } = await supabase
      .from('testimonies')
      .update({ is_approved: status })
      .eq('id', id);
    if (!error) fetchTestimonies();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this testimony?')) {
      const { error } = await supabase.from('testimonies').delete().eq('id', id);
      if (!error) fetchTestimonies();
    }
  };

  const filteredTestimonies = testimonies.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 bg-white p-6 sm:p-12 md:p-16 rounded-[30px] sm:rounded-[60px] shadow-2xl border border-gray-100 relative overflow-hidden group">
         <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-10 relative z-10 w-full md:w-auto">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-scm-gold text-white rounded-2xl sm:rounded-[40px] flex items-center justify-center shadow-2xl shrink-0">
               <Quote size={32} className="sm:w-12 sm:h-12" />
            </div>
            <div>
               <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 mb-2 sm:mb-3 leading-tight">Ministry <span className="text-scm-gold">Testimonies</span></h1>
               <p className="text-gray-400 font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-xs">Total Shared: {testimonies.length}</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[30px] sm:rounded-[60px] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-6 sm:p-12 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-8">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search testimonies..."
                className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-gold transition-all font-bold text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 p-6 sm:p-12">
          {loading ? (
            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-scm-gold" size={48} /></div>
          ) : filteredTestimonies.map((t) => (
            <div key={t.id} className="bg-gray-50 p-6 sm:p-10 rounded-[30px] sm:rounded-[40px] border border-gray-100 hover:bg-white hover:shadow-2xl transition-all duration-500">
               <div className="flex flex-col md:flex-row justify-between gap-6 sm:gap-8 mb-6 sm:mb-8">
                  <div className="flex items-center space-x-4 sm:space-x-6">
                     <div className="w-12 h-12 sm:w-16 sm:h-16 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center text-scm-gold shadow-sm border border-gray-100 shrink-0">
                        <User size={28} />
                     </div>
                     <div>
                        <h3 className="text-xl sm:text-2xl font-black text-gray-900">{t.name}</h3>
                        <div className="flex flex-wrap items-center text-gray-400 font-bold text-[11px] sm:text-sm mt-1">
                           <MessageSquare size={14} className="mr-2 text-scm-blue shrink-0" /> <span className="line-clamp-1">{t.title}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 sm:gap-4 border-t border-gray-200 sm:border-t-0 pt-4 sm:pt-0">
                     {t.is_approved ? (
                       <button 
                         onClick={() => handleApprove(t.id, false)}
                         className="px-4 flex-grow sm:flex-grow-0 py-3 bg-red-50 text-red-600 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest border border-red-100 hover:bg-red-600 hover:text-white transition-all text-center"
                       >
                         Unapprove
                       </button>
                     ) : (
                       <button 
                         onClick={() => handleApprove(t.id, true)}
                         className="px-4 flex-grow sm:flex-grow-0 py-3 bg-green-50 text-green-600 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest border border-green-100 hover:bg-green-600 hover:text-white transition-all text-center"
                       >
                         Approve
                       </button>
                     )}
                     <button onClick={() => handleDelete(t.id)} className="p-3 sm:p-4 bg-white text-gray-400 hover:text-scm-red hover:bg-red-50 rounded-xl sm:rounded-2xl border border-gray-100 shadow-xl transition-all shrink-0">
                        <Trash2 size={20} className="sm:w-6 sm:h-6" />
                     </button>
                  </div>
               </div>
               <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gray-100 shadow-inner">
                  <p className="text-gray-600 text-base sm:text-lg leading-relaxed font-medium italic">"{t.content}"</p>
               </div>
               <div className="mt-6 flex justify-end">
                  <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${t.is_approved ? 'bg-green-50 text-green-500 border-green-100' : 'bg-amber-50 text-amber-500 border-amber-100'}`}>
                     {t.is_approved ? 'Visible on Website' : 'Pending Review'}
                  </span>
               </div>
            </div>
          ))}
          {filteredTestimonies.length === 0 && !loading && (
            <div className="py-20 text-center text-gray-300 font-black uppercase tracking-widest">No testimonies found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTestimonies;
