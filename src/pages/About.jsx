import { useState, useEffect } from 'react';
import { Target, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { supabase } from '../services/supabaseClient';

const About = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase.from('settings').select('*').single();
      if (data) setSettings(data);
    };
    fetchSettings();
  }, []);

  return (
    <div className="flex flex-col bg-white">
      <PageHeader 
        title="Who We Are" 
        subtitle="A Global Mission for Christ"
        image="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1173&auto=format&fit=crop"
      />

      {/* History Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center gap-24">
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-10 leading-tight tracking-tighter">
              Rooted in <br />
              <span className="text-scm-red">Purpose</span>
            </h2>
            <div className="space-y-6 text-gray-500 text-lg font-medium leading-relaxed">
              <p>
                {settings?.description || 'Successful Christian Missions (SCM) started with a simple yet profound vision: to reach every soul with the life-changing message of Jesus Christ. Over the years, we have grown into a dynamic community that spans across borders, touching lives in universities, cities, and rural areas.'}
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/2 grid grid-cols-2 gap-6">
             <div className="space-y-6 pt-12">
                <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
                   <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1170&auto=format&fit=crop" alt="Mission" className="w-full h-full object-cover" />
                </div>
             </div>
             <div className="space-y-6">
                <div className="aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white">
                   <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" alt="Community" className="w-full h-full object-cover" />
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission - Minimalist Style */}
      <section className="py-32 bg-gray-50 rounded-[80px] mx-4 lg:mx-8 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            <div className="space-y-8">
               <div className="w-16 h-16 bg-scm-blue text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <Target size={32} />
               </div>
               <h3 className="text-4xl font-black text-gray-900 tracking-tight">Our Vision</h3>
               <p className="text-2xl text-gray-500 font-bold leading-relaxed italic">
                 "{settings?.vision || 'To see a world transformed by the love and power of Christ, through a movement of believers walking in their God-given destiny.'}"
               </p>
            </div>
            <div className="space-y-8">
               <div className="w-16 h-16 bg-scm-red text-white rounded-2xl flex items-center justify-center shadow-lg">
                  <ShieldCheck size={32} />
               </div>
               <h3 className="text-4xl font-black text-gray-900 tracking-tight">Our Mission</h3>
               <p className="text-xl text-gray-500 font-bold leading-relaxed">
                 {settings?.mission || 'We are committed to developing spiritual leaders of excellence to bring the gospel of Christ to all mankind.'}
               </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
