import { Image as ImageIcon } from 'lucide-react';
import PageHeader from '../components/PageHeader';

const Gallery = () => {
  // Placeholder images for the gallery
  const images = [
    "https://images.unsplash.com/photo-1544427920-c49ccfb85579?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=1171&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1173&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1170&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1170&auto=format&fit=crop"
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <PageHeader 
        title="Gallery" 
        subtitle="A glimpse into our worship, events, and community life at Successful Christian Missions."
        image="https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-5 py-2 rounded-full bg-scm-blue/5 text-scm-blue border border-scm-blue/10 animate-fade-in">
            <ImageIcon size={16} className="mr-2" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Our Memories</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mt-8 leading-tight tracking-tighter">
            Moments of <br />
            <span className="text-scm-blue">Fellowship</span>
          </h1>
          <p className="max-w-2xl mx-auto mt-8 text-xl text-gray-500 font-medium leading-relaxed">
            A glimpse into our worship, events, and community life at Successful Christian Missions.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {images.map((src, index) => (
            <div key={index} className="aspect-square rounded-[40px] overflow-hidden shadow-xl border-4 border-white group relative">
              <img 
                src={src} 
                alt={`Gallery image ${index + 1}`} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-scm-blue/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
