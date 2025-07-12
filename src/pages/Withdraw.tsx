import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, AlertCircle } from 'lucide-react';

export function Withdraw() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState(0);
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const withdrawAmount = parseFloat(amount);
    
    if (!amount || !walletAddress || withdrawAmount <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields with valid values",
        variant: "destructive"
      });
      return;
    }

    if (withdrawAmount > earnings) {
      toast({
        title: "Error",
        description: "Withdrawal amount cannot exceed your available earnings",
        variant: "destructive"
      });
      return;
    }

    if (walletAddress.length < 20) {
      toast({
        title: "Error",
        description: "Please enter a valid Binance wallet address",
        variant: "destructive"
      });
      return;
    }

    setSubmitting(true);

    try {
      // In a real app, you would create a withdrawal request record
      // For now, we'll just show a success message
      toast({
        title: "Withdrawal Request Submitted!",
        description: `Your request to withdraw $${withdrawAmount.toFixed(2)} has been submitted for review. You'll receive confirmation within 24 hours.`,
      });

      // Reset form
      setAmount('');
      setWalletAddress('');
      setNotes('');
      
      // Navigate back to dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error: any) {
      console.error('Error submitting withdrawal:', error);
      toast({
        title: "Error",
        description: "Failed to submit withdrawal request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading withdrawal form...</p>
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
              <CardTitle className="text-2xl text-white">Withdraw Earnings</CardTitle>
              <CardDescription className="text-gray-300">
                Request a withdrawal to your Binance wallet
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Available Balance */}
              <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-400/30 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <Wallet className="w-6 h-6 text-green-400 mr-2" />
                  <span className="text-gray-300">Available Balance</span>
                </div>
                <p className="text-2xl font-bold text-white text-center">${earnings.toFixed(2)}</p>
              </div>

              {earnings <= 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <p className="text-gray-400 mb-4">No earnings available for withdrawal</p>
                  <Button 
                    onClick={() => navigate('/recharge')}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    Go to Recharge
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Amount Input */}
                  <div>
                    <Label htmlFor="amount" className="text-white">
                      Withdrawal Amount (USD)
                    </Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      max={earnings}
                      step="0.01"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="bg-white/20 border-white/30 text-white placeholder:text-gray-400"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Maximum: ${earnings.toFixed(2)}
                    </p>
                  </div>

                  {/* Wallet Address */}
                  <div>
                    <Label htmlFor="wallet" className="text-white">
                      Binance Wallet Address *
                    </Label>
                    <Input
                      id="wallet"
                      type="text"
                      value={walletAddress}
                      onChange={(e) => setWalletAddress(e.target.value)}
                      placeholder="Enter your Binance wallet address"
                      className="bg-white/20 border-white/30 text-white placeholder:text-gray-400"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-1">
                      Make sure this address is correct - withdrawals cannot be reversed
                    </p>
                  </div>

                  {/* Optional Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-white">
                      Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any additional information..."
                      className="bg-white/20 border-white/30 text-white placeholder:text-gray-400"
                      rows={3}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 text-lg"
                    disabled={submitting || !amount || !walletAddress}
                  >
                    {submitting ? "Submitting Request..." : `Withdraw $${amount || '0.00'}`}
                  </Button>

                  {/* Withdrawal Info */}
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <h3 className="text-white font-semibold mb-2 text-sm">Withdrawal Information:</h3>
                    <ul className="text-gray-400 text-xs space-y-1">
                      <li>• Processing time: 24-48 hours</li>
                      <li>• Minimum withdrawal: $1.00</li>
                      <li>• Network fees may apply</li>
                      <li>• Withdrawals are processed manually for security</li>
                    </ul>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}