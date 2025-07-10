import { AlertTriangle, Shield, FileText, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export function LegalDisclaimer() {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Badge variant="secondary" className="px-4 py-2">
            <Shield className="w-4 h-4 mr-2" />
            Legal Disclosure & Terms
          </Badge>
        </div>
        <h1 className="text-3xl font-bold">Important Legal Information</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Please read and understand these important disclosures before participating in our community earnings platform.
        </p>
      </div>

      {/* Risk Warning */}
      <Card className="border-warning bg-warning-light">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-warning-foreground">
            <AlertTriangle className="w-5 h-5" />
            Investment Risk Warning
          </CardTitle>
        </CardHeader>
        <CardContent className="text-warning-foreground">
          <p className="mb-4">
            <strong>All investments carry risk of loss.</strong> The value of your investment may go down as well as up, 
            and you may not get back the amount you originally invested.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-sm">
            <li>Past performance is not indicative of future results</li>
            <li>No guarantee of returns or principal protection</li>
            <li>Market conditions can affect investment performance</li>
            <li>Early withdrawal may result in penalties or fees</li>
          </ul>
        </CardContent>
      </Card>

      {/* Platform Terms */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Terms of Service
            </CardTitle>
            <CardDescription>
              Key terms governing your use of our platform
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Minimum Investment</h4>
              <p className="text-sm text-muted-foreground">$10 minimum deposit required to participate</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Withdrawal Terms</h4>
              <p className="text-sm text-muted-foreground">
                30-day holding period with early withdrawal fees of 5%
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Referral Program</h4>
              <p className="text-sm text-muted-foreground">
                Earn 10% of referral deposits, subject to terms and conditions
              </p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              View Full Terms
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Regulatory Compliance
            </CardTitle>
            <CardDescription>
              Our commitment to regulatory compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">SEC Registration</h4>
              <p className="text-sm text-muted-foreground">
                Platform registered under applicable securities regulations
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">FDIC Insurance</h4>
              <p className="text-sm text-muted-foreground">
                Customer deposits insured up to $250,000 per account
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">AML/KYC Compliance</h4>
              <p className="text-sm text-muted-foreground">
                Identity verification required for all participants
              </p>
            </div>
            <Button variant="outline" size="sm" className="w-full">
              <ExternalLink className="w-4 h-4 mr-2" />
              Regulatory Info
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Disclosures */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Risk Disclosures</CardTitle>
          <CardDescription>
            Important information about potential risks and limitations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold mb-3">Market Risk</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Investment returns are subject to market conditions and economic factors beyond our control. 
              Interest rates, inflation, and market volatility can all impact performance.
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3">Liquidity Risk</h4>
            <p className="text-sm text-muted-foreground mb-2">
              While we aim to process withdrawal requests promptly, there may be delays during high-volume periods. 
              Early withdrawals are subject to fees and restrictions.
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3">Platform Risk</h4>
            <p className="text-sm text-muted-foreground mb-2">
              As with any financial platform, there are risks related to technology, cybersecurity, and operational factors. 
              We maintain comprehensive insurance and security measures to mitigate these risks.
            </p>
          </div>

          <Separator />

          <div>
            <h4 className="font-semibold mb-3">Regulatory Risk</h4>
            <p className="text-sm text-muted-foreground mb-2">
              Changes in financial regulations could impact our operations and your investments. 
              We monitor regulatory developments closely and maintain compliance with all applicable laws.
            </p>
          </div>

          <Separator />

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              <strong>Important:</strong> This platform is not suitable for all investors. 
              Consider your financial situation, investment objectives, and risk tolerance before investing. 
              Consult with a financial advisor if you have questions about the suitability of this investment.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Questions or Concerns?</CardTitle>
          <CardDescription>
            Our compliance and support teams are here to help
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Legal Department</h4>
              <p className="text-sm text-muted-foreground">legal@communityearnings.com</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Compliance Office</h4>
              <p className="text-sm text-muted-foreground">compliance@communityearnings.com</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">Customer Support</h4>
              <p className="text-sm text-muted-foreground">support@communityearnings.com</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground">
        <p>Last updated: January 2024 | Document version 2.1</p>
        <p className="mt-2">
          © 2024 Community Earnings Platform. All rights reserved. 
          Licensed and regulated financial services provider.
        </p>
      </div>
    </div>
  );
}