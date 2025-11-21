import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowDownToLine, ArrowUpRight, RefreshCw } from "lucide-react";

const transactions = [
  { ref: "TXN-982341", channel: "NEFT", amount: "₹5,60,000", maker: "Neha Singh", status: "Authorized" },
  { ref: "TXN-982342", channel: "RTGS", amount: "₹18,40,000", maker: "Dev Sharma", status: "Pending" },
  { ref: "TXN-982343", channel: "IMPS", amount: "₹1,15,000", maker: "Neha Singh", status: "Completed" },
  { ref: "TXN-982344", channel: "FTS", amount: "₹12,50,000", maker: "Kunal Rao", status: "Flagged" },
];

const Transactions = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Real-time payments</p>
            <h1 className="text-3xl font-bold text-foreground">Transaction Command Center</h1>
            <p className="text-muted-foreground mt-2">
              Maker-checker controls across NEFT, RTGS, IMPS and internal transfers.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" /> Refresh
            </Button>
            <Button className="gap-2">
              <ArrowUpRight className="h-4 w-4" /> New Transaction
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Today Volume", value: "₹38.4 Cr", subtitle: "84 transactions", icon: ArrowDownToLine },
            { title: "Pending Authorizations", value: "11", subtitle: "Require checker action", icon: RefreshCw },
            { title: "Flagged Alerts", value: "02", subtitle: "High-value anomalies", icon: ArrowUpRight },
          ].map((tile) => (
            <Card key={tile.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{tile.title}</CardTitle>
                <tile.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{tile.value}</div>
                <p className="text-xs text-muted-foreground">{tile.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border border-border/70 shadow-lg shadow-primary/10">
          <CardHeader>
            <CardTitle>Live Queue</CardTitle>
            <CardDescription>Segmented by payment rails</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="neft">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="neft">NEFT</TabsTrigger>
                <TabsTrigger value="rtgs">RTGS</TabsTrigger>
                <TabsTrigger value="imps">IMPS</TabsTrigger>
                <TabsTrigger value="internal">Internal</TabsTrigger>
              </TabsList>
              <TabsContent value="neft" className="space-y-4 pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Maker</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((txn) => (
                      <TableRow key={txn.ref}>
                        <TableCell className="font-semibold">{txn.ref}</TableCell>
                        <TableCell>{txn.channel}</TableCell>
                        <TableCell>{txn.amount}</TableCell>
                        <TableCell>{txn.maker}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              txn.status === "Authorized"
                                ? "default"
                                : txn.status === "Pending"
                                  ? "secondary"
                                  : txn.status === "Flagged"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {txn.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="rtgs" className="pt-6 text-sm text-muted-foreground">
                High-value RTGS queue is stable with average processing time of 4m 12s.
              </TabsContent>
              <TabsContent value="imps" className="pt-6 text-sm text-muted-foreground">
                IMPS rail routed to CBS aggregator &ndash; 99.98% uptime.
              </TabsContent>
              <TabsContent value="internal" className="pt-6 text-sm text-muted-foreground">
                Inter-branch transfers queued in batch for end-of-day settlement.
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Transactions;

