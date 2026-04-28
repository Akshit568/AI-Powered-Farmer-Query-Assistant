import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { MessageCircle, Bot, User, Send } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

interface Message {
  role: 'user' | 'bot';
  text: string;
  intent?: string;
}

interface ConversationHistoryItem {
  role: string;
  content: string;
}

export const ChatbotDemo = () => {
  const { ref, isVisible } = useScrollAnimation(0.1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const sendMessage = async () => {
    const userMessage = inputValue.trim();
    if (!userMessage) return;

    setInputValue('');

    const newUserMessage: Message = { role: 'user', text: userMessage };
    setMessages((prev) => [...prev, newUserMessage]);

    const updatedHistory: ConversationHistoryItem[] = [
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    setIsTyping(true);

    try {
      const farmerId = localStorage.getItem('farmer_id') || null;

      const response = await fetch('http://127.0.0.1:8000/api/chatbot/chat',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          farmer_id: farmerId,
          message: userMessage,
          language: 'malayalam',
          conversation_history: conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from server');
      }

      const data = await response.json();

      const botMessage: Message = {
        role: 'bot',
        text: data.reply,
        intent: data.intent_detected,
      };

      setMessages((prev) => [...prev, botMessage]);

      const finalHistory: ConversationHistoryItem[] = [
        ...updatedHistory,
        { role: 'assistant', content: data.reply }
      ];
      setConversationHistory(finalHistory);

    } catch (err) {
      const errorMessage: Message = {
        role: 'bot',
        text: 'Sorry, could not connect to advisor. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
      setError('Connection error. Please check if the backend server is running.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-to-b from-white to-background relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIgZmlsbD0iIzFCNUUyMCIvPjwvc3ZnPg==')] bg-repeat"></div>

      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg animate-slide-up">
          {error}
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-2 rounded-full mb-4">
            <MessageCircle className="w-5 h-5" />
            <span className="font-poppins font-medium">Interactive Demo</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-montserrat font-bold text-darktext mb-4">
            Experience the Chatbot
          </h2>
          <p className="text-xl text-gray-600 font-poppins max-w-3xl mx-auto">
            Natural Malayalam conversation for agricultural advisory
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className={`bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="bg-gradient-to-r from-primary to-green-light p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-poppins font-semibold text-lg">AI Farm Advisor</h3>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                    <span className="text-white/90 text-sm">Active</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="h-96 overflow-y-auto p-6 bg-gradient-to-b from-gray-50 to-white">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 font-inter text-center">
                      Start a conversation with the AI Farm Advisor
                    </p>
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''} animate-slide-up`}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-accent to-sky-custom'
                        : 'bg-gradient-to-br from-primary to-green-light'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="w-5 h-5 text-white" />
                      ) : (
                        <Bot className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block p-4 rounded-2xl shadow-md ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-accent to-sky-custom text-white rounded-tr-none'
                          : 'bg-white text-gray-800 rounded-tl-none border border-gray-200'
                      }`}>
                        <p className="font-inter leading-relaxed">{message.text}</p>
                        {message.intent && (
                          <div className="mt-2 inline-block">
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-poppins">
                              {message.intent}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-start gap-3 animate-fade-in">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-green-light">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-md border border-gray-200">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            <div className="p-6 bg-white border-t border-gray-200">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="നിങ്ങളുടെ ചോദ്യം ടൈപ്പ് ചെയ്യുക... (Type your question...)"
                  className="flex-1 px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 font-inter"
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  className="p-3 bg-gradient-to-r from-primary to-green-light text-white rounded-full hover:shadow-lg transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className={`mt-8 text-center transition-all duration-700 delay-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-gray-600 font-inter">
              Live chat with AI-powered agricultural advisory system
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
