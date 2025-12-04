import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { CreditCard, Sparkles } from "lucide-react";
import { get, post } from '@/services/api.service';
import { API_ENDPOINTS } from '@/config/api.config';

type AccountType = "Savings" | "Current" | "NRI" | "Corporate";

interface AccountRecord {
  id: number;
  accountNo: string;
  holder?: string;
  type: AccountType;
  balance?: string;
  status: "active" | "closed" | "pending";
  branch_id?: number;
}

// removed static master accounts; will load from backend

const Accounts = () => {
  const { user } = useAuth();
  const isStaff = user?.role === "staff";
  const [newAccount, setNewAccount] = useState({ customerId: '', type: "Savings" as AccountType });
  const [accounts, setAccounts] = useState<AccountRecord[]>([]);

  useEffect(() => {
    const load = async () => {
      const res = await get<any[]>(API_ENDPOINTS.ACCOUNTS.LIST);
      if (res.success) {
        const mapped: AccountRecord[] = (res.data || []).map((a: any) => ({
          id: a.id,
          accountNo: a.account_number,
          type: a.account_type,
          balance: a.balance,
          status: a.status,
          branch_id: a.branch_id,
        }));
        setAccounts(mapped);
      }
    };
    load();
  }, []);

  const visibleAccounts = useMemo(() => {
    if (!user) return [];
    if (user.branchId) return accounts.filter((acc) => String(acc.branch_id) === String(user.branchId));
    return accounts;
  }, [accounts, user]);

  const stats = useMemo(() => {
    const total = visibleAccounts.length;
    return [
      { title: "Accounts", value: String(total), subtitle: "Total accounts in view" },
    ];
  }, [visibleAccounts]);

  const handleOpenAccount = async () => {
    if (!newAccount.customerId) return;
    const res = await post<any>(API_ENDPOINTS.ACCOUNTS.CREATE, { customer_id: Number(newAccount.customerId), account_type: newAccount.type });
    if (res.success && res.data) {
      setAccounts((prev) => [{
        id: res.data.id,
        accountNo: res.data.account_number,
        type: res.data.account_type,
        balance: res.data.balance,
        status: res.data.status,
        branch_id: res.data.branch_id,
      }, ...prev]);
      setNewAccount({ customerId: '', type: 'Savings' });
    }
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
                <Label htmlFor="customerId">Customer ID</Label>
                <Input
                  id="customerId"
                  type="number"
                  placeholder="123"
                  value={newAccount.customerId}
                  onChange={(event) => setNewAccount((prev) => ({ ...prev, customerId: event.target.value }))}
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
                {/* initial deposit input removed; handled by transaction service */}
              </div>
              <Button
                className="w-full"
                disabled={!newAccount.customerId}
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

