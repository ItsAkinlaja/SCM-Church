import { Heart, Banknote, Landmark, ArrowRight } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const SupportUs = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">
      <PageHeader 
        title="Support Us" 
        subtitle="Partner with Us to Spread the Gospel"
        image="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1170&auto=format&fit=crop"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-5 py-2 rounded-full bg-scm-red/5 text-scm-red border border-scm-red/10 animate-fade-in">
            <Heart size={16} className="mr-2" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Support Our Mission</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mt-8 leading-tight tracking-tighter">
            Partner with Us to <br />
            <span className="text-scm-red">Spread the Gospel</span>
          </h1>
          <p className="max-w-2xl mx-auto mt-8 text-xl text-gray-500 font-medium leading-relaxed">
            Your generous contributions enable us to continue our work in the community and beyond. Every gift, no matter the size, makes a significant impact.
          </p>
        </div>

        {/* Ways to Give */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
          <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100 hover:border-scm-blue/20 hover:scale-[1.03] transition-all duration-500 group">
            <div className="w-16 h-16 bg-scm-blue text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:rotate-12 transition-all duration-500">
              <Heart size={28} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 group-hover:text-scm-blue transition-colors">Ministry Partnerships</h3>
            <p className="text-gray-500 font-medium mb-8">Join us in our mission through regular partnerships and support for specific church projects.</p>
            <div className="text-left pt-6 border-t border-gray-100">
              <p className="font-bold text-gray-700"><strong>Outreach:</strong> Community & Global Missions</p>
              <p className="font-bold text-gray-700"><strong>Welfare:</strong> Supporting those in need</p>
              <p className="font-bold text-gray-700"><strong>Projects:</strong> Church Building & Facilities</p>
            </div>
          </div>

          <div className="bg-white p-12 rounded-[40px] shadow-2xl border border-gray-100 hover:border-scm-red/20 hover:scale-[1.03] transition-all duration-500 group">
            <div className="w-16 h-16 bg-scm-red text-white rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:-rotate-12 transition-all duration-500">
              <Landmark size={28} />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4 group-hover:text-scm-red transition-colors">Bank Transfer</h3>
            <p className="text-gray-500 font-medium mb-8">You can also give directly through a bank transfer to the ministry's account.</p>
            <div className="text-left pt-6 border-t border-gray-100">
              <p className="font-bold text-gray-700"><strong>Bank:</strong> First Bank Nigeria</p>
              <p className="font-bold text-gray-700"><strong>Account Name:</strong> Successful Christian Missions</p>
              <p className="font-bold text-gray-700"><strong>Account Number:</strong> 2000564133</p>
            </div>
          </div>
        </div>

        {/* Thank You Note */}
        <div className="text-center mt-24 max-w-3xl mx-auto">
          <h4 className="text-2xl font-black text-gray-800">A Grateful Heart</h4>
          <p className="mt-4 text-gray-500 font-medium text-lg italic">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7
          </p>
          <p className="mt-6 text-gray-500 font-medium">
            Thank you for your faithfulness and support. May God bless you abundantly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SupportUs;
