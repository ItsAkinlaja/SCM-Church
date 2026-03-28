import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { FileText, Download, Calendar, Search, Filter, ArrowRight, Eye, ChevronRight, Cross } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const StudyMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('weekly_materials')
          .select('*')
          .order('week_date', { ascending: false });

        if (data && data.length > 0) {
          setLatest(data[0]);
          setMaterials(data.slice(1));
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching materials:', err);
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <PageHeader 
        title="Study Guides" 
        subtitle="Nurturing your spiritual growth with weekly insights and deep dives into the Word."
        image="https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1170&auto=format&fit=crop"
      />

      {/* Latest Material Feature */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {latest && (
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col md:flex-row items-stretch transform hover:scale-[1.01] transition-transform duration-500">
              <div className="w-full md:w-1/3 bg-scm-blue/5 flex items-center justify-center p-12 border-r border-gray-100">
                 <div className="relative group">
                    <div className="absolute -inset-4 bg-scm-blue/10 rounded-full animate-pulse-slow"></div>
                    <FileText size={100} className="text-scm-blue group-hover:scale-110 transition-transform duration-500" />
                 </div>
              </div>
              <div className="w-full md:w-2/3 p-10 md:p-16 flex flex-col justify-center">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-scm-red/10 text-scm-red text-sm font-bold mb-6">
                  <Calendar size={16} className="mr-2" />
                  This Week's Study - {new Date(latest.week_date).toLocaleDateString()}
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 mb-6 leading-tight group-hover:text-scm-blue transition-colors">{latest.title}</h2>
                <p className="text-gray-600 text-lg mb-10 leading-relaxed font-medium">
                  {latest.description || "Join us as we explore this week's message. Download the pamphlet below for full study details and notes."}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href={latest.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 bg-scm-blue text-white rounded-2xl font-bold hover:bg-blue-900 transition-all shadow-lg hover:shadow-scm-blue/30 transform hover:-translate-y-1"
                  >
                    <Download size={20} className="mr-2" />
                    Download PDF
                  </a>
                  <a 
                    href={latest.file_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-8 py-4 bg-white text-scm-blue border-2 border-scm-blue rounded-2xl font-bold hover:bg-scm-blue/5 transition-all shadow-md transform hover:-translate-y-1"
                  >
                    <Eye size={20} className="mr-2" />
                    Preview Material
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Archive Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
            <h2 className="text-4xl font-extrabold text-gray-900 border-l-8 border-scm-red pl-6 leading-none py-2">Material Archive</h2>
            
            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-scm-blue transition-colors" size={20} />
              <input 
                type="text" 
                placeholder="Search materials..." 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-scm-blue/5 focus:border-scm-blue transition-all font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scm-blue"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMaterials.map((m) => (
                <div key={m.id} className="group bg-gray-50 rounded-3xl p-8 border border-gray-100 hover:border-scm-blue/20 hover:bg-white hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2">
                   <div className="flex justify-between items-start mb-8">
                      <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-scm-blue group-hover:bg-scm-blue group-hover:text-white transition-all duration-500">
                         <FileText size={28} />
                      </div>
                      <div className="text-right">
                         <div className="text-scm-red font-extrabold text-lg leading-none mb-1">
                            {new Date(m.week_date).toLocaleDateString(undefined, { day: '2-digit' })}
                         </div>
                         <div className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            {new Date(m.week_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                         </div>
                      </div>
                   </div>
                   
                   <h3 className="text-2xl font-extrabold text-gray-900 mb-4 group-hover:text-scm-blue transition-colors line-clamp-1">{m.title}</h3>
                   <p className="text-gray-500 text-sm mb-10 line-clamp-2 leading-relaxed font-medium">{m.description || "Past study guide for spiritual nourishment."}</p>
                   
                   <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                      <a 
                        href={m.file_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-scm-blue font-bold flex items-center hover:underline group-hover:translate-x-1 transition-transform"
                      >
                        Download <ChevronRight size={18} className="ml-1" />
                      </a>
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-scm-red/10 group-hover:text-scm-red transition-colors">
                         <Download size={14} />
                      </div>
                   </div>
                </div>
              ))}
              
              {filteredMaterials.length === 0 && !loading && (
                <div className="col-span-full text-center py-24 text-gray-400 bg-gray-50 rounded-3xl border-4 border-dashed border-gray-200">
                   <FileText size={64} className="mx-auto mb-6 opacity-20" />
                   <p className="text-xl font-bold opacity-60">No materials found matching your search.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-scm-blue text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-scm-gold text-sm font-black mb-8 border border-white/10">
             GROW WITH US
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-10 leading-tight">Ready to grow in faith?</h2>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Join our weekly services and be part of a global community dedicated to Christ.
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center px-10 py-5 bg-scm-red text-white rounded-full font-black hover:bg-red-700 transition-all shadow-2xl hover:shadow-red-900/40 transform hover:scale-110 active:scale-95"
          >
            Find a Local Service <ArrowRight size={20} className="ml-3" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default StudyMaterial;
