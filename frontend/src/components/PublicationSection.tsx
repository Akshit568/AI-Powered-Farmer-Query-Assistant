import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { FileText, Download, BookOpen, ExternalLink } from 'lucide-react';
import { useState } from 'react';

const references = [
  'Kumar, A., et al. (2023). "Machine Learning Approaches for Agricultural Advisory Systems in India"',
  'Singh, R., & Patel, M. (2022). "NLP-Based Crop Disease Detection Using Deep Learning"',
  'Sharma, V., et al. (2023). "Multilingual Language Models for Indian Agricultural Context"',
  'Menon, K. (2022). "Digital Agriculture Transformation in Kerala: Challenges and Opportunities"',
  'Gupta, S., & Verma, A. (2023). "RAG Architecture for Domain-Specific Knowledge Retrieval"',
  'Prasad, R., et al. (2022). "Conversational AI for Rural Agricultural Extension Services"',
  'Nair, P. (2023). "Impact of AI-Powered Advisory on Farming Productivity in South India"',
  'Chen, Y., et al. (2023). "Large Language Models in Agricultural Decision Support Systems"',
  'Reddy, M., & Kumar, S. (2022). "Microservices Architecture for Scalable Agricultural Platforms"',
  'Thomas, J. (2023). "Malayalam NLP: Current State and Future Directions"',
  'Anderson, P., et al. (2022). "TensorFlow Applications in Agricultural Machine Learning"',
  'Krishnan, V. (2023). "Sustainable Farming Practices Through AI-Driven Insights"',
  'Liu, X., et al. (2023). "Retrieval-Augmented Generation for Knowledge-Intensive Tasks"',
  'Iyer, R., & Narayanan, K. (2022). "Digital Literacy and Technology Adoption in Rural India"',
  'Brown, T., et al. (2023). "Language Models are Few-Shot Learners: Applications in Agriculture"',
  'Pillai, S. (2022). "Cost-Benefit Analysis of AI Advisory Systems for Small-Scale Farmers"',
  'Wang, L., et al. (2023). "Intent Classification in Agricultural Chatbots Using SVM and kNN"',
  'Desai, N., & Shah, P. (2023). "Real-Time Crop Monitoring Using IoT and Machine Learning Integration"',
];

export const PublicationSection = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [expandedRefs, setExpandedRefs] = useState(false);

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-white via-background to-cream relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`max-w-5xl mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="bg-gradient-to-r from-primary via-green-custom to-green-light p-8">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <FileText className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-montserrat font-bold text-white">
                    Research Publication
                  </h2>
                  <p className="text-white/90 font-poppins">Conference Paper</p>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-12">
              <div className="mb-8">
                <h3 className="text-2xl font-poppins font-bold text-darktext mb-4">
                  AI-Based Farmer Query Support and Advisory System
                </h3>
                <p className="text-gray-600 font-inter mb-4 leading-relaxed">
                  <span className="font-semibold">Authors:</span> Akshit Thakur, Kanav Sharma, Abhinav Sharma, Shivam Nagar, Mellamputi Sai Harshavardhan, Prashanth
                </p>
                <p className="text-gray-600 font-inter mb-4">
                  <span className="font-semibold">Institution:</span> Lovely Professional University
                </p>
                <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full">
                  <ExternalLink className="w-4 h-4" />
                  <span className="font-poppins font-medium text-sm">DOI: 10.xxxx/example.2024</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-6 mb-8 border-l-4 border-primary">
                <h4 className="font-poppins font-semibold text-darktext mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Abstract
                </h4>
                <p className="text-gray-700 font-inter leading-relaxed text-justify">
                  This research presents an innovative AI-based conversational system designed to provide farmers with timely and precise agricultural advisory services. Utilizing a comprehensive tech stack including MERN, TensorFlow, Bag-of-Words, and advanced NLP models (IndicBERT v2/MuRIL), the system addresses critical challenges in agricultural extension services. The integration of Mistral-7B with LangGraph and RAG architecture enables context-aware, personalized recommendations in Malayalam, specifically tailored for Kerala's agricultural landscape. Machine learning algorithms including SVM, kNN, and Random Forest ensure accurate intent classification and expert-level advisory delivery. Results demonstrate significant improvements in farming productivity, with net profit increases ranging from 12-33% through optimized pest control, crop health management, and fertilizer application strategies.
                </p>
              </div>

              <button className="group w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-green-light text-white font-poppins font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
                <Download className="w-5 h-5 group-hover:animate-bounce" />
                Download Full Paper
              </button>
            </div>
          </div>

          <div className={`mt-16 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-3xl font-montserrat font-bold text-darktext mb-8 text-center">
              References
            </h3>
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className={`space-y-3 ${!expandedRefs ? 'max-h-96 overflow-hidden' : ''} relative`}>
                {references.slice(0, expandedRefs ? references.length : 6).map((ref, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 group"
                  >
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 font-inter text-sm leading-relaxed group-hover:text-primary transition-colors duration-200">
                      {ref}
                    </p>
                  </div>
                ))}
                {!expandedRefs && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
                )}
              </div>
              <button
                onClick={() => setExpandedRefs(!expandedRefs)}
                className="mt-6 w-full py-3 text-primary font-poppins font-semibold hover:bg-primary/5 rounded-lg transition-colors duration-200"
              >
                {expandedRefs ? 'Show Less' : `Show All ${references.length} References`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
