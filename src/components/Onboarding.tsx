import { useState } from "react";
import { ArrowRight, Wallet, Users, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FinanceCard } from "@/components/FinanceCard";
import { TrustBadge, SecurityIndicator, TrustMetrics } from "@/components/TrustIndicators";

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    referralCode: "",
    agreedToTerms: false
  });

  const features = [
    {
      icon: TrendingUp,
      title: "Compound Growth",
      description: "Earn returns through our proven reinvestment system"
    },
    {
      icon: Users,
      title: "Referral Rewards",
      description: "Build your network and increase your earning potential"
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Bank-level security with full transparency"
    },
    {
      icon: Wallet,
      title: "Easy Deposits",
      description: "Start with as little as $10 and grow your wealth"
    }
  ];

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-12 animate-fade-in">
            <div className="flex justify-center mb-6">
              <TrustBadge />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Build Wealth Through
              <span className="block bg-gradient-to-r from-white to-primary-glow bg-clip-text text-transparent">
                Community Growth
              </span>
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of members earning consistent returns through our transparent, 
              community-driven investment platform with referral rewards and compound growth.
            </p>
            <SecurityIndicator />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {features.map((feature, index) => (
              <FinanceCard key={index} variant="glass" className="p-6 text-center animate-slide-up">
                <feature.icon className="w-12 h-12 text-primary-glow mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/70 text-sm">{feature.description}</p>
              </FinanceCard>
            ))}
          </div>

          <div className="text-center">
            <Button 
              variant="hero" 
              size="xl" 
              onClick={() => setStep(2)}
              className="animate-scale-in"
            >
              Get Started Now
              <ArrowRight className="ml-2" />
            </Button>
            <p className="text-white/60 text-sm mt-4">
              No hidden fees • Full transparency • Start with just $10
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <FinanceCard className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2">Create Your Account</h2>
          <p className="text-muted-foreground">Join our growing community of earners</p>
        </div>

        <form className="space-y-6" onSubmit={(e) => {
          e.preventDefault();
          onComplete();
        }}>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="referral">Referral Code (Optional)</Label>
            <Input
              id="referral"
              placeholder="Enter referral code"
              value={formData.referralCode}
              onChange={(e) => setFormData({...formData, referralCode: e.target.value})}
            />
            <p className="text-xs text-muted-foreground">
              Get an extra 5% bonus on your first deposit
            </p>
          </div>

          <Button type="submit" className="w-full" size="lg">
            Create Account & Continue
          </Button>
        </form>

        <TrustMetrics />

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2 text-sm">Legal Disclaimer</h4>
          <p className="text-xs text-muted-foreground">
            All investments carry risk. Past performance does not guarantee future results. 
            Please read our full terms and risk disclosure before investing.
          </p>
        </div>
      </FinanceCard>
    </div>
  );
}