import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { XCircle, CheckCircle, DollarSign, Globe, Smartphone } from 'lucide-react';

const challenges = [
  {
    before: 'High consultation costs',
    after: 'Free 24/7 AI advisory',
    icon: DollarSign,
    color: 'from-red-500 to-green-light',
  },
  {
    before: 'Language barriers (English-only)',
    after: 'Native Malayalam support',
    icon: Globe,
    color: 'from-orange-500 to-accent',
  },
  {
    before: 'Limited digital literacy',
    after: 'Simple conversational interface',
    icon: Smartphone,
    color: 'from-yellow-500 to-primary',
  },
];

export const ChallengesSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-background to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-darktext mb-4">
            Challenges Addressed
          </h2>
          <p className="text-xl text-gray-600 font-poppins max-w-3xl mx-auto">
            Transforming barriers into opportunities for agricultural advancement
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {challenges.map((challenge, index) => {
            const Icon = challenge.icon;
            return (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-200 hover:border-red-300 transition-all duration-300 transform hover:scale-105 shadow-lg relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-200/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300 -translate-y-8 translate-x-8"></div>
                    <div className="relative flex items-start gap-4">
                      <XCircle className="w-8 h-8 text-red-500 flex-shrink-0 mt-1" strokeWidth={2.5} />
                      <div>
                        <h4 className="text-sm font-poppins font-semibold text-red-600 mb-2">BEFORE</h4>
                        <p className="text-lg font-inter text-gray-800">{challenge.before}</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative flex justify-center md:justify-start items-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${challenge.color} rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="hidden md:block absolute left-0 right-0 h-1 bg-gradient-to-r from-red-300 via-gray-300 to-green-300 -z-10"></div>
                  </div>

                  <div className="bg-green-50 rounded-2xl p-8 border-2 border-green-200 hover:border-green-300 transition-all duration-300 transform hover:scale-105 shadow-lg relative overflow-hidden group md:col-start-2 md:row-start-1">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-200/30 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300 -translate-y-8 translate-x-8"></div>
                    <div className="relative flex items-start gap-4">
                      <CheckCircle className="w-8 h-8 text-green-600 flex-shrink-0 mt-1" strokeWidth={2.5} />
                      <div>
                        <h4 className="text-sm font-poppins font-semibold text-green-600 mb-2">AFTER</h4>
                        <p className="text-lg font-inter text-gray-800">{challenge.after}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`mt-16 max-w-4xl mx-auto bg-gradient-to-r from-primary/5 via-accent/5 to-green-light/5 rounded-2xl p-8 border border-primary/20 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h3 className="text-2xl font-montserrat font-bold text-darktext mb-4 text-center">
            Breaking Down Barriers
          </h3>
          <p className="text-gray-700 font-inter text-center leading-relaxed">
            By addressing critical challenges in cost, language, and accessibility, our system democratizes agricultural expertise and empowers farmers with intelligent, personalized advisory services.
          </p>
        </div>
      </div>
    </section>
  );
};
