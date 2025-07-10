-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  referral_code TEXT UNIQUE NOT NULL,
  referred_by_code TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deposits table
CREATE TABLE public.deposits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL CHECK (amount > 0),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  payment_method TEXT CHECK (payment_method IN ('mobile_wallet', 'bank_transfer')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reinvestments table
CREATE TABLE public.reinvestments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_amount DECIMAL(12,2) NOT NULL,
  bonus_percentage DECIMAL(5,2) DEFAULT 10.00,
  bonus_amount DECIMAL(12,2) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  maturity_date TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create referrals table
CREATE TABLE public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  level INTEGER DEFAULT 1 CHECK (level IN (1, 2)),
  earnings DECIMAL(12,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(referrer_id, referred_id)
);

-- Create referral_earnings table for tracking earnings
CREATE TABLE public.referral_earnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  from_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deposit_id UUID REFERENCES public.deposits(id) ON DELETE CASCADE,
  amount DECIMAL(12,2) NOT NULL,
  level INTEGER NOT NULL CHECK (level IN (1, 2)),
  percentage DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create platform_settings table for admin configuration
CREATE TABLE public.platform_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default settings
INSERT INTO public.platform_settings (setting_key, setting_value) VALUES
('referral_level_1_percentage', '5.00'),
('referral_level_2_percentage', '2.00'),
('reinvestment_bonus_percentage', '10.00'),
('early_withdrawal_penalty', '15.00');

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reinvestments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_earnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- RLS Policies for deposits
CREATE POLICY "Users can view their own deposits" ON public.deposits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own deposits" ON public.deposits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all deposits" ON public.deposits
  FOR SELECT USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admins can update all deposits" ON public.deposits
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

-- RLS Policies for reinvestments
CREATE POLICY "Users can view their own reinvestments" ON public.reinvestments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reinvestments" ON public.reinvestments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all reinvestments" ON public.reinvestments
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- RLS Policies for referrals
CREATE POLICY "Users can view their referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "System can create referrals" ON public.referrals
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all referrals" ON public.referrals
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- RLS Policies for referral_earnings
CREATE POLICY "Users can view their own referral earnings" ON public.referral_earnings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can create referral earnings" ON public.referral_earnings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all referral earnings" ON public.referral_earnings
  FOR SELECT USING (public.get_current_user_role() = 'admin');

-- RLS Policies for platform_settings
CREATE POLICY "Anyone can view platform settings" ON public.platform_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can update platform settings" ON public.platform_settings
  FOR UPDATE USING (public.get_current_user_role() = 'admin');

-- Create function to generate unique referral codes
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    code := upper(substr(md5(random()::text), 1, 8));
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = code) INTO exists_check;
    EXIT WHEN NOT exists_check;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger function for new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  referrer_user_id UUID;
  level_1_percentage DECIMAL(5,2);
  level_2_percentage DECIMAL(5,2);
BEGIN
  -- Generate referral code and insert profile
  INSERT INTO public.profiles (user_id, display_name, referral_code, referred_by_code)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    public.generate_referral_code(),
    NEW.raw_user_meta_data->>'referral_code'
  );
  
  -- Handle referral relationships if user was referred
  IF NEW.raw_user_meta_data->>'referral_code' IS NOT NULL THEN
    -- Find referrer
    SELECT user_id INTO referrer_user_id 
    FROM public.profiles 
    WHERE referral_code = NEW.raw_user_meta_data->>'referral_code';
    
    IF referrer_user_id IS NOT NULL THEN
      -- Create level 1 referral
      INSERT INTO public.referrals (referrer_id, referred_id, level)
      VALUES (referrer_user_id, NEW.id, 1);
      
      -- Create level 2 referral (find referrer's referrer)
      INSERT INTO public.referrals (referrer_id, referred_id, level)
      SELECT r.referrer_id, NEW.id, 2
      FROM public.referrals r
      WHERE r.referred_id = referrer_user_id AND r.level = 1
      LIMIT 1;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create function to calculate referral earnings on deposit approval
CREATE OR REPLACE FUNCTION public.calculate_referral_earnings()
RETURNS TRIGGER AS $$
DECLARE
  level_1_percentage DECIMAL(5,2);
  level_2_percentage DECIMAL(5,2);
  referral_record RECORD;
BEGIN
  -- Only calculate earnings when deposit is approved
  IF OLD.status != 'approved' AND NEW.status = 'approved' THEN
    
    -- Get current referral percentages
    SELECT setting_value::DECIMAL INTO level_1_percentage 
    FROM public.platform_settings WHERE setting_key = 'referral_level_1_percentage';
    
    SELECT setting_value::DECIMAL INTO level_2_percentage 
    FROM public.platform_settings WHERE setting_key = 'referral_level_2_percentage';
    
    -- Calculate level 1 referral earnings
    FOR referral_record IN 
      SELECT referrer_id FROM public.referrals 
      WHERE referred_id = NEW.user_id AND level = 1
    LOOP
      INSERT INTO public.referral_earnings (user_id, from_user_id, deposit_id, amount, level, percentage)
      VALUES (
        referral_record.referrer_id,
        NEW.user_id,
        NEW.id,
        NEW.amount * (level_1_percentage / 100),
        1,
        level_1_percentage
      );
    END LOOP;
    
    -- Calculate level 2 referral earnings
    FOR referral_record IN 
      SELECT referrer_id FROM public.referrals 
      WHERE referred_id = NEW.user_id AND level = 2
    LOOP
      INSERT INTO public.referral_earnings (user_id, from_user_id, deposit_id, amount, level, percentage)
      VALUES (
        referral_record.referrer_id,
        NEW.user_id,
        NEW.id,
        NEW.amount * (level_2_percentage / 100),
        2,
        level_2_percentage
      );
    END LOOP;
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for deposit approval
CREATE TRIGGER on_deposit_approved
  AFTER UPDATE ON public.deposits
  FOR EACH ROW EXECUTE PROCEDURE public.calculate_referral_earnings();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_platform_settings_updated_at
  BEFORE UPDATE ON public.platform_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();