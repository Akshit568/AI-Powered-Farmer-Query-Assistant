import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { TrendingUp, Clock, DollarSign, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

const metrics = [
  {
    value: 12,
    maxValue: 33,
    label: 'Net Profit Increase',
    suffix: '-33%',
    icon: DollarSign,
    color: 'from-green-light to-green-custom',
  },
  {
    value: 24,
    maxValue: 24,
    label: '24/7 Expert Advisory',
    suffix: '/7',
    icon: Clock,
    color: 'from-accent to-sky-custom',
  },
  {
    value: 100,
    maxValue: 100,
    label: 'Real-time Malayalam Support',
    suffix: '%',
    icon: Users,
    color: 'from-secondary to-brown-warm',
  },
];

export const ImpactSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [counters, setCounters] = useState(metrics.map(() => 0));
  const [progress, setProgress] = useState(metrics.map(() => 0));

  useEffect(() => {
    if (!isVisible) return;

    const timers = metrics.map((metric, index) => {
      const duration = 2500;
      const steps = 60;
      const increment = metric.value / steps;
      const progressIncrement = metric.maxValue / steps;
      let current = 0;
      let currentProgress = 0;

      return setInterval(() => {
        current += increment;
        currentProgress += progressIncrement;
        if (current >= metric.value) {
          current = metric.value;
          currentProgress = metric.maxValue;
          clearInterval(timers[index]);
        }
        setCounters((prev) => {
          const newCounters = [...prev];
          newCounters[index] = Math.floor(current);
          return newCounters;
        });
        setProgress((prev) => {
          const newProgress = [...prev];
          newProgress[index] = Math.floor(currentProgress);
          return newProgress;
        });
      }, duration / steps);
    });

    return () => timers.forEach(clearInterval);
  }, [isVisible]);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-primary via-green-custom to-green-light relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-white mb-4">
            Measurable Impact
          </h2>
          <p className="text-xl text-white/90 font-poppins max-w-3xl mx-auto">
            Transforming agricultural outcomes through intelligent technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl">
                  <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${metric.color} rounded-full flex items-center justify-center shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>

                  <div className="text-center mb-4">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-5xl font-bold font-montserrat text-white">
                        {counters[index]}
                      </span>
                      <span className="text-3xl font-semibold font-montserrat text-white/80">
                        {metric.suffix}
                      </span>
                      <TrendingUp className="w-6 h-6 text-white animate-bounce" />
                    </div>
                    <p className="text-white/90 font-poppins font-medium">
                      {metric.label}
                    </p>
                  </div>

                  <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${metric.color} rounded-full transition-all duration-300`}
                      style={{ width: `${(progress[index] / metric.maxValue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={`mt-16 max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 transition-all duration-700 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h3 className="text-2xl font-montserrat font-bold text-white mb-4 text-center">
            Empowering Farmers Across Kerala
          </h3>
          <p className="text-white/90 font-inter text-center leading-relaxed">
            Our AI-powered advisory system has demonstrated significant improvements in farming outcomes, enabling data-driven decision-making and accessible expert guidance for agricultural communities.
          </p>
        </div>
      </div>
    </section>
  );
};
