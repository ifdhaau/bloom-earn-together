import React from 'react';
import { TrendingUp, Users, Zap, ArrowRight, PlayCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const benefits = [
    {
      icon: Zap,
      title: "No experience needed",
      description: "Start earning in minutes with our automated system"
    },
    {
      icon: TrendingUp,
      title: "Get paid daily",
      description: "Watch your balance grow every single day"
    },
    {
      icon: Users,
      title: "Earn more by inviting others",
      description: "Double your income through our referral program"
    }
  ];

  const stats = [
    { label: "Active Users", value: "50K+" },
    { label: "Daily Payouts", value: "$2.5M" },
    { label: "Success Rate", value: "98%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Viral Badge */}
          <Badge className="mb-6 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 text-sm animate-pulse">
            🔥 #1 Trending Investment Platform
          </Badge>
          
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-fade-in">
            Earn Daily by Reinvesting
            <br />
            <span className="text-4xl md:text-6xl">100% Passive</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands earning passive income through our AI-powered reinvestment platform. 
            <span className="text-primary font-semibold"> Start with just $10!</span>
          </p>
          
          {/* Stats Row */}
          <div className="flex justify-center gap-8 mb-10">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
          
          {/* CTA Button */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in"
              onClick={onGetStarted}
            >
              Join Now - Start Earning
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 hover:bg-primary/5"
            >
              <PlayCircle className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex justify-center items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>4.9/5 Rating</span>
            </div>
            <span>•</span>
            <span>Featured on TikTok</span>
            <span>•</span>
            <span>Bank-Level Security</span>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Everyone's Talking About Us</h2>
          <p className="text-lg text-muted-foreground">Simple, profitable, and completely automated</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow duration-300 border-primary/20 hover:border-primary/40">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Join the Community</h2>
          <div className="flex justify-center items-center gap-8 mb-8">
            <div className="flex -space-x-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full border-4 border-white flex items-center justify-center text-white font-bold">
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="text-2xl font-bold">50,000+</div>
              <div className="text-muted-foreground">Active investors earning daily</div>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="text-lg px-12 py-6 bg-gradient-to-r from-secondary to-primary hover:from-secondary/90 hover:to-primary/90 shadow-xl animate-pulse"
            onClick={onGetStarted}
          >
            Get Started Now - It's Free!
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            No setup fees • No monthly charges • Start with any amount
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 text-center text-sm text-muted-foreground border-t">
        <p>© 2024 Investment Platform. All investments carry risk. Past performance doesn't guarantee future results.</p>
      </div>
    </div>
  );
}