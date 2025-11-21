import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Shield, TimerReset } from "lucide-react";

const auditEvents = [
  { id: "AUD-9001", actor: "Amit Verma", action: "Unlocked user staff.premium@cbs.in", module: "User Management", time: "10 mins ago", severity: "Info" },
  { id: "AUD-9002", actor: "CBS Super Administrator", action: "Updated payment rail configuration", module: "System Settings", time: "42 mins ago", severity: "Critical" },
  { id: "AUD-9003", actor: "Prisha Kulkarni", action: "Approved high value RTGS", module: "Approvals", time: "1 hr ago", severity: "Info" },
];

const AuditLogs = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Oversight</p>
            <h1 className="text-3xl font-bold text-foreground">Audit &amp; Traceability</h1>
            <p className="text-muted-foreground mt-2">
              Immutable log of privileged actions with time, actor, and context.
            </p>
          </div>
          <Badge variant="outline" className="gap-2">
            <Shield className="h-4 w-4" /> Tamper-proof ledger
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Events today", value: "132" },
            { title: "Critical alerts", value: "02" },
            { title: "Exports", value: "05" },
          ].map((stat) => (
            <Card key={stat.title}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">Rolling 24 hours</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border border-border/70 shadow-lg shadow-primary/10">
          <CardHeader>
            <CardTitle>Recent Events</CardTitle>
            <CardDescription>Mirrored to SIEM every 15 minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event ID</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Severity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {auditEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-semibold">{event.id}</TableCell>
                    <TableCell>{event.actor}</TableCell>
                    <TableCell>{event.action}</TableCell>
                    <TableCell>{event.module}</TableCell>
                    <TableCell>{event.time}</TableCell>
                    <TableCell>
                      <Badge variant={event.severity === "Critical" ? "destructive" : "secondary"}>
                        {event.severity}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4 flex items-center justify-between rounded-lg border border-dashed border-muted p-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <TimerReset className="h-4 w-4 text-primary" />
                Auto retention: 7 years
              </div>
              <Badge variant="outline">Download CSV</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default AuditLogs;

