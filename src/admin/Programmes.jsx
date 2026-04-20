import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { 
  Calendar, 
  Plus, 
  Edit2, 
  Trash2, 
  Search, 
  X, 
  Clock, 
  MapPin, 
  ChevronRight,
  Loader2,
  Calendar as CalendarIcon,
  RefreshCw,
  BellRing
} from 'lucide-react';

const AdminProgrammes = () => {
  const [programmes, setProgrammes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProg, setEditingProg] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    day_of_week: 'Sunday',
    time: '',
    location: 'Main Sanctuary',
    occurrence: 'Weekly',
    description: ''
  });

  const fetchProgrammes = useCallback(async () => {
    const { data } = await supabase
      .from('programmes')
      .select('*')
      .order('occurrence', { ascending: false })
      .order('day_of_week', { ascending: true })
      .order('created_at', { ascending: true });

    if (data) {
      // Auto-Deduplicate logic (runs locally while authenticated to bypass RLS)
      const seen = new Set();
      const toDelete = [];
      const uniqueData = [];

      data.forEach((prog) => {
        const identifier = `${prog.title}-${prog.occurrence}-${prog.day_of_week}`;
        if (seen.has(identifier)) {
          toDelete.push(prog.id);
        } else {
          seen.add(identifier);
          uniqueData.push(prog);
        }
      });

      setProgrammes(uniqueData);

      // Delete the duplicates quietly in the background
      if (toDelete.length > 0) {
        toDelete.forEach(async (id) => {
          await supabase.from('programmes').delete().eq('id', id);
        });
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let ignore = false;
    async function loadProgrammes() {
      const { data } = await supabase
        .from('programmes')
        .select('*')
        .order('order', { ascending: true });

      if (!ignore) {
        if (data) setProgrammes(data);
        setLoading(false);
      }
    }
    loadProgrammes();
    return () => {
      ignore = true;
    };
  }, []); // Only fetch on mount, manual refreshes use fetchProgrammes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (editingProg) {
      const { error } = await supabase
        .from('programmes')
        .update(formData)
        .eq('id', editingProg.id);
      if (!error) {
        setShowModal(false);
        fetchProgrammes();
      }
    } else {
      const { error } = await supabase
        .from('programmes')
        .insert([formData]);
      if (!error) {
        setShowModal(false);
        fetchProgrammes();
      }
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this programme?')) {
      const { error } = await supabase
        .from('programmes')
        .delete()
        .eq('id', id);
      if (!error) {
        const { data } = await supabase
          .from('programmes')
          .select('*')
          .order('occurrence', { ascending: false })
          .order('day_of_week', { ascending: true });
        if (data) setProgrammes(data);
      }
    }
  };

  const openModal = (prog = null) => {
    if (prog) {
      setEditingProg(prog);
      setFormData({
        title: prog.title,
        day_of_week: prog.day_of_week || '',
        occurrence: prog.occurrence || 'Weekly',
        time: prog.time,
        description: prog.description || '',
      });
    } else {
      setEditingProg(null);
      setFormData({
        title: '',
        day_of_week: '',
        occurrence: 'Weekly',
        time: '',
        description: '',
      });
    }
    setShowModal(true);
  };

  return (
    <div className="space-y-12 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8 bg-white p-6 sm:p-10 md:p-14 rounded-[30px] sm:rounded-[50px] shadow-2xl border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
           <div className="w-16 h-16 sm:w-20 sm:h-20 bg-scm-blue text-white rounded-2xl sm:rounded-[30px] flex items-center justify-center shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500 shrink-0">
              <ListChecks size={32} className="sm:w-10 sm:h-10" />
           </div>
           <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-2">Church <span className="text-scm-blue">Programmes</span></h1>
              <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-[10px] sm:text-xs">Recurring Weekly & Monthly Activities</p>
           </div>
        </div>
        <button
          onClick={() => openModal()}
          className="w-full md:w-auto px-6 sm:px-10 py-4 sm:py-5 bg-scm-blue text-white rounded-2xl font-black hover:bg-blue-900 transition-all shadow-xl hover:shadow-scm-blue/40 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center group"
        >
          <Plus size={20} className="mr-2 sm:mr-3 group-hover:rotate-90 transition-transform sm:w-6 sm:h-6" />
          Add Programme
        </button>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <div className="flex flex-col items-center justify-center space-y-4">
               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scm-blue"></div>
               <p className="text-gray-400 font-black uppercase tracking-widest text-xs">Loading Schedule...</p>
            </div>
          </div>
        ) : programmes.map((prog) => (
          <div key={prog.id} className="bg-white p-6 sm:p-10 rounded-[30px] sm:rounded-[40px] shadow-2xl border border-gray-100 hover:border-scm-blue/20 hover:scale-[1.03] transition-all duration-500 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 sm:p-8 text-gray-50 opacity-10 group-hover:opacity-100 transition-opacity">
               <Calendar size={80} className="sm:w-[100px] sm:h-[100px]" />
            </div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                prog.occurrence === 'Weekly' ? 'bg-blue-50 text-scm-blue border-blue-100' : 'bg-red-50 text-scm-red border-red-100'
              }`}>
                {prog.occurrence}
              </span>
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(prog)} className="p-2 bg-gray-50 text-gray-400 hover:text-scm-blue rounded-lg transition-colors">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(prog.id)} className="p-2 bg-gray-50 text-gray-400 hover:text-scm-red rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <h3 className="text-2xl font-black text-gray-900 mb-6 group-hover:text-scm-blue transition-colors relative z-10">{prog.title}</h3>
            
            <div className="space-y-4 relative z-10">
              <div className="flex items-center text-sm font-bold text-gray-500 bg-gray-50/50 p-4 rounded-2xl">
                <Clock size={18} className="mr-3 text-scm-blue" />
                <span>{prog.day_of_week ? `${prog.day_of_week}s at ` : ''}{prog.time}</span>
              </div>
              {prog.description && (
                <div className="flex items-start text-sm font-medium text-gray-400 leading-relaxed px-4">
                  <Info size={18} className="mr-3 mt-1 shrink-0" />
                  <p>{prog.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
        
        {programmes.length === 0 && !loading && (
          <div className="col-span-full py-24 text-center bg-white rounded-[50px] shadow-2xl border border-gray-100">
            <div className="flex flex-col items-center justify-center space-y-6">
               <ListChecks size={64} className="text-gray-200" />
               <p className="text-xl font-black text-gray-300">No programmes scheduled yet.</p>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-[30px] sm:rounded-[50px] shadow-2xl max-w-2xl w-full my-4 sm:my-8 max-h-[95vh] sm:max-h-[85vh] flex flex-col relative animate-scale-up border-4 border-white">
            <div className="bg-scm-blue p-6 sm:p-12 text-center relative overflow-hidden group shrink-0 rounded-t-[26px] sm:rounded-t-[46px]">
               <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/5 rounded-full -mr-12 -mt-12 sm:-mr-16 sm:-mt-16 group-hover:scale-150 transition-transform duration-700"></div>
               <button
                 onClick={() => setShowModal(false)}
                 className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 sm:p-3 bg-white/10 text-white hover:bg-white hover:text-scm-blue rounded-xl sm:rounded-2xl transition-all shadow-xl"
               >
                 <X size={20} />
               </button>
               <h2 className="text-2xl sm:text-4xl font-black text-white mb-2 underline decoration-scm-red/40 underline-offset-8">
                  {editingProg ? 'Update Programme' : 'New Programme'}
               </h2>
               <p className="text-white/40 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em]">Church Schedule Registry</p>
            </div>

            <div className="overflow-y-auto w-full p-6 sm:p-12 lg:p-16 flex-1">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="md:col-span-2 space-y-3 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-scm-blue transition-colors">Programme Title</label>
                   <input
                     required
                     className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-bold text-gray-900"
                     value={formData.title}
                     onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                     placeholder="e.g. Bible Study"
                   />
                </div>
                
                <div className="space-y-3 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-scm-blue transition-colors">Occurrence</label>
                   <select
                     className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-bold text-gray-900"
                     value={formData.occurrence}
                     onChange={(e) => setFormData({ ...formData, occurrence: e.target.value })}
                   >
                     <option value="Weekly">Weekly</option>
                     <option value="Monthly">Monthly</option>
                     <option value="Annual">Annual</option>
                   </select>
                </div>

                <div className="space-y-3 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-scm-blue transition-colors">Day (e.g. Tuesday, 1st Day)</label>
                   <input
                     className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-bold text-gray-900"
                     value={formData.day_of_week}
                     onChange={(e) => setFormData({ ...formData, day_of_week: e.target.value })}
                     placeholder="e.g. Tuesday"
                   />
                </div>

                <div className="space-y-3 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-scm-blue transition-colors">Time</label>
                   <input
                     required
                     className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-bold text-gray-900"
                     value={formData.time}
                     onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                     placeholder="e.g. 4:00pm"
                   />
                </div>

                <div className="md:col-span-2 space-y-3 group">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-2 group-focus-within:text-scm-blue transition-colors">Brief Description (Optional)</label>
                   <textarea
                     rows="3"
                     className="w-full px-6 py-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:border-scm-blue focus:ring-4 focus:ring-scm-blue/5 transition-all font-bold text-gray-900"
                     value={formData.description}
                     onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                     placeholder="Add any additional details..."
                   />
                </div>
              </div>

              <div className="pt-4 sm:pt-8 flex flex-col sm:flex-row gap-4 sm:gap-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex-grow py-4 sm:py-6 bg-scm-blue text-white rounded-[20px] sm:rounded-[30px] font-black text-base sm:text-lg hover:bg-blue-900 transition-all shadow-2xl hover:shadow-scm-blue/40 transform hover:-translate-y-1 active:scale-95 flex items-center justify-center disabled:opacity-70 group order-1"
                >
                  {submitting ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <>
                      <Save size={20} className="mr-2 sm:mr-3 group-hover:scale-125 transition-transform shrink-0" />
                      {editingProg ? 'Update Programme' : 'Add to Schedule'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-full sm:w-auto px-6 sm:px-10 py-4 sm:py-6 bg-gray-50 text-gray-400 rounded-[20px] sm:rounded-[30px] font-black hover:bg-gray-100 hover:text-gray-600 transition-all shadow-inner transform active:scale-95 order-2"
                >
                  Discard
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

export default AdminProgrammes;