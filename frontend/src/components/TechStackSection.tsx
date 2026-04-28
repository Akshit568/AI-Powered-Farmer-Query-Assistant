import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Code, Database, Brain, Cpu, Network, Zap } from 'lucide-react';

const technologies = [
  { name: 'MongoDB', icon: Database, category: 'Database' },
  { name: 'Express.js', icon: Code, category: 'Backend' },
  { name: 'React', icon: Code, category: 'Frontend' },
  { name: 'Node.js', icon: Network, category: 'Runtime' },
  { name: 'TensorFlow', icon: Brain, category: 'ML Framework' },
  { name: 'Bag-of-Words', icon: Cpu, category: 'NLP' },
  { name: 'SVM', icon: Brain, category: 'ML Algorithm' },
  { name: 'Random Forest', icon: Brain, category: 'ML Algorithm' },
  { name: 'kNN', icon: Brain, category: 'ML Algorithm' },
  { name: 'IndicBERT v2', icon: Cpu, category: 'Language Model' },
  { name: 'MuRIL', icon: Cpu, category: 'Language Model' },
  { name: 'Mistral-7B', icon: Zap, category: 'LLM' },
  { name: 'LangGraph', icon: Network, category: 'Orchestration' },
  { name: 'RAG', icon: Database, category: 'Architecture' },
];

export const TechStackSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-darktext via-gray-800 to-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSIyIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==')] bg-repeat"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-4">
            Technology Stack
          </h2>
          <p className="text-xl text-gray-300 font-poppins max-w-3xl mx-auto">
            Cutting-edge technologies powering intelligent agricultural advisory
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto mb-12">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <div
                key={index}
                className={`group relative transition-all duration-700 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="relative bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 cursor-pointer border border-white/20 hover:border-accent/50">
                  <div className="flex flex-col items-center">
                    <Icon className="w-10 h-10 text-accent mb-3 group-hover:text-white transition-colors duration-300 group-hover:animate-pulse" />
                    <span className="text-white font-poppins font-medium text-center text-sm mb-1">
                      {tech.name}
                    </span>
                    <span className="text-gray-400 text-xs font-inter">
                      {tech.category}
                    </span>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-primary/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`mt-16 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-montserrat font-bold text-white mb-6 text-center">
              Microservice Architecture
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white/5 rounded-xl p-6 border border-accent/30 hover:border-accent hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                  <h4 className="text-white font-poppins font-semibold">NLP Processing</h4>
                </div>
                <p className="text-gray-300 text-sm font-inter">
                  Intent classification and entity extraction using IndicBERT and MuRIL
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-green-light/30 hover:border-green-light hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-green-light rounded-full animate-pulse"></div>
                  <h4 className="text-white font-poppins font-semibold">LLM Reasoning</h4>
                </div>
                <p className="text-gray-300 text-sm font-inter">
                  Mistral-7B with LangGraph for contextual advisory generation
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-6 border border-sky-custom/30 hover:border-sky-custom hover:bg-white/10 transition-all duration-300">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-3 h-3 bg-sky-custom rounded-full animate-pulse"></div>
                  <h4 className="text-white font-poppins font-semibold">RAG Knowledge</h4>
                </div>
                <p className="text-gray-300 text-sm font-inter">
                  Retrieval-augmented generation for localized agricultural knowledge
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
