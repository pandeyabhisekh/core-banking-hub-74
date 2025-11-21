import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Filter, UserPlus } from "lucide-react";

const customerSegments = [
  { title: "Retail Premium", growth: "+18%", customers: 1240, color: "text-primary" },
  { title: "SME Banking", growth: "+9%", customers: 860, color: "text-emerald-500" },
  { title: "Corporate", growth: "+4%", customers: 118, color: "text-amber-500" },
];

const recentCustomers = [
  { name: "Rajesh Kumar", id: "CUST-7843", product: "Priority Savings", rm: "Neha Singh", status: "KYC Pending" },
  { name: "Meera Chopra", id: "CUST-7844", product: "SME Current", rm: "Dev Sharma", status: "Activated" },
  { name: "Harsh Jain", id: "CUST-7845", product: "Elite Wealth", rm: "Ananya Desai", status: "In Review" },
  { name: "The Artisan Co.", id: "CUST-7846", product: "SME Current", rm: "Kunal Rao", status: "Activated" },
];

const Customers = () => {
  const [search, setSearch] = useState("");

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Customer 360</p>
            <h1 className="text-3xl font-bold text-foreground">Customer Engagement</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Monitor onboarding, segmentation, and relationship health in one glance.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filters
            </Button>
            <Button className="gap-2">
              <UserPlus className="h-4 w-4" /> New Customer
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {customerSegments.map((segment) => (
            <Card key={segment.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{segment.title}</CardTitle>
                <span className={`text-xs font-medium ${segment.color}`}>{segment.growth}</span>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{segment.customers}</div>
                <p className="text-xs text-muted-foreground">active relationships</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border border-border/70 shadow-lg shadow-primary/10">
          <CardHeader>
            <CardTitle>Recent Onboarding</CardTitle>
            <CardDescription>Track maker-checker journey for new clients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <Input
                placeholder="Search customer, ID or RM"
                className="md:max-w-sm"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <div className="flex gap-2 text-xs text-muted-foreground">
                <Badge variant="outline" className="text-emerald-600">
                  Activated
                </Badge>
                <Badge variant="outline" className="text-amber-600">
                  In Review
                </Badge>
                <Badge variant="outline" className="text-red-600">
                  KYC Pending
                </Badge>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Customer ID</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Relationship Manager</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCustomers
                  .filter((row) => row.name.toLowerCase().includes(search.toLowerCase()) || row.id.includes(search))
                  .map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-semibold">{customer.name}</TableCell>
                      <TableCell>{customer.id}</TableCell>
                      <TableCell>{customer.product}</TableCell>
                      <TableCell>{customer.rm}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            customer.status === "Activated"
                              ? "default"
                              : customer.status === "KYC Pending"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {customer.status}
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

export default Customers;

