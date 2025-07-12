import React, { useState } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';

const Deposit = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRecharge = async () => {
    if (!user) {
      alert("You're not logged in.");
      return;
    }

    const rechargeAmount = Number(amount);
    if (isNaN(rechargeAmount) || rechargeAmount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    setLoading(true);

    // 1. Check if earnings row exists
    const { data: earningsRow, error: fetchError } = await supabase
      .from('earnings')
      .select('total')
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching earnings:', fetchError.message);
      alert('Recharge failed. Try again.');
      setLoading(false);
      return;
    }

    if (!earningsRow) {
      // 2. Insert if row doesn't exist
      const { error: insertError } = await supabase
        .from('earnings')
        .insert({ user_id: user.id, total: rechargeAmount });

      if (insertError) {
        console.error('Error inserting earnings:', insertError.message);
        alert('Recharge failed.');
      } else {
        alert('Recharge successful!');
      }
    } else {
      // 3. Update total
      const newTotal = earningsRow.total + rechargeAmount;

      const { error: updateError } = await supabase
        .from('earnings')
        .update({ total: newTotal })
        .eq('user_id', user.id);

      if (updateError) {
        console.error('Error updating earnings:', updateError.message);
        alert('Recharge failed.');
      } else {
        alert('Recharge successful!');
      }
    }

    setAmount('');
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Recharge</h2>
      <input
        type="number"
        value={amount}
        placeholder="Enter amount"
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <button onClick={handleRecharge} disabled={loading}>
        {loading ? 'Processing...' : 'Recharge'}
      </button>
    </div>
  );
};

export default Deposit;
