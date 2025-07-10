import { useAuth } from "@/hooks/useAuth";
import { Onboarding } from "@/components/Onboarding";
import { Dashboard } from "@/components/Dashboard";
import Auth from "./Auth";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return <Dashboard />;
};

export default Index;
