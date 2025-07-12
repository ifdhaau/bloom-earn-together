import { useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "../supabaseClient";

const Recharge = () => {
  const { user } = useUser();
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleRecharge = async () => {
    if (!user) {
      setMessage("User not logged in.");
      return;
    }

    if (!amount || isNaN(parseFloat(amount))) {
      setMessage("Please enter a valid amount.");
      return;
    }

    const { data, error } = await supabase.from("recharges").insert([
      {
        user_id: user.id,
        amount: parseFloat(amount),
      },
    ]);

    if (error) {
      console.error("Recharge error:", error.message);
      setMessage("Recharge failed: " + error.message);
    } else {
      setMessage("Recharge successful!");
      setAmount(""); // clear input
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Recharge</h2>
      <input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        style={{ padding: "10px", marginBottom: "10px", width: "100%" }}
      />
      <br />
      <button onClick={handleRecharge} style={{ padding: "10px 20px" }}>
        Submit Recharge
      </button>
      {message && (
        <p style={{ marginTop: "15px", color: message.includes("failed") ? "red" : "green" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default Recharge;
