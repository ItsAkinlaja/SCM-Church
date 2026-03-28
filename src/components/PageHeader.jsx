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
    <div className="relative h-80 bg-gray-900 rounded-b-[50px] overflow-hidden mb-16">
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-scm-blue/70 to-transparent"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-end pb-16">
        <Breadcrumbs />
        <h1 className="text-5xl md:text-7xl font-black text-white mt-4 leading-tight tracking-tighter">
          {title}
        </h1>
        {subtitle && <p className="text-xl text-white/80 font-medium mt-4 max-w-2xl">{subtitle}</p>}
      </div>
    </div>
  );
};

export default PageHeader;
