import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { Mail, RefreshCw, Trash2, CheckCircle, MailOpen } from 'lucide-react';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const markAsRead = async (id, currentStatus) => {
    const { error } = await supabase
      .from('messages')
      .update({ is_read: !currentStatus })
      .eq('id', id);

    if (!error) {
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, is_read: !currentStatus } : msg
      ));
    }
  };

  const deleteMessage = async (id) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      const { error } = await supabase.from('messages').delete().eq('id', id);
      if (!error) {
        setMessages(messages.filter(msg => msg.id !== id));
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-gray-900">Inbox</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">Manage contact form submissions</p>
        </div>
        <button 
          onClick={fetchMessages}
          className="p-3 bg-white border border-gray-200 rounded-lg shrink-0 hover:bg-gray-50 transition-colors"
          title="Refresh"
        >
          <RefreshCw size={20} className={`text-scm-blue ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && messages.length === 0 ? (
          <div className="p-12 text-center text-gray-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center text-gray-500 flex flex-col items-center">
            <Mail size={48} className="mb-4 text-gray-300" />
            <p>Your inbox is empty.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((msg) => (
              <div key={msg.id} className={`p-4 sm:p-6 transition-colors ${!msg.is_read ? 'bg-scm-blue/5' : 'bg-white'}`}>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1 w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                      <h3 className={`text-base sm:text-lg font-bold ${!msg.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {msg.name}
                      </h3>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.created_at).toLocaleString()}
                      </span>
                    </div>
                    <a href={`mailto:${msg.email}`} className="text-sm text-scm-blue hover:underline mb-3 inline-block font-medium break-all">
                      {msg.email}
                    </a>
                    {msg.subject && (
                      <h4 className="text-sm sm:text-base font-bold text-gray-800 mb-2">{msg.subject}</h4>
                    )}
                    <p className={`text-sm leading-relaxed ${!msg.is_read ? 'text-gray-800' : 'text-gray-600'} break-words whitespace-pre-wrap`}>
                      {msg.message}
                    </p>
                  </div>
                  
                  <div className="flex sm:flex-col gap-2 shrink-0 self-start sm:self-auto w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-100">
                    <button 
                      onClick={() => markAsRead(msg.id, msg.is_read)}
                      className={`flex-1 sm:flex-none p-2 rounded-lg transition-colors flex items-center justify-center border ${!msg.is_read ? 'bg-white text-scm-blue border-scm-blue hover:bg-scm-blue hover:text-white' : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-gray-100'}`}
                      title={msg.is_read ? "Mark as unread" : "Mark as read"}
                    >
                      {msg.is_read ? <><Mail size={16} className="sm:mr-0 mr-2"/><span className="sm:hidden text-xs font-bold uppercase tracking-wider">Unread</span></> : <><MailOpen size={16} className="sm:mr-0 mr-2"/><span className="sm:hidden text-xs font-bold uppercase tracking-wider">Read</span></>}
                    </button>
                    <button 
                      onClick={() => deleteMessage(msg.id)}
                      className="flex-1 sm:flex-none p-2 rounded-lg bg-red-50 text-red-500 border border-red-100 hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                      title="Delete"
                    >
                      <Trash2 size={16} className="sm:mr-0 mr-2" />
                      <span className="sm:hidden text-xs font-bold uppercase tracking-wider text-red-600 group-hover:text-white">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;
