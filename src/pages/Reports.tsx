import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileBarChart2, TrendingUp } from "lucide-react";

const reports = [
  { title: "Regulatory Liquidity Report", frequency: "Daily", lastRun: "Today 07:20 AM", status: "Ready" },
  { title: "Branch Performance Pack", frequency: "Weekly", lastRun: "Mon 09:15 AM", status: "Generating" },
  { title: "High Value Exception Log", frequency: "Daily", lastRun: "Today 06:40 AM", status: "Ready" },
];

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">Intelligence Hub</p>
            <h1 className="text-3xl font-bold text-foreground">Reports &amp; Insights</h1>
            <p className="text-muted-foreground mt-2">
              Schedule supervisory packs, regulatory submissions, and trend dashboards.
            </p>
          </div>
          <Button className="gap-2">
            <FileBarChart2 className="h-4 w-4" /> Create Report
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { title: "MIS Packs", value: "12", subtitle: "Scheduled this week" },
            { title: "Regulatory Filings", value: "04", subtitle: "Due in next 24h" },
            { title: "Drill-down Dashboards", value: "09", subtitle: "Shared with CXO" },
          ].map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <TrendingUp className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {reports.map((report) => (
            <Card key={report.title} className="border border-border/70 shadow-lg shadow-primary/10">
              <CardHeader>
                <CardTitle className="text-lg">{report.title}</CardTitle>
                <CardDescription>{report.frequency} • Last run {report.lastRun}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <Badge variant={report.status === "Ready" ? "default" : "secondary"}>{report.status}</Badge>
                <Button variant="outline" size="sm" className="gap-2">
                  <Download className="h-4 w-4" /> Export
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;

