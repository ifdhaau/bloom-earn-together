import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Recharge = () => {
  const user = useUser();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleRecharge = async () => {
    if (!user) {
      setMessage('You must be logged in to recharge.');
      return;
    }

    const rechargeAmount = parseFloat(amount);
    if (isNaN(rechargeAmount) || rechargeAmount <= 0) {
      setMessage('Enter a valid recharge amount.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.from('earnings').insert([
        {
          user_id: user.id,
          type: 'recharge',
          amount: rechargeAmount,
        },
      ]);

      if (error) {
        throw error;
      }

      setMessage('Recharge successful!');
      setAmount('');
    } catch (error) {
      setMessage('Failed to process recharge. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Recharge Wallet</h2>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <button onClick={handleRecharge} disabled={loading}>
        {loading ? 'Processing...' : 'Recharge'}
      </button>
      {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
    </div>
  );
};

export default Recharge;