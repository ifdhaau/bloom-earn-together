import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Building2, Smartphone } from 'lucide-react';

export function Recharge() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const paymentMethods = [
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Building2,
      description: 'Direct bank transfer (1-2 business days)'
    },
    {
      id: 'card',
      name: 'BML Card',
      icon: CreditCard,
      description: 'Bank of Maldives debit/credit card'
    },
    {
      id: 'mobile',
      name: 'MIB Transfer',
      icon: Smartphone,
      description: 'Maldives Islamic Bank mobile transfer'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !selectedMethod || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please enter a valid amount and select a payment method",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Get current earnings or create new record
      const { data: currentEarnings, error: fetchError } = await supabase
        .from('Earnings')
        .select('total')
        .eq('user_id', user?.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      const newTotal = (currentEarnings?.total || 0) + parseFloat(amount);

      if (currentEarnings) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('Earnings')
          .update({ total: newTotal })
          .eq('user_id', user?.id);

        if (updateError) throw updateError;
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('Earnings')
          .insert({
            user_id: user?.id,
            total: parseFloat(amount)
          });

        if (insertError) throw insertError;
      }

      toast({
        title: "Success!",
        description: `$${amount} has been added to your earnings`,
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error processing recharge:', error);
      toast({
        title: "Error",
        description: "Failed to process recharge. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

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
              <CardTitle className="text-2xl text-white">Recharge Account</CardTitle>
              <CardDescription className="text-gray-300">
                Add funds to start earning daily returns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Amount Input */}
                <div>
                  <Label htmlFor="amount" className="text-white">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-400 text-lg font-bold"
                    required
                  />
                </div>

                {/* Payment Methods */}
                <div>
                  <Label className="text-white mb-4 block">Choose Payment Method</Label>
                  <div className="space-y-3">
                    {paymentMethods.map((method) => {
                      const IconComponent = method.icon;
                      return (
                        <div
                          key={method.id}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedMethod === method.id
                              ? 'border-blue-400 bg-blue-400/20'
                              : 'border-white/20 bg-white/10 hover:bg-white/20'
                          }`}
                          onClick={() => setSelectedMethod(method.id)}
                        >
                          <div className="flex items-center">
                            <IconComponent className="w-6 h-6 text-white mr-3" />
                            <div>
                              <p className="text-white font-semibold">{method.name}</p>
                              <p className="text-gray-400 text-sm">{method.description}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 text-lg"
                  disabled={loading || !amount || !selectedMethod}
                >
                  {loading ? "Processing..." : `Recharge $${amount || '0.00'}`}
                </Button>

                {/* Disclaimer */}
                <div className="text-xs text-gray-400 text-center space-y-1">
                  <p>🔒 This is a simulation for demonstration purposes</p>
                  <p>No real money will be charged to your account</p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}