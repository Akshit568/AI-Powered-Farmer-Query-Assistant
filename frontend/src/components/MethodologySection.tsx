import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { MessageCircle, Cpu, Target, Brain, Database as DatabaseIcon, CheckCircle } from 'lucide-react';

const steps = [
  {
    icon: MessageCircle,
    title: 'User Input',
    description: 'Farmer queries in Malayalam',
    color: 'from-accent to-sky-custom',
  },
  {
    icon: Cpu,
    title: 'NLP Processing',
    description: 'IndicBERT/MuRIL analysis',
    color: 'from-green-light to-green-custom',
  },
  {
    icon: Target,
    title: 'Intent Classification',
    description: 'SVM, kNN, Random Forest',
    color: 'from-primary to-green-light',
  },
  {
    icon: Brain,
    title: 'LLM Reasoning',
    description: 'Mistral-7B + LangGraph',
    color: 'from-secondary to-brown-warm',
  },
  {
    icon: DatabaseIcon,
    title: 'RAG Retrieval',
    description: 'Knowledge base lookup',
    color: 'from-accent to-primary',
  },
  {
    icon: CheckCircle,
    title: 'Advisory Output',
    description: 'Personalized recommendations',
    color: 'from-green-custom to-accent',
  },
];

export const MethodologySection = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-white to-background relative overflow-hidden">
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-darktext mb-4">
            System Methodology
          </h2>
          <p className="text-xl text-gray-600 font-poppins max-w-3xl mx-auto">
            End-to-end pipeline for intelligent agricultural advisory
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isLastInRow = (index + 1) % 3 === 0;
              const isLast = index === steps.length - 1;

              return (
                <div key={index} className="relative">
                  <div
                    className={`transition-all duration-700 ${
                      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                    }`}
                    style={{ transitionDelay: `${index * 150}ms` }}
                  >
                    <div className="relative bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-transparent hover:border-primary/20 group">
                      <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold font-montserrat shadow-lg">
                        {index + 1}
                      </div>

                      <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                      </div>

                      <h3 className="text-xl font-poppins font-semibold text-darktext text-center mb-2">
                        {step.title}
                      </h3>

                      <p className="text-gray-600 font-inter text-center text-sm">
                        {step.description}
                      </p>

                      <div className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>

                  {!isLast && !isLastInRow && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
                      <svg width="32" height="32" viewBox="0 0 32 32" className={`transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <path d="M8 16 L24 16 M24 16 L18 10 M24 16 L18 22" stroke="#1B5E20" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}

                  {!isLast && isLastInRow && (
                    <div className="hidden lg:block absolute -bottom-12 left-1/2 transform -translate-x-1/2 z-20">
                      <svg width="32" height="48" viewBox="0 0 32 48" className={`transition-all duration-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
                        <path d="M16 8 L16 40 M16 40 L10 34 M16 40 L22 34" stroke="#1B5E20" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className={`mt-16 bg-gradient-to-r from-primary/10 via-accent/10 to-green-light/10 rounded-2xl p-8 border border-primary/20 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-2xl font-montserrat font-bold text-darktext mb-4 text-center">
              Microservices Architecture
            </h3>
            <p className="text-gray-700 font-inter text-center max-w-3xl mx-auto leading-relaxed">
              Our system employs a distributed microservices architecture, ensuring scalability, maintainability, and fault tolerance. Each service operates independently while seamlessly communicating through RESTful APIs and message queues.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
