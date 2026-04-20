import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { Users, Trash2, Download, RefreshCw, Mail, Search, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSubscribers(data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    let ignore = false;
    async function startFetching() {
      const { data, error } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!ignore) {
        if (!error && data) {
          setSubscribers(data);
        }
        setLoading(false);
      }
    }
    startFetching();
    return () => {
      ignore = true;
    };
  }, []);

  const deleteSubscriber = async (id) => {
    // Non-blocking delete to avoid DOM sync issues
    const { error } = await supabase.from('subscribers').delete().eq('id', id);
    if (!error) {
      setSubscribers(prev => prev.filter(sub => sub.id !== id));
      toast.success("Subscriber removed successfully!");
    } else {
      toast.error("Failed to remove subscriber: " + error.message);
    }
  };

  const exportCSV = () => {
    if (subscribers.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Date Subscribed\n"
      + subscribers.map(s => `${s.email},${new Date(s.created_at).toLocaleDateString()}`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    // Use window.open for a safer download trigger that doesn't touch the DOM
    window.open(encodedUri);
  };

  const filteredSubscribers = subscribers.filter(sub => 
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderContent = () => {
    return (
      <div id="subscribers-content-area" className="flex-1 flex flex-col min-h-[400px]" suppressHydrationWarning>
        {/* Loading State */}
        <div 
          key="loading-branch"
          style={{ display: (loading && subscribers.length === 0) ? 'flex' : 'none' }}
          className="flex-1 py-20 flex-col items-center justify-center space-y-6"
          suppressHydrationWarning
        >
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-4 border-b-4 border-scm-blue"></div>
          <p className="text-gray-400 font-black uppercase tracking-widest text-xs sm:text-sm text-center px-4"><span>Fetching&nbsp;Mailing&nbsp;List...</span></p>
        </div>

        {/* Empty State */}
        <div 
          key="empty-branch"
          style={{ display: (!loading && filteredSubscribers.length === 0) ? 'flex' : 'none' }}
          className="flex-1 py-20 text-center text-gray-500 flex flex-col items-center px-6 justify-center"
          suppressHydrationWarning
        >
          <span className="flex items-center justify-center mb-6"><Mail size={60} className="sm:w-20 sm:h-20 text-gray-100" /></span>
          <h3 className="text-xl sm:text-2xl font-black text-gray-300 mb-2"><span>No&nbsp;subscribers&nbsp;found</span></h3>
          <p className="text-gray-400 font-medium text-sm sm:text-base max-w-xs mx-auto"><span>The&nbsp;mailing&nbsp;list&nbsp;is&nbsp;empty&nbsp;or&nbsp;no&nbsp;matches&nbsp;found.</span></p>
        </div>

        {/* Table/Card State */}
        <div 
          key="table-branch"
          style={{ display: (!loading && filteredSubscribers.length > 0) ? 'block' : 'none' }}
          className="flex-1"
          suppressHydrationWarning
        >
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 text-xs font-black uppercase tracking-[0.2em]">
                  <th className="p-8 pl-12"><span>Subscriber</span></th>
                  <th className="p-8"><span>Subscription&nbsp;Date</span></th>
                  <th className="p-8 text-right pr-12"><span>Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="group hover:bg-scm-blue/[0.02] transition-colors" suppressHydrationWarning>
                    <td className="p-8 pl-12" suppressHydrationWarning>
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-2xl bg-scm-blue/5 text-scm-blue flex items-center justify-center font-black group-hover:bg-scm-blue group-hover:text-white transition-all duration-500"><span>{sub.email[0].toUpperCase()}</span></div><div className="min-w-0">
                          <p className="font-bold text-gray-900 truncate text-base"><span>{sub.email}</span></p>
                          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest"><span>Newsletter&nbsp;Subscriber</span></p>
                        </div>
                      </div>
                    </td>
                    <td className="p-8" suppressHydrationWarning>
                      <div className="flex items-center text-gray-500 font-medium text-sm"><span>{new Date(sub.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}</span></div>
                    </td>
                    <td className="p-8 pr-12 text-right" suppressHydrationWarning>
                      <div className="flex items-center justify-end space-x-2">
                        <button 
                          onClick={() => deleteSubscriber(sub.id)}
                          className="p-4 bg-white text-gray-400 hover:text-scm-red hover:bg-scm-red/5 rounded-xl sm:rounded-2xl border border-gray-100 shadow-xl transition-all hover:scale-110"
                          title="Remove subscriber"
                        ><span className="flex items-center justify-center"><Trash2 size={18} /></span></button>
                        <div className="w-10 h-10 bg-gray-50 text-gray-300 rounded-xl flex items-center justify-center group-hover:bg-scm-blue group-hover:text-white transition-colors shrink-0"><span className="flex items-center justify-center"><ChevronRight size={18} /></span></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-50 bg-white">
            {filteredSubscribers.map((sub) => (
              <div key={sub.id} className="p-4 active:bg-gray-50 transition-colors" suppressHydrationWarning>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-xl bg-scm-blue/5 text-scm-blue flex items-center justify-center font-black shrink-0 text-sm">
                      <span>{sub.email[0].toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-gray-900 truncate text-sm">
                        <span>{sub.email}</span>
                      </p>
                      <div className="flex items-center mt-0.5 space-x-2">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider">Joined</span>
                        <span className="text-[10px] text-gray-500 font-bold">{new Date(sub.created_at).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => deleteSubscriber(sub.id)}
                    className="p-3 bg-white text-scm-red rounded-xl border border-gray-100 shadow-sm active:scale-90 transition-transform shrink-0"
                  >
                    <span className="flex items-center justify-center"><Trash2 size={16} /></span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div id="subscribers-root" className="space-y-4 sm:space-y-8 pb-20 overflow-x-hidden" translate="no" suppressHydrationWarning>
      <div id="subscribers-header" className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-5 sm:p-10 md:p-16 rounded-[1.5rem] sm:rounded-[3rem] md:rounded-[60px] shadow-2xl border border-gray-100 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-scm-blue/5 rounded-full -mr-32 -mt-32 sm:-mr-48 sm:-mt-48 group-hover:scale-150 transition-transform duration-700"></div>
         <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 relative z-10 w-full md:w-auto">
            <div className="w-12 h-12 sm:w-20 md:w-24 sm:h-20 md:h-24 bg-scm-blue text-white rounded-xl sm:rounded-[2.5rem] flex items-center justify-center shadow-xl transform rotate-3 hover:rotate-0 transition-transform duration-500 shrink-0 mx-auto sm:mx-0">
               <span className="flex items-center justify-center"><Users size={24} className="sm:w-10 sm:h-10 md:w-12 md:h-12" /></span>
            </div>
            <div className="text-center sm:text-left">
               <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-1 sm:mb-3 leading-tight"><span>Mailing&nbsp;</span><span className="text-scm-blue">List</span></h1>
               <p className="text-gray-400 font-black uppercase tracking-[0.1em] sm:tracking-[0.3em] text-[9px] sm:text-xs flex items-center justify-center sm:justify-start"><span>Active Subscribers:&nbsp;{subscribers.length}</span></p>
            </div>
         </div>
         <div className="flex flex-row gap-2 sm:gap-4 relative z-10 justify-center w-full sm:w-auto">
            <button 
              onClick={() => { setLoading(true); fetchSubscribers(); }}
              className="p-3 sm:p-5 bg-gray-50 text-gray-400 hover:text-scm-blue hover:bg-scm-blue/5 rounded-lg sm:rounded-2xl border border-gray-100 shadow-md transition-all hover:scale-105 flex items-center justify-center shrink-0"
              title="Refresh"
            >
             <span className="flex items-center justify-center"><RefreshCw size={18} className={loading ? 'animate-spin' : 'sm:w-6 sm:h-6'} /></span>
           </button>
           <button 
             onClick={exportCSV}
             disabled={subscribers.length === 0}
             className="flex-1 sm:flex-none px-4 sm:px-12 py-3 sm:py-6 bg-scm-blue text-white rounded-lg sm:rounded-3xl font-black hover:bg-blue-900 transition-all shadow-xl hover:shadow-scm-blue/40 transform hover:-translate-y-0.5 active:scale-95 flex items-center justify-center disabled:opacity-50 text-[10px] sm:text-base uppercase tracking-wider sm:normal-case"
           >
             <span className="flex items-center justify-center"><Download size={16} className="mr-1.5 sm:mr-3 sm:w-5 sm:h-5" /></span>
             <span>Export CSV</span>
           </button>
         </div>
      </div>

      <section id="subscribers-search" className="bg-white p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2rem] border border-[#eadfca] shadow-[0_20px_55px_rgba(7,17,38,0.06)]">
        <div className="relative w-full sm:max-w-md mx-auto sm:mx-0">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400"><Search size={18} /></span>
          <input
            type="text"
            placeholder="Search subscribers by email..."
            className="w-full rounded-2xl border border-[#eadfca] bg-[#fbf7eb] py-3.5 sm:py-4 pl-12 pr-4 text-sm font-medium text-slate-800 outline-none transition focus:border-[#d8c5bb] focus:bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      <div id="subscribers-list" className="bg-white rounded-[30px] sm:rounded-[50px] shadow-2xl border border-gray-100 overflow-hidden min-h-[400px] flex flex-col" suppressHydrationWarning>
        {renderContent()}
      </div>
    </div>
  );
};

export default Subscribers;
