import { useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { ArrowUpRight, CreditCard, DollarSign, Shield, Sparkles } from "lucide-react";

type AccountType = "Savings" | "Current" | "NRI" | "Corporate";

interface AccountRecord {
  accountNo: string;
  holder: string;
  type: AccountType;
  balance: string;
  status: "Active" | "Dormant" | "Pending";
  assignedTo: string;
}

const masterAccounts: AccountRecord[] = [
  { accountNo: "CBS0001827", holder: "Ananya Sharma", type: "Savings", balance: "₹12,58,444", status: "Active", assignedTo: "Neha Singh" },
  { accountNo: "CBS0001828", holder: "Rajesh Kumar", type: "Current", balance: "₹8,42,120", status: "Active", assignedTo: "Neha Singh" },
  { accountNo: "CBS0001829", holder: "The Artisan Co.", type: "Corporate", balance: "₹1,82,96,000", status: "Active", assignedTo: "Dev Sharma" },
  { accountNo: "CBS0001830", holder: "Priya Patel", type: "NRI", balance: "₹32,17,500", status: "Pending", assignedTo: "Neha Singh" },
];

const Accounts = () => {
  const { user } = useAuth();
  const isStaff = user?.role === "staff";
  const [newAccount, setNewAccount] = useState({ holder: "", type: "Savings" as AccountType, deposit: "" });
  const [accounts, setAccounts] = useState<AccountRecord[]>(masterAccounts);

  const visibleAccounts = useMemo(() => {
    if (!user) return [];
    if (isStaff) {
      return accounts.filter((acc) => acc.assignedTo === user.fullName);
    }
    if (user.role === "branch_manager") {
      return accounts.filter((acc) => acc.assignedTo === "Neha Singh" || acc.assignedTo === "Dev Sharma");
    }
    return accounts;
  }, [accounts, user, isStaff]);

  const stats = useMemo(
    () => [
      {
        title: "Portfolio Balance",
        value: "₹2.35 Cr",
        subtitle: "Across assigned customers",
        icon: DollarSign,
        accent: "from-primary/20 to-primary/5",
      },
      {
        title: "Digital Conversions",
        value: "62%",
        subtitle: "Accounts sourced digitally",
        icon: ArrowUpRight,
        accent: "from-emerald-200/40 to-emerald-50",
      },
      {
        title: "Compliance Score",
        value: "99.2%",
        subtitle: "KYC & AML adherence",
        icon: Shield,
        accent: "from-indigo-200/40 to-indigo-50",
      },
    ],
    [],
  );

  const handleOpenAccount = () => {
    if (!newAccount.holder || !newAccount.deposit) return;
    const paddedIndex = (accounts.length + 1827).toString().padStart(7, "0");
    const account: AccountRecord = {
      accountNo: `CBS${paddedIndex}`,
      holder: newAccount.holder,
      type: newAccount.type,
      balance: `₹${Number(newAccount.deposit).toLocaleString("en-IN")}`,
      status: "Pending",
      assignedTo: user?.fullName ?? "Unassigned",
    };
    setAccounts((prev) => [account, ...prev]);
    setNewAccount({ holder: "", type: "Savings", deposit: "" });
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Accounts Workspace</p>
            <h1 className="text-3xl font-bold text-foreground">Portfolio Overview</h1>
            <p className="text-muted-foreground mt-2">
              {isStaff
                ? "Serve premium clients with curated account insights and quick actions."
                : "Monitor account performance across branches and cohorts."}
            </p>
          </div>
          <Badge variant="outline" className="gap-2 rounded-full border-primary/40 text-primary">
            <Sparkles className="h-4 w-4" /> Real-time core banking feed
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.title} className="overflow-hidden border border-transparent bg-gradient-to-br shadow-md shadow-primary/10">
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

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card className="border border-border/70 shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle>Accounts Under Care</CardTitle>
              <CardDescription>Dynamic view of live accounts and their health</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Holder</TableHead>
                    <TableHead>Account No.</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {visibleAccounts.map((account) => (
                    <TableRow key={account.accountNo}>
                      <TableCell className="font-semibold">{account.holder}</TableCell>
                      <TableCell>{account.accountNo}</TableCell>
                      <TableCell>{account.type}</TableCell>
                      <TableCell>{account.balance}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            "px-3",
                            account.status === "Active" && "bg-emerald-100 text-emerald-700",
                            account.status === "Pending" && "bg-amber-100 text-amber-700",
                            account.status === "Dormant" && "bg-slate-100 text-slate-700",
                          )}
                        >
                          {account.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {visibleAccounts.length === 0 && (
                <div className="rounded-lg border border-dashed border-muted p-6 text-center text-muted-foreground">
                  No accounts assigned to you yet.
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-gradient-to-br from-primary/10 via-background to-accent/10 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Quick Account Open
              </CardTitle>
              <CardDescription>Maker entry for staff (auto route to Head Dept)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="holder">Customer Name</Label>
                <Input
                  id="holder"
                  placeholder="Customer full name"
                  value={newAccount.holder}
                  onChange={(event) => setNewAccount((prev) => ({ ...prev, holder: event.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Account Type</Label>
                <select
                  id="type"
                  className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  value={newAccount.type}
                  onChange={(event) =>
                    setNewAccount((prev) => ({ ...prev, type: event.target.value as AccountType }))
                  }
                >
                  <option value="Savings">Savings</option>
                  <option value="Current">Current</option>
                  <option value="NRI">NRI</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit">Initial Deposit (₹)</Label>
                <Input
                  id="deposit"
                  type="number"
                  placeholder="250000"
                  value={newAccount.deposit}
                  onChange={(event) => setNewAccount((prev) => ({ ...prev, deposit: event.target.value }))}
                />
              </div>
              <Button
                className="w-full"
                disabled={!newAccount.holder || !newAccount.deposit}
                onClick={handleOpenAccount}
              >
                Submit for Authorization
              </Button>
              <p className="text-xs text-muted-foreground">
                Requests automatically move to branch manager and head department queue for checker
                approval.
              </p>
          </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Accounts;

