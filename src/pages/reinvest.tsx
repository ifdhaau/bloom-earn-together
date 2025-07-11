import { useEffect, useState } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "../supabaseClient";

export default function Reinvest() {
  const user = useUser();
  const [earnings, setEarnings] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("Earnings")
        .select("total")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching earnings:", error);
      } else {
        setEarnings(data.total || 0);
      }
      setLoading(false);
    };

    fetchEarnings();
  }, [user]);

  const handleReinvest = async () => {
    if (!user) return;

    const { error: insertError } = await supabase.from("Reinvestments").insert({
      user_id: user.id,
      amount: earnings,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Error reinvesting:", insertError);
      return;
    }

    // Reset earnings to 0
    const { error: updateError } = await supabase
      .from("Earnings")
      .update({ total: 0 })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error updating earnings:", updateError);
    } else {
      setEarnings(0);
    }
  };

  if (loading) return <p>Loading earnings...</p>;
  if (!user) return <p>Please log in to view your earnings.</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>💸 Reinvest Your Earnings</h1>
      <p>Total Earnings: <strong>${earnings}</strong></p>
      <button onClick={handleReinvest} disabled={earnings <= 0}>
        Reinvest All
      </button>
    </div>
  );
}
