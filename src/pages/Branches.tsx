import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Signal } from "lucide-react";

const branchMatrix = [
  { name: "South Extension", code: "DEL-SOX", manager: "Dev Sharma", score: 98, status: "Platinum" },
  { name: "Connaught Place", code: "DEL-CNP", manager: "Aditi Rao", score: 93, status: "Gold" },
  { name: "Mumbai BKC", code: "MUM-BKC", manager: "Rahul Jain", score: 96, status: "Platinum" },
  { name: "Bengaluru Koramangala", code: "BLR-KRM", manager: "Ankit Shah", score: 91, status: "Gold" },
];

const Branches = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Distribution network</p>
            <h1 className="text-3xl font-bold text-foreground">Branch Intelligence</h1>
            <p className="text-muted-foreground mt-2">
              Compare productivity and service health across the CBS network.
            </p>
          </div>
          <Badge variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" /> 42 branches live
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "Metro Branches", value: "12", subtitle: "Tier 1 cities", icon: Building },
            { title: "Tier 2/3 Branches", value: "30", subtitle: "High growth zones", icon: MapPin },
            { title: "Digital Hubs", value: "05", subtitle: "Paperless centers", icon: Signal },
          ].map((item) => (
            <Card key={item.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border border-border/70 shadow-lg shadow-primary/10">
          <CardHeader>
            <CardTitle>Branch Performance Matrix</CardTitle>
            <CardDescription>Score combines CASA growth, CX, and compliance.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Branch</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {branchMatrix.map((branch) => (
                  <TableRow key={branch.code}>
                    <TableCell className="font-semibold">{branch.name}</TableCell>
                    <TableCell>{branch.code}</TableCell>
                    <TableCell>{branch.manager}</TableCell>
                    <TableCell>{branch.score}</TableCell>
                    <TableCell>
                      <Badge variant={branch.status === "Platinum" ? "default" : "secondary"}>
                        {branch.status}
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

export default Branches;

