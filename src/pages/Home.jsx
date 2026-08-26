import Hero from "../components/Hero";
import FeaturesPreview from "../components/FeaturesPreview";
import HowItWorksPreview from "../components/HowItWorksPreview";
import ForTeams from "../components/ForTeams";
import FinalCTA from "../components/FinalCTA";

function Home() {
  return (
    <main>
      <Hero />
      <FeaturesPreview />
      <HowItWorksPreview />
      <ForTeams />
      <FinalCTA />
    </main>
  );
}

export default Home;