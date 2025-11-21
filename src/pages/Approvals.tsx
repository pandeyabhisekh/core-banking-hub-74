import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock3, UserCheck } from "lucide-react";

const approvals = [
  { id: "APR-4012", request: "Account Opening", by: "Neha Singh", branch: "South Extension", sla: "14 mins", status: "Waiting" },
  { id: "APR-4013", request: "High Value Transfer", by: "Dev Sharma", branch: "South Extension", sla: "5 mins", status: "Escalated" },
  { id: "APR-4014", request: "Credit Limit Enhancement", by: "Kunal Rao", branch: "Connaught Place", sla: "26 mins", status: "Waiting" },
];

const Approvals = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Maker-Checker</p>
            <h1 className="text-3xl font-bold text-foreground">Approval Workbench</h1>
            <p className="text-muted-foreground mt-2">
              Prioritize exception handling across branches with live SLAs.
            </p>
          </div>
          <Button className="gap-2">
            <UserCheck className="h-4 w-4" /> Assign Checker
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Pending", value: "08", subtitle: "Within SLA", icon: Clock3 },
            { title: "Breached", value: "02", subtitle: "Need immediate action", icon: CheckCircle },
            { title: "Processed today", value: "27", subtitle: "Across all clusters", icon: UserCheck },
          ].map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border border-border/70 shadow-lg shadow-primary/10">
          <CardHeader>
            <CardTitle>Approval Queue</CardTitle>
            <CardDescription>Ordered by SLA priority</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Request Type</TableHead>
                  <TableHead>Maker</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>SLA</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {approvals.map((approval) => (
                  <TableRow key={approval.id}>
                    <TableCell className="font-semibold">{approval.id}</TableCell>
                    <TableCell>{approval.request}</TableCell>
                    <TableCell>{approval.by}</TableCell>
                    <TableCell>{approval.branch}</TableCell>
                    <TableCell>{approval.sla}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={approval.status === "Escalated" ? "destructive" : "secondary"}>
                        {approval.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Approvals;

