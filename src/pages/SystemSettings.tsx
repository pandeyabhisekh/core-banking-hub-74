import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

const SystemSettings = () => {
  const [rtgs, setRtgs] = useState(true);
  const [neft, setNeft] = useState(true);
  const [imps, setImps] = useState(true);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Core configurations</p>
            <h1 className="text-3xl font-bold text-foreground">System Settings</h1>
            <p className="text-muted-foreground mt-2">
              Manage platform rails, access guardrails, and compliance toggles centrally.
            </p>
          </div>
          <Button className="gap-2">
            <ShieldCheck className="h-4 w-4" /> Publish Changes
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border border-border/70 shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-primary" />
                Payment Rails
              </CardTitle>
              <CardDescription>Enable/disable channels for maintenance windows.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>RTGS</Label>
                  <p className="text-xs text-muted-foreground">High-value realtime gross settlement</p>
                </div>
                <Switch checked={rtgs} onCheckedChange={setRtgs} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>NEFT</Label>
                  <p className="text-xs text-muted-foreground">National Electronic Fund Transfer</p>
                </div>
                <Switch checked={neft} onCheckedChange={setNeft} />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label>IMPS</Label>
                  <p className="text-xs text-muted-foreground">Immediate payment service</p>
                </div>
                <Switch checked={imps} onCheckedChange={setImps} />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-gradient-to-br from-primary/10 via-background to-accent/10 shadow-md">
            <CardHeader>
              <CardTitle>Platform Snapshot</CardTitle>
              <CardDescription>Highlights of current release</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="rounded-xl border border-border/50 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-wide text-primary">Status</p>
                <p className="mt-2 text-foreground font-medium">v2.4.1 &middot; All systems operational</p>
                <p className="text-xs mt-1">Next maintenance window: Sunday 02:00 AM IST</p>
              </div>
              <div className="rounded-xl border border-border/50 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-wide text-primary">Security</p>
                <p className="mt-2 text-foreground font-medium">Last audit</p>
                <p className="text-xs mt-1">No high severity findings &middot; SOC2 controls aligned</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SystemSettings;

