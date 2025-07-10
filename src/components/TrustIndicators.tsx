import { Shield, Lock, CheckCircle, Award } from "lucide-react";

export function TrustBadge() {
  return (
    <div className="trust-badge">
      <Shield className="w-4 h-4" />
      <span>SEC Compliant</span>
    </div>
  );
}

export function SecurityIndicator() {
  return (
    <div className="security-indicator">
      <Lock className="w-4 h-4" />
      <span>Bank-level encryption</span>
    </div>
  );
}

export function TrustMetrics() {
  const metrics = [
    { icon: CheckCircle, label: "99.9% Uptime", value: "Reliable" },
    { icon: Shield, label: "Insured Deposits", value: "$250K FDIC" },
    { icon: Award, label: "5-Star Rating", value: "Trustpilot" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
      {metrics.map((metric, index) => (
        <div key={index} className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
          <metric.icon className="w-5 h-5 text-success" />
          <div>
            <p className="text-sm font-medium">{metric.label}</p>
            <p className="text-xs text-muted-foreground">{metric.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}