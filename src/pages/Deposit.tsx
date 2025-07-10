import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Wallet, CreditCard, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function Deposit() {
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount || !paymentMethod) return;

    setIsLoading(true);
    
    const { error } = await supabase
      .from('deposits')
      .insert({
        user_id: user.id,
        amount: parseFloat(amount),
        payment_method: paymentMethod
      });

    if (error) {
      toast({
        title: 'Deposit Failed',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Deposit Submitted',
        description: 'Your deposit request has been submitted for approval.'
      });
      navigate('/');
    }
    
    setIsLoading(false);
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5 p-4">
      <div className="max-w-md mx-auto space-y-6 pt-8">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate('/')}
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Make a Deposit</h1>
        </div>

        {/* Deposit Form */}
        <Card>
          <CardHeader>
            <CardTitle>Deposit Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="10"
                  step="0.01"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Minimum deposit: $10.00
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mobile_wallet">
                      <div className="flex items-center space-x-2">
                        <Wallet className="h-4 w-4" />
                        <span>Mobile Wallet</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="bank_transfer">
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Bank Transfer</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This is a demo. No real payment will be processed. Your deposit will be marked as pending and require admin approval.
                </AlertDescription>
              </Alert>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading || !amount || !paymentMethod}
              >
                {isLoading ? 'Submitting...' : `Submit Deposit ($${amount || '0.00'})`}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Benefits */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Deposit Benefits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <p className="text-sm">Earn referral bonuses when others join</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <p className="text-sm">Reinvestment bonuses for compound growth</p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <p className="text-sm">Tiered rewards based on participation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}