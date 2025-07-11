import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '@supabase/auth-helpers-react';

const DepositPage = () => {
  const user = useUser();
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [status, setStatus] = useState('');

  const handleSubmit = async () => {
    if (!user) {
      setStatus("You must be logged in to deposit.");
      return;
    }

    setStatus("Submitting deposit...");

    const { data, error } = await supabase.from('deposits').insert([{
      user_id: user.id,
      amount,
      network,
      screenshot_url: null, // we'll update this later if needed
      status: 'pending',
      created_at: new Date()
    }]);

    if (error) {
      setStatus("❌ Failed to submit deposit.");
    } else {
      setStatus("✅ Deposit submitted and pending approval.");
    }
  };

  return (
    <div style={{ padding: '2rem', color: '#fff', background: '#111', minHeight: '100vh' }}>
      <h2>📥 Deposit Funds via Binance</h2>
      <p>Your funds will be approved by admin after verification.</p>

      <label>Amount (USDT):</label><br />
      <input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="e.g. 50"
      /><br /><br />

      <label>Choose Binance Network:</label><br />
      <select value={network} onChange={(e) => setNetwork(e.target.value)}>
        <option value="">-- Select Network --</option>
        <option value="BEP20">BEP20</option>
        <option value="TRC20">TRC20</option>
        <option value="ERC20">ERC20</option>
      </select><br /><br />

      <label>Screenshot (optional):</label><br />
      <input
        type="file"
        onChange={(e) => setScreenshot(e.target.files[0])}
        accept="image/*"
      /><br /><br />

      <button onClick={handleSubmit}>Submit Deposit</button>
      <p style={{ marginTop: '1rem', color: '#00ff99' }}>{status}</p>
    </div>
  );
};

export default DepositPage;
