import { useState, useEffect } from 'react';
import { Sprout, Menu, X } from 'lucide-react';

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Demo', href: '#demo' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
              scrolled ? 'bg-primary' : 'bg-white/20 backdrop-blur-sm'
            }`}>
              <Sprout className={`w-6 h-6 transition-colors duration-300 ${scrolled ? 'text-white' : 'text-white'}`} />
            </div>
            <span className={`font-montserrat font-bold text-lg transition-colors duration-300 ${
              scrolled ? 'text-primary' : 'text-white'
            }`}>
              AI Farm Advisor
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`font-poppins font-medium transition-all duration-300 hover:scale-105 ${
                  scrolled
                    ? 'text-gray-700 hover:text-primary'
                    : 'text-white hover:text-sky-custom'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-300 ${
              scrolled ? 'text-primary hover:bg-primary/10' : 'text-white hover:bg-white/10'
            }`}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg animate-slide-up">
          <div className="container mx-auto px-4 py-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 text-gray-700 hover:bg-primary/10 hover:text-primary rounded-lg transition-colors duration-200 font-poppins"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};
