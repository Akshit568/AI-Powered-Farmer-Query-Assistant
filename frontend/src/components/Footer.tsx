import { Sprout, Mail, MapPin, GraduationCap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-darktext via-gray-800 to-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')] bg-repeat"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12 max-w-3xl mx-auto">
          <div>
            <h3 className="font-montserrat font-bold text-lg mb-6 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Institution
            </h3>
            <div className="space-y-3">
              <p className="text-white/90 font-poppins font-semibold">
                Lovely Professional University
              </p>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-white/80 font-inter text-sm">
                  Jalandhar, Punjab, India
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-montserrat font-bold text-lg mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact
            </h3>
            <div className="space-y-3">
              <a
                href="mailto:research@lpu.edu"
                className="block text-white/80 hover:text-accent transition-colors duration-200 font-inter"
              >
                research@lpu.edu
              </a>
              <a
                href="mailto:agritech@lpu.edu"
                className="block text-white/80 hover:text-accent transition-colors duration-200 font-inter"
              >
                agritech@lpu.edu
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/70 font-inter text-sm text-center md:text-left">
              © 2024 AI-Based Farmer Query Support System. All rights reserved.
            </p>
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-green-light animate-pulse" />
              <p className="text-white/70 font-inter text-sm">
                Growing knowledge, nurturing progress
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-green-light"></div>
    </footer>
  );
};
