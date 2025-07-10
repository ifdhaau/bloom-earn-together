import { useState } from "react";
import { Onboarding } from "@/components/Onboarding";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  const [isOnboarded, setIsOnboarded] = useState(false);

  if (!isOnboarded) {
    return <Onboarding onComplete={() => setIsOnboarded(true)} />;
  }

  return <Dashboard />;
};

export default Index;
