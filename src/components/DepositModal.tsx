import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Building, Smartphone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface DepositModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function DepositModal({ open, onOpenChange, onSuccess }: DepositModalProps) {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const paymentMethods = [
    {
      id: 'bank_transfer',
      name: 'Bank Transfer',
      icon: Building,
      description: 'Transfer from your bank account'
    },
    {
      id: 'bml_card',
      name: 'BML Card',
      icon: CreditCard,
      description: 'Pay with your BML debit/credit card'
    },
    {
      id: 'mib_transfer',
      name: 'MIB Transfer',
      icon: Smartphone,
      description: 'Mobile banking transfer'
    }
  ];

  const handleDeposit = async () => {
    if (!amount || !selectedMethod || !user) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const depositAmount = parseFloat(amount);
    if (depositAmount < 10) {
      toast({
        title: "Minimum Deposit",
        description: "Minimum deposit amount is $10",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Call the database function to update wallet balance
      const { error } = await supabase.rpc('update_wallet_balance', {
        p_user_id: user.id,
        p_amount: depositAmount,
        p_transaction_type: 'deposit',
        p_description: `Deposit via ${paymentMethods.find(m => m.id === selectedMethod)?.name}`
      });

      if (error) throw error;

      toast({
        title: "Deposit Successful!",
        description: `$${depositAmount} has been added to your wallet`,
      });

      setAmount('');
      setSelectedMethod('');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Deposit error:', error);
      toast({
        title: "Deposit Failed",
        description: "There was an error processing your deposit",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Deposit Funds</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount (min $10)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="10"
              step="0.01"
            />
          </div>

          {/* Payment Methods */}
          <div className="space-y-2">
            <Label>Select Payment Method</Label>
            <div className="grid gap-3">
              {paymentMethods.map((method) => (
                <Card 
                  key={method.id}
                  className={`cursor-pointer transition-colors ${
                    selectedMethod === method.id 
                      ? 'border-primary bg-primary/5' 
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <method.icon className="w-6 h-6 text-primary" />
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {method.description}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1"
              onClick={handleDeposit}
              disabled={loading || !amount || !selectedMethod}
            >
              {loading ? 'Processing...' : 'Confirm Deposit'}
            </Button>
          </div>

          {/* Disclaimer */}
          <div className="text-xs text-muted-foreground text-center">
            This is a demo transaction. Funds will be added to your wallet instantly.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}