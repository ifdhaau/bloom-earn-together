import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const DepositPage = () => {
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState('');
  const [screenshot, setScreenshot] = useState(null);
  const [userId, setUserId] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setUserId(user.id);
    };
    fetchUser();
  }, []);

  const handleSubmit = async () => {
    if (!userId) {
      setStatus("⚠️ You must be logged in to deposit.");
      return;
    }

    const { data, error } = await supabase.from('deposits').insert([{
      user_id: userId,
      amount,
      network,
      screenshot_url: null,
      status: 'pending',
      created_at: new Date()
    }]);

    if (error) {
      setStatus("❌ Deposit failed.");
    } else {
      setStatus("✅ Deposit submitted for approval.");
    }
  };

  return (
    <div style={{ padding: '2rem', color: '#fff', background: '#111', minHeight: '100vh' }}>
      <h2>📥 Deposit via Binance Network</h2>

      <label>Amount (USDT):</label><br />
      <input value={amount} onChange={(e) => setAmount(e.target.value)} /><br /><br />

      <label>Network:</label><br />
      <select value={network} onChange={(e) => setNetwork(e.target.value)}>
        <option value="">-- Choose --</option>
        <option value="BEP20">BEP20</option>
        <option value="TRC20">TRC20</option>
        <option value="ERC20">ERC20</option>
      </select><br /><br />

      <label>Screenshot (optional):</label><br />
      <input type="file" onChange={(e) => setScreenshot(e.target.files[0])} /><br /><br />

      <button onClick={handleSubmit}>Submit</button>
      <p>{status}</p>
    </div>
  );
};

export default DepositPage;
