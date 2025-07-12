// src/pages/Recharge.tsx
import React, { useState } from 'react'
import { supabase } from '../supabaseClient'

const Recharge: React.FC = () => {
  const [amount, setAmount] = useState('')
  const [status, setStatus] = useState('')

  const handleRecharge = async () => {
    setStatus('Processing...')

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      setStatus('User not found.')
      return
    }

    const { error } = await supabase.from('earnings').insert([
      {
        user_id: user.id,
        amount: parseFloat(amount),
        type: 'recharge',
        created_at: new Date().toISOString(),
      },
    ])

    if (error) {
      console.error(error)
      setStatus('Recharge failed.')
    } else {
      setStatus('Recharge successful.')
      setAmount('')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Recharge</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
      <button onClick={handleRecharge}>Submit</button>
      <p>{status}</p>
    </div>
  )
}

export default Recharge