import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { UserCircle, MessageSquare, Activity, Lightbulb, Bell, Database } from 'lucide-react';

const features = [
  {
    icon: UserCircle,
    title: 'Comprehensive Farmer Profile',
    description: 'Detailed user profiles capturing farming practices, crop types, and historical data for personalized insights.',
    gradient: 'from-primary to-green-light',
  },
  {
    icon: MessageSquare,
    title: 'Malayalam Conversational Interface',
    description: 'Natural language processing in Malayalam ensuring accessible communication for Kerala farmers.',
    gradient: 'from-accent to-sky-custom',
  },
  {
    icon: Activity,
    title: 'Activity Tracking',
    description: 'Real-time monitoring of farming activities, crop cycles, and intervention timelines.',
    gradient: 'from-green-light to-green-custom',
  },
  {
    icon: Lightbulb,
    title: 'Personalized Advisory',
    description: 'AI-driven recommendations tailored to specific crops, soil conditions, and weather patterns.',
    gradient: 'from-secondary to-brown-warm',
  },
  {
    icon: Bell,
    title: 'Reminders & Alerts',
    description: 'Timely notifications for fertilizer application, pest control, and critical farming tasks.',
    gradient: 'from-accent to-primary',
  },
  {
    icon: Database,
    title: 'Localized Knowledge Engine',
    description: 'RAG-powered knowledge base with region-specific agricultural expertise and best practices.',
    gradient: 'from-green-custom to-accent',
  },
];

export const FeaturesSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-background to-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-darktext mb-4">
            Core Features
          </h2>
          <p className="text-xl text-gray-600 font-poppins max-w-3xl mx-auto">
            Intelligent systems designed to empower farmers with actionable insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`group relative transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="relative h-full bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden">
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-full blur-2xl transition-opacity duration-500 -translate-y-8 translate-x-8`}></div>

                  <div className={`w-16 h-16 mb-6 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                  </div>

                  <h3 className="text-xl font-poppins font-semibold text-darktext mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 font-inter leading-relaxed">
                    {feature.description}
                  </p>

                  <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
