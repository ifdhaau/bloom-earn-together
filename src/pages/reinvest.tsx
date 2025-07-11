import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { useUser } from "@supabase/auth-helpers-react";

export default function Reinvest() {
  const user = useUser();
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      fetchEarnings();
    }
  }, [user]);

  const fetchEarnings = async () => {
    const { data, error } = await supabase
      .from("earnings")
      .select("total")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setEarnings(data.total || 0);
    } else {
      setEarnings(0); // fallback
    }
  };

  const handleReinvest = async () => {
    if (!user || earnings <= 0) return;
    setLoading(true);
    setMessage("");

    const bonus = earnings * 0.10; // 10% bonus
    const total = earnings + bonus;

    // Save to reinvestments table
    const { error: insertError } = await supabase.from("reinvestments").insert([
      {
        user_id: user.id,
        amount: earnings,
        bonus,
        total,
      },
    ]);

    // Reset earnings table
    const { error: updateError } = await supabase
      .from("earnings")
      .update({ total: 0 })
      .eq("user_id", user.id);

    if (!insertError && !updateError) {
      setMessage("Reinvested successfully! 🎉");
      setEarnings(0);
    } else {
      setMessage("Something went wrong 😢");
    }

    setLoading(false);
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Reinvest Your Earnings</h1>
      <p>Current Earnings: <strong>${earnings.toFixed(2)}</strong></p>

      <button
        onClick={handleReinvest}
        disabled={loading || earnings <= 0}
        style={{ padding: "0.5rem 1rem", marginTop: "1rem" }}
      >
        {loading ? "Reinvesting..." : "Reinvest & Earn Bonus"}
      </button>

      {message && <p style={{ marginTop: "1rem", color: "green" }}>{message}</p>}
    </div>
  );
}
