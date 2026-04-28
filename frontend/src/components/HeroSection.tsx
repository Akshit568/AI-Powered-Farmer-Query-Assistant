import { Sprout, ChevronDown } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-green-custom to-green-light">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-green-light rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-sky-custom rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 animate-float">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full border-4 border-white/30 shadow-2xl">
            <Sprout className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-montserrat font-bold text-white mb-6 leading-tight">
          <span className="block mb-2">AI-Based Farmer Query</span>
          <span className="block bg-gradient-to-r from-white via-sky-custom to-accent bg-300% animate-gradient bg-clip-text text-transparent">
            Support & Advisory System
          </span>
        </h1>

        <p className="text-xl sm:text-2xl md:text-3xl font-poppins text-white/90 mb-12 max-w-4xl mx-auto font-light">
          Revolutionizing Agriculture Through Intelligent Conversational AI
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
          <a href="#demo" className="group px-8 py-4 bg-white text-primary font-poppins font-semibold rounded-full shadow-2xl hover:shadow-accent/50 hover:scale-105 transition-all duration-300 ease-out flex items-center gap-2">
            Explore Research
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </a>
          <a href="/chat" className="group px-8 py-4 bg-transparent border-2 border-white text-white font-poppins font-semibold rounded-full hover:bg-white hover:text-primary hover:scale-105 transition-all duration-300 ease-out shadow-lg">
            View Demo
          </a>
        </div>

        <div className="animate-bounce">
          <ChevronDown className="w-8 h-8 text-white/70 mx-auto" />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};
