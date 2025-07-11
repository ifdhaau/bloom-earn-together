-- Add wallet_balance field to profiles table
ALTER TABLE public.profiles ADD COLUMN wallet_balance DECIMAL(10,2) DEFAULT 0.00 NOT NULL;

-- Add transaction_type enum for better tracking
CREATE TYPE transaction_type AS ENUM ('deposit', 'withdrawal', 'reinvestment', 'referral_earning');

-- Create wallet_transactions table to track all wallet movements
CREATE TABLE public.wallet_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_type transaction_type NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on wallet_transactions
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for wallet_transactions
CREATE POLICY "Users can view their own wallet transactions" 
ON public.wallet_transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "System can create wallet transactions" 
ON public.wallet_transactions 
FOR INSERT 
WITH CHECK (true);

-- Create function to update wallet balance
CREATE OR REPLACE FUNCTION public.update_wallet_balance(
  p_user_id UUID,
  p_amount DECIMAL(10,2),
  p_transaction_type transaction_type,
  p_description TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update wallet balance
  UPDATE public.profiles 
  SET wallet_balance = wallet_balance + p_amount,
      updated_at = now()
  WHERE user_id = p_user_id;
  
  -- Record transaction
  INSERT INTO public.wallet_transactions (user_id, transaction_type, amount, description)
  VALUES (p_user_id, p_transaction_type, p_amount, p_description);
  
  RETURN TRUE;
EXCEPTION
  WHEN OTHERS THEN
    RETURN FALSE;
END;
$$;