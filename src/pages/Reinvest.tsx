import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, TrendingUp } from 'lucide-react';

export function Reinvest() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchEarnings();
  }, [user]);

  const fetchEarnings = async () => {
    try {
      const { data, error } = await supabase
        .from('Earnings')
        .select('total')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching earnings:', error);
      } else {
        setEarnings(data?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReinvest = async () => {
    if (earnings <= 0) {
      toast({
        title: "Error",
        description: "You need earnings to reinvest",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);

    try {
      // Add reinvestment record
      const { error: insertError } = await supabase
        .from('Reinvestments')
        .insert({
          user_id: user?.id,
          amount: earnings,
          created_at: new Date().toISOString()
        });

      if (insertError) throw insertError;

      // Reset earnings to 0
      const { error: updateError } = await supabase
        .from('Earnings')
        .update({ total: 0 })
        .eq('user_id', user?.id);

      if (updateError) throw updateError;

      toast({
        title: "Success!",
        description: `$${earnings.toFixed(2)} has been reinvested successfully`,
      });

      setEarnings(0);
      
      // Navigate back to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Error processing reinvestment:', error);
      toast({
        title: "Error",
        description: "Failed to process reinvestment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your earnings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-white">Reinvest Earnings</CardTitle>
              <CardDescription className="text-gray-300">
                Compound your returns by reinvesting your current earnings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Earnings Display */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-6 border border-green-400/30">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="w-8 h-8 text-green-400" />
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-sm mb-2">Available Earnings</p>
                  <p className="text-4xl font-bold text-white">${earnings.toFixed(2)}</p>
                </div>
              </div>

              {/* Reinvestment Info */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <h3 className="text-white font-semibold mb-2">How Reinvestment Works:</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Your current earnings will be added to your investment portfolio</li>
                  <li>• This increases your daily earning potential</li>
                  <li>• Your earnings balance will reset to $0</li>
                  <li>• You'll start earning on the reinvested amount immediately</li>
                </ul>
              </div>

              {/* Action Button */}
              {earnings > 0 ? (
                <Button 
                  onClick={handleReinvest}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 text-lg"
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Reinvest ${earnings.toFixed(2)}
                    </>
                  )}
                </Button>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No earnings available to reinvest</p>
                  <Button 
                    onClick={() => navigate('/recharge')}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Go to Recharge
                  </Button>
                </div>
              )}

              {/* Disclaimer */}
              <div className="text-xs text-gray-400 text-center">
                <p>💡 Reinvesting compounds your returns over time</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}