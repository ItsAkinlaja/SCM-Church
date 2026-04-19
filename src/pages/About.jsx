import { useState, useEffect } from 'react';
import { Target, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { supabase } from '../services/supabaseClient';

const About = () => {
  const [settings, setSettings] = useState(null);
  const [go, setGo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const [settingsRes, goRes] = await Promise.all([
        supabase.from('settings').select('*').single(),
        supabase.from('leaders').select('*').ilike('role', '%General Overseer%').single()
      ]);
      if (settingsRes.data) setSettings(settingsRes.data);
      if (goRes.data) setGo(goRes.data);
    };
    fetchData();
  }, []);

  return (
    <div className="flex flex-col bg-scm-cream">
      <PageHeader 
        title="Who We Are" 
        subtitle="A Global Mission for Christ"
        image="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1173&auto=format&fit=crop"
      />

      {/* Leadership Section - Premium Editorial */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="relative">
              <div className="absolute -inset-6 gold-gradient opacity-10 blur-3xl rounded-full" />
              <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl group">
                <img 
                  src="https://ik.imagekit.io/scmchurch/Professor%20R.%20A.%20Adedoyin.jpg?updatedAt=1774710168274" 
                  alt={go?.name || "General Overseer"} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                {/* Floating Date Badge */}
                <div className="absolute bottom-10 left-10 gold-gradient p-[1px] rounded-2xl shadow-2xl">
                   <div className="bg-white px-8 py-6 rounded-2xl">
                      <p className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-scm-accent mb-1">Established</p>
                      <p className="text-2xl font-serif font-bold text-scm-blue">July 18, 1999</p>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-10">
              <div>
                <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.4em] text-xs mb-6 block">Our Spiritual Leader</span>
                <h2 className="text-4xl md:text-6xl font-serif font-bold text-scm-blue leading-tight mb-4">
                  {go?.name || 'Pastor (Prof.) Rufus A. Adedoyin'}
                </h2>
                <div className="flex items-center gap-4">
                  <div className="h-px w-12 bg-scm-accent" />
                  <span className="text-xl font-serif italic text-scm-red">General Overseer</span>
                </div>
              </div>

              <div className="space-y-6 text-lg text-slate-600 font-medium leading-relaxed italic border-l-4 border-scm-accent/30 pl-8 py-4">
                {go?.bio ? (
                  <div className="space-y-6">
                    {go.bio.split('\n').map((para, i) => (
                      <p key={i}>"{para}"</p>
                    ))}
                  </div>
                ) : (
                  <p>"Leadership details are being updated. Check back soon for more information."</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Section - Modern Grid */}
      <section className="py-32 bg-scm-cream relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="order-2 lg:order-1">
              <span className="text-scm-accent font-sans font-bold uppercase tracking-[0.4em] text-xs mb-6 block">Our Journey</span>
              <h2 className="text-4xl md:text-7xl font-serif font-bold text-scm-blue mb-10 leading-[1.1] tracking-tight">
                Rooted in <br />
                <span className="text-scm-accent">Eternal Purpose</span>
              </h2>
              <p className="text-lg text-slate-600 font-medium leading-relaxed mb-12 max-w-xl">
                {settings?.description || 'Successful Christian Missions (SCM) started with a simple yet profound vision: to reach every soul with the life-changing message of Jesus Christ. Over the years, we have grown into a dynamic community that spans across borders.'}
              </p>
              <div className="flex gap-12">
                <div>
                  <p className="text-4xl font-serif font-bold text-scm-blue mb-2">25+</p>
                  <p className="text-xs font-sans font-bold uppercase tracking-widest text-slate-400">Years of Impact</p>
                </div>
                <div>
                  <p className="text-4xl font-serif font-bold text-scm-blue mb-2">10k+</p>
                  <p className="text-xs font-sans font-bold uppercase tracking-widest text-slate-400">Lives Touched</p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 grid grid-cols-2 gap-6 relative">
              <div className="absolute -inset-10 bg-scm-accent/5 blur-3xl rounded-full pointer-events-none" />
              <div className="space-y-6 pt-16">
                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1170&auto=format&fit=crop" alt="Mission" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80" alt="Community" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission - Premium Cards */}
      <section className="py-32 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="premium-card p-16 relative group overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-scm-blue/5 rounded-bl-[100px] transition-all duration-500 group-hover:scale-110" />
               <div className="w-16 h-16 bg-scm-blue text-white rounded-2xl flex items-center justify-center shadow-xl mb-10 group-hover:-translate-y-2 transition-transform duration-500">
                  <Target size={32} />
               </div>
               <h3 className="text-3xl font-serif font-bold text-scm-blue mb-6">Our Vision</h3>
               <p className="text-xl text-slate-500 font-serif italic leading-relaxed">
                 "{settings?.vision || 'To see a world transformed by the love and power of Christ, through a movement of believers walking in their God-given destiny.'}"
               </p>
            </div>

            <div className="premium-card p-16 relative group overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-scm-accent/5 rounded-bl-[100px] transition-all duration-500 group-hover:scale-110" />
               <div className="w-16 h-16 bg-scm-accent text-white rounded-2xl flex items-center justify-center shadow-xl mb-10 group-hover:-translate-y-2 transition-transform duration-500">
                  <ShieldCheck size={32} />
               </div>
               <h3 className="text-3xl font-serif font-bold text-scm-blue mb-6">Our Mission</h3>
               <p className="text-xl text-slate-600 font-medium leading-relaxed">
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
