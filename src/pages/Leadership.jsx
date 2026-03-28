import { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { User, Users, ShieldCheck, Mail, Linkedin, Instagram, Twitter, ChevronRight, UserCircle, Cross } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const Leadership = () => {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        setLoading(true);
        const { data } = await supabase
          .from('leaders')
          .select('*')
          .order('created_at', { ascending: true });

        if (data) setLeaders(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaders:', err);
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 overflow-hidden">
      <PageHeader 
        title="Our Leadership Team" 
        subtitle="Meet the dedicated leaders committed to the work of the mission."
        image="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1170&auto=format&fit=crop"
      />

      {/* Leadership Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="py-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scm-blue"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {leaders.map((leader) => (
                <div key={leader.id} className="group bg-gray-50 rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:border-scm-blue/20 transition-all duration-700 transform hover:-translate-y-4">
                  <div className="aspect-[4/5] overflow-hidden relative group-hover:bg-scm-blue/10 transition-colors duration-500">
                    {leader.photo_url ? (
                      <img 
                        src={leader.photo_url} 
                        alt={leader.name} 
                        className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 group-hover:bg-scm-blue/10 transition-colors duration-500">
                        <UserCircle size={100} className="text-gray-300 group-hover:text-scm-blue/30 transition-colors duration-500" />
                      </div>
                    )}
                    
                    {/* Role Badge Over Image */}
                    <div className="absolute top-6 left-6 z-10">
                       <div className="px-5 py-2.5 bg-scm-blue text-white rounded-2xl text-xs font-black tracking-widest shadow-xl border border-white/10 transform -rotate-2 group-hover:rotate-0 transition-transform duration-500">
                          {leader.role.toUpperCase()}
                       </div>
                    </div>

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-scm-blue/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                       <div className="flex space-x-4 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500 delay-100">
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-scm-red transition-colors cursor-pointer border border-white/10 shadow-lg">
                             <Instagram size={18} />
                          </div>
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-scm-blue transition-colors cursor-pointer border border-white/10 shadow-lg">
                             <Linkedin size={18} />
                          </div>
                          <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white hover:bg-white hover:text-scm-blue transition-colors cursor-pointer border border-white/10 shadow-lg">
                             <Mail size={18} />
                          </div>
                       </div>
                    </div>
                  </div>
                  
                  <div className="p-8 text-center bg-white border-t border-gray-100 group-hover:bg-scm-blue/5 transition-colors duration-500">
                    <h3 className="text-2xl font-black text-gray-900 mb-2 group-hover:text-scm-blue transition-colors duration-500">{leader.name}</h3>
                    <div className="flex flex-col items-center space-y-3">
                       <span className="text-xs font-black text-scm-red uppercase tracking-[0.2em]">{leader.department || "General"}</span>
                       <div className="w-12 h-1.5 bg-gray-100 rounded-full group-hover:bg-scm-red group-hover:w-20 transition-all duration-700"></div>
                       <p className="text-gray-500 text-sm font-medium leading-relaxed italic group-hover:text-gray-700">"Serving the movement with passion and purpose."</p>
                    </div>
                  </div>
                </div>
              ))}

              {leaders.length === 0 && !loading && (
                <div className="col-span-full text-center py-24 bg-gray-50 rounded-[40px] border-4 border-dashed border-gray-200">
                  <Users size={64} className="mx-auto mb-6 text-gray-300" />
                  <p className="text-xl font-black text-gray-400">Leadership profiles are being updated. Check back soon!</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Structure Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row items-center gap-16">
              <div className="w-full md:w-1/2">
                 <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-scm-blue/10 text-scm-blue text-sm font-black mb-8 border border-scm-blue/10">
                    GOVERNANCE
                 </div>
                 <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">Our Organizational <span className="text-scm-blue">Structure</span></h2>
                 <p className="text-gray-600 text-lg leading-relaxed mb-10 font-medium italic">
                    The SCM is structured to ensure effective leadership and smooth operation across all departments. Each leader plays a vital role in nurturing the spiritual and social wellbeing of our global membership.
                 </p>
                 <ul className="space-y-6">
                    {[
                       { title: 'Executive Council', desc: 'Oversees the overall direction and spiritual growth of the movement.' },
                       { title: 'Departmental Heads', desc: 'Manage specific areas like Worship, Welfare, Academic, and Missions.' },
                       { title: 'Sub-Committees', desc: 'Focus on event planning, communication, and campus outreach.' },
                    ].map((item, idx) => (
                       <li key={idx} className="flex items-start group">
                          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-scm-red mr-5 group-hover:bg-scm-red group-hover:text-white transition-all duration-500 border border-gray-100">
                             <ShieldCheck size={24} />
                          </div>
                          <div className="flex-1 border-b border-gray-200 pb-6 group-hover:border-scm-blue/30 transition-colors">
                             <h4 className="text-xl font-black text-gray-900 mb-1 group-hover:text-scm-blue transition-colors">{item.title}</h4>
                             <p className="text-gray-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                          </div>
                       </li>
                    ))}
                 </ul>
              </div>
              <div className="w-full md:w-1/2 relative">
                 <div className="bg-scm-blue rounded-[50px] p-12 text-white relative z-10 shadow-2xl overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-150 transition-transform duration-700"></div>
                    <h3 className="text-3xl font-black mb-8 underline decoration-scm-red/40 underline-offset-8">Join the Team</h3>
                    <p className="text-white/80 text-lg mb-10 leading-relaxed font-light">
                    Are you passionate about serving and ready to make a difference? We're always looking for dedicated individuals to join our leadership and volunteer teams.
                 </p>
                 <button className="px-10 py-5 bg-scm-red text-white rounded-full font-black hover:bg-red-700 transition-all shadow-xl hover:shadow-red-900/40 transform hover:scale-105 active:scale-95 flex items-center">
                    Learn More About Volunteering <ChevronRight size={20} className="ml-2" />
                 </button>
                 </div>
                 <div className="absolute -bottom-10 -right-10 w-full h-full bg-scm-red/10 rounded-[50px] -z-0 transform rotate-3"></div>
              </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Leadership;
