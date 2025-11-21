import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Banknote } from "lucide-react";

const tellerQueue = [
  { token: "A023", customer: "Kiran Rao", service: "Cash Deposit", amount: "₹3,50,000", status: "In Progress" },
  { token: "A024", customer: "Metro Fashions", service: "Cash Withdrawal", amount: "₹12,00,000", status: "Queued" },
  { token: "A025", customer: "Pooja Industries", service: "Demand Draft", amount: "₹4,20,000", status: "Queued" },
];

const Teller = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Branch Operations</p>
            <h1 className="text-3xl font-bold text-foreground">Teller Console</h1>
            <p className="text-muted-foreground mt-2">
              Digital-first cash management for front-office teams.
            </p>
          </div>
          <Button className="gap-2">
            <Banknote className="h-4 w-4" /> Close Day
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Cash On Hand", value: "₹2.8 Cr", subtitle: "Vault + Counter" },
            { title: "Tokens Served", value: "47", subtitle: "Across counters" },
            { title: "Avg. Wait Time", value: "3m 15s", subtitle: "Customer experience" },
          ].map((stat) => (
            <Card key={stat.title}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <CardDescription>{stat.subtitle}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border border-border/70 shadow-lg shadow-primary/10">
          <CardHeader>
            <CardTitle>Live Token Queue</CardTitle>
            <CardDescription>Prioritized by service type &amp; customer tier</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tellerQueue.map((item) => (
                  <TableRow key={item.token}>
                    <TableCell>{item.token}</TableCell>
                    <TableCell className="font-semibold">{item.customer}</TableCell>
                    <TableCell>{item.service}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>
                      <Badge variant={item.status === "In Progress" ? "default" : "secondary"}>
                        {item.status}
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

export default Teller;

