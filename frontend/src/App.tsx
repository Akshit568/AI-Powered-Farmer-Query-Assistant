import { Navigation } from './components/Navigation';
import { HeroSection } from './components/HeroSection';
import { AbstractSection } from './components/AbstractSection';
import { ImpactSection } from './components/ImpactSection';
import { ChallengesSection } from './components/ChallengesSection';
import { ChatbotDemo } from './components/ChatbotDemo';
import { Footer } from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-background font-roboto">
      <Navigation />
      <main>
        <div id="home">
          <HeroSection />
        </div>
        <AbstractSection />
        <ImpactSection />
        <ChallengesSection />
        <div id="demo">
          <ChatbotDemo />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
