import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Heart, Trash2, Search, Loader2, Phone, Clock, User, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

const AdminPrayerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('prayer_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setRequests(data);
      setLoading(false);
    };

    fetchRequests();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this prayer request?')) {
      const { error } = await supabase.from('prayer_requests').delete().eq('id', id);
      if (!error) {
        const { data } = await supabase
          .from('prayer_requests')
          .select('*')
          .order('created_at', { ascending: false });
        if (data) setRequests(data);
      }
    }
  };

  const filteredRequests = requests.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.request.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-white p-12 md:p-16 rounded-[60px] shadow-2xl border border-gray-100 relative overflow-hidden group">
         <div className="flex items-center space-x-10 relative z-10">
            <div className="w-24 h-24 bg-scm-blue text-white rounded-[40px] flex items-center justify-center shadow-2xl">
               <Heart size={48} />
            </div>
            <div>
               <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-3 leading-tight">Prayer <span className="text-scm-blue">Requests</span></h1>
               <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">Total Requests: {requests.length}</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[60px] shadow-2xl border border-gray-100 overflow-hidden">
        <div className="p-12 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="relative w-full md:w-96">
              <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search requests..."
                className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-scm-blue transition-all font-bold text-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
        </div>

        <div className="grid grid-cols-1 gap-8 p-12">
          {loading ? (
            <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-scm-blue" size={48} /></div>
          ) : filteredRequests.map((req) => (
            <div key={req.id} className="bg-gray-50 p-10 rounded-[40px] border border-gray-100 hover:bg-white hover:shadow-2xl transition-all duration-500 group">
               <div className="flex flex-col md:flex-row justify-between gap-8 mb-8">
                  <div className="flex items-center space-x-6">
                     <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-scm-red shadow-sm border border-gray-100">
                        <User size={28} />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black text-gray-900 flex items-center">
                           {req.name}
                           {req.is_private ? (
                             <span className="ml-4 px-3 py-1 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center border border-red-100">
                                <EyeOff size={12} className="mr-1" /> Private
                             </span>
                           ) : (
                             <span className="ml-4 px-3 py-1 bg-green-50 text-green-500 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center border border-green-100">
                                <Eye size={12} className="mr-1" /> Public
                             </span>
                           )}
                        </h3>
                        <div className="flex items-center text-gray-400 font-bold text-sm mt-1">
                           <Phone size={14} className="mr-2 text-scm-blue" /> {req.phone || 'No phone provided'}
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center space-x-4">
                     <div className="text-right hidden md:block">
                        <div className="text-xs font-black text-gray-300 uppercase tracking-widest mb-1">Received</div>
                        <div className="text-gray-900 font-bold">{new Date(req.created_at).toLocaleDateString()}</div>
                     </div>
                     <button onClick={() => handleDelete(req.id)} className="p-4 bg-white text-gray-400 hover:text-scm-red hover:bg-red-50 rounded-2xl border border-gray-100 shadow-xl transition-all hover:scale-110">
                        <Trash2 size={24} />
                     </button>
                  </div>
               </div>
               <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-inner">
                  <p className="text-gray-600 text-lg leading-relaxed font-medium">"{req.request}"</p>
               </div>
            </div>
          ))}
          {filteredRequests.length === 0 && !loading && (
            <div className="py-20 text-center text-gray-300 font-black uppercase tracking-widest">No requests found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPrayerRequests;
