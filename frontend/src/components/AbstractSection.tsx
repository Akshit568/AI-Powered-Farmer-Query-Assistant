import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { AlertCircle, TrendingUp, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';

const stats = [
  { value: 45, label: 'Water Efficiency Increase', suffix: '%' },
  { value: 6, label: 'Million sq. km Farmland', suffix: 'M' },
  { value: 33, label: 'Potential Profit Increase', suffix: '%' },
];

export const AbstractSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [counters, setCounters] = useState(stats.map(() => 0));

  useEffect(() => {
    if (!isVisible) return;

    const timers = stats.map((stat, index) => {
      const duration = 2000;
      const steps = 60;
      const increment = stat.value / steps;
      let current = 0;

      return setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(timers[index]);
        }
        setCounters((prev) => {
          const newCounters = [...prev];
          newCounters[index] = Math.floor(current);
          return newCounters;
        });
      }, duration / steps);
    });

    return () => timers.forEach(clearInterval);
  }, [isVisible]);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-white via-cream to-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMkU3RDMyIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-6">
              <AlertCircle className="w-5 h-5" />
              <span className="font-poppins font-medium">The Challenge</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-darktext mb-6 leading-tight">
              Bridging the Agricultural Knowledge Gap
            </h2>

            <p className="text-lg text-gray-700 font-inter mb-6 leading-relaxed">
              Farmers frequently do not receive timely and precise agricultural advice, resulting in suboptimal decision-making regarding pest control, crop health, fertilizer application timing, and rates.
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                <p className="text-gray-600 font-inter">Limited access to expert agricultural consultants in rural areas</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-light rounded-full mt-2"></div>
                <p className="text-gray-600 font-inter">Language barriers preventing effective knowledge transfer</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                <p className="text-gray-600 font-inter">Cost constraints limiting consultation opportunities</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                <p className="text-gray-600 font-inter">Time-sensitive decisions requiring immediate guidance</p>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-2 text-primary">
              <MapPin className="w-5 h-5" />
              <span className="font-poppins font-medium">Focus Region: Kerala, India</span>
            </div>
          </div>

          <div className={`transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="grid grid-cols-1 gap-6">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-l-4 border-primary"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-5xl font-bold font-montserrat bg-gradient-to-r from-primary to-green-light bg-clip-text text-transparent">
                          {counters[index]}
                          {stat.suffix}
                        </span>
                        <TrendingUp className="w-6 h-6 text-green-light animate-bounce" />
                      </div>
                      <p className="text-gray-600 font-inter">{stat.label}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
