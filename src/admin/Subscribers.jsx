import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Users, Trash2, Download, RefreshCw } from 'lucide-react';

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscribers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('subscribers')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSubscribers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const deleteSubscriber = async (id) => {
    if (window.confirm('Remove this subscriber from the mailing list?')) {
      const { error } = await supabase.from('subscribers').delete().eq('id', id);
      if (!error) {
        setSubscribers(subscribers.filter(sub => sub.id !== id));
      }
    }
  };

  const exportCSV = () => {
    if (subscribers.length === 0) return;
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Email,Date Subscribed\n"
      + subscribers.map(s => `${s.email},${new Date(s.created_at).toLocaleDateString()}`).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "scm-subscribers.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">Subscribers</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Manage your newsletter mailing list</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full sm:w-auto">
          <button 
            onClick={fetchSubscribers}
            className="p-3 bg-white border border-gray-200 rounded-lg shrink-0 hover:bg-gray-50 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={20} className={`text-scm-blue ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button 
            onClick={exportCSV}
            disabled={subscribers.length === 0}
            className="px-4 py-2 bg-scm-blue text-white rounded-lg flex items-center font-medium disabled:opacity-50 hover:bg-scm-blue/90 transition-colors"
          >
            <Download size={18} className="mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && subscribers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Loading subscribers...</div>
        ) : subscribers.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Users size={48} className="mb-4 text-gray-300" />
            <p>No subscribers yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs sm:text-sm font-bold uppercase tracking-wider">
                  <th className="p-4 pl-6 whitespace-nowrap">Email Address</th>
                  <th className="p-4 whitespace-nowrap">Date Subscribed</th>
                  <th className="p-4 text-right pr-6 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 pl-6 font-medium text-gray-900 break-all sm:break-normal">{sub.email}</td>
                    <td className="p-4 text-gray-500 text-sm">{new Date(sub.created_at).toLocaleDateString()}</td>
                    <td className="p-4 pr-6 text-right">
                      <button 
                        onClick={() => deleteSubscriber(sub.id)}
                        className="p-2 inline-flex rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Remove subscriber"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscribers;
