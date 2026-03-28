import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 320);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })}
      className={`fixed bottom-6 right-6 z-50 inline-flex h-14 w-14 items-center justify-center rounded-full border border-[#f3d7cf] bg-[#b53a2d] text-white shadow-[0_18px_35px_rgba(181,58,45,0.35)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#982b20] hover:shadow-[0_24px_42px_rgba(181,58,45,0.42)] focus:outline-none focus:ring-4 focus:ring-[#b53a2d]/20 ${
        isVisible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
      }`}
    >
      <ArrowUp size={22} />
    </button>
  );
};

export default BackToTopButton;
