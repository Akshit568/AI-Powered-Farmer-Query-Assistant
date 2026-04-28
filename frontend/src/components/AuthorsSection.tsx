import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { User, GraduationCap } from 'lucide-react';

const authors = [
  { name: 'Akshit Thakur', role: 'Lead Researcher' },
  { name: 'Kanav Sharma', role: 'ML Engineer' },
  { name: 'Abhinav Sharma', role: 'NLP Specialist' },
  { name: 'Shivam Nagar', role: 'Full Stack Developer' },
  { name: 'Mellamputi Sai Harshavardhan', role: 'Data Scientist' },
  { name: 'Prashanth', role: 'Systems Architect' },
];

export const AuthorsSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-background to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-darktext mb-4">
            Research Team
          </h2>
          <div className="flex items-center justify-center gap-2 text-secondary">
            <GraduationCap className="w-6 h-6" />
            <p className="text-xl font-poppins">Lovely Professional University</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {authors.map((author, index) => (
            <div
              key={index}
              className={`group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:scale-105 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary to-green-light rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <User className="w-10 h-10 text-white" />
                </div>

                <h3 className="text-xl font-poppins font-semibold text-darktext text-center mb-2 group-hover:text-primary transition-colors duration-300">
                  {author.name}
                </h3>

                <p className="text-secondary text-center font-inter text-sm">
                  {author.role}
                </p>

                <div className="mt-4 h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary to-accent mx-auto transition-all duration-500 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
