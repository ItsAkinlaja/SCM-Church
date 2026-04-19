import { ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <div className="flex items-center space-x-2 text-sm font-bold text-white/60">
      <Link to="/" className="hover:text-white">Home</Link>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        const displayName = name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

        return (
          <div key={name} className="flex items-center space-x-2">
            <ChevronRight size={16} />
            {isLast ? (
              <span className="text-white font-black">{displayName}</span>
            ) : (
              <Link to={routeTo} className="hover:text-white">{displayName}</Link>
            )}
          </div>
        );
      })}
    </div>
  );
};

const PageHeader = ({ title, subtitle, image }) => {
  return (
    <div className="relative h-[450px] bg-scm-blue overflow-hidden mb-24">
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105" />
      <div className="absolute inset-0 bg-gradient-to-b from-scm-blue/60 via-transparent to-scm-blue"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center">
        <div className="mb-8 animate-fade-in">
          <Breadcrumbs />
        </div>
        
        <h1 className="text-5xl md:text-8xl font-serif font-bold text-white mb-6 tracking-tight animate-fade-in [animation-delay:200ms]">
          {title}
        </h1>
        
        {subtitle && (
          <div className="relative">
            <div className="absolute -left-8 top-1/2 w-4 h-px bg-scm-accent hidden md:block" />
            <p className="text-lg md:text-xl text-scm-accent font-sans font-bold uppercase tracking-[0.4em] animate-fade-in [animation-delay:400ms]">
              {subtitle}
            </p>
            <div className="absolute -right-8 top-1/2 w-4 h-px bg-scm-accent hidden md:block" />
          </div>
        )}
      </div>

      {/* Elegant Bottom Curve/Shape */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-scm-cream rounded-t-[3rem]" />
    </div>
  );
};

export default PageHeader;
