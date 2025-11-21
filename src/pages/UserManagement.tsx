import { FormEvent, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useUserManagement } from "@/contexts/UserManagementContext";
import { useAuth } from "@/contexts/AuthContext";
import { CreateUserPayload, ManagedUser, UserRole } from "@/types/auth";
import { Lock, Unlock, UserPlus, Building2 } from "lucide-react";
import { toast } from "sonner";

const roleLabels: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  head_department: "Head of Department",
  branch_manager: "Branch Manager",
  staff: "Staff",
};

const roleColors: Record<UserRole, string> = {
  super_admin: "bg-purple-100 text-purple-700",
  admin: "bg-blue-100 text-blue-700",
  head_department: "bg-emerald-100 text-emerald-700",
  branch_manager: "bg-amber-100 text-amber-700",
  staff: "bg-slate-100 text-slate-700",
};

const getCreatableRoles = (role: UserRole | undefined): UserRole[] => {
  switch (role) {
    case "super_admin":
      return ["admin"];
    case "admin":
      return ["head_department"];
    case "head_department":
      return ["branch_manager", "staff"];
    default:
      return [];
  }
};

const canCurrentUserLock = (viewer: ManagedUser | null, target: ManagedUser) => {
  if (!viewer) return false;
  if (viewer.role !== "super_admin" && viewer.role !== "admin") {
    return false;
  }
  if (target.role === "super_admin") {
    return false;
  }
  if (viewer.role === "admin" && target.role === "admin") {
    return false;
  }
  return true;
};

const UserManagement = () => {
  const { users, branches, createUser, lockUser, unlockUser, createBranch, deleteBranch } = useUserManagement();
  const { user } = useAuth();
  const creatableRoles = getCreatableRoles(user?.role);
  const initialRole = creatableRoles[0] ?? "admin";
  const [formData, setFormData] = useState<CreateUserPayload>({
    fullName: "",
    username: "",
    password: "",
    role: initialRole,
    branchName: "",
    branchCode: "",
    departmentName: "",
    departments: [],
  });
  const [departmentInput, setDepartmentInput] = useState("");
  const [branchForm, setBranchForm] = useState({ name: "", code: "" });

  const visibleUsers = useMemo(() => {
    if (!user) return [];

    if (user.role === "super_admin") {
      return users.filter((u) => u.id !== user.id);
    }

    if (user.role === "admin") {
      return users.filter((u) => u.role !== "super_admin");
    }

    if (user.role === "head_department") {
      return users.filter(
        (u) =>
          u.role === "branch_manager" || (u.role === "staff" && u.createdBy === user.id),
      );
    }

    if (user.role === "branch_manager") {
      return users.filter(
        (u) => u.role === "staff" && u.branchName && u.branchName === user.branchName,
      );
    }

    return users.filter((u) => u.id === user.id);
  }, [users, user]);

  const roleCounts = useMemo(() => {
    return users.reduce(
      (acc, curr) => {
        acc[curr.role] = (acc[curr.role] ?? 0) + 1;
        return acc;
      },
      {} as Record<UserRole, number>,
    );
  }, [users]);

  const scopeDescription = useMemo(() => {
    if (!user) return "";
    switch (user.role) {
      case "super_admin":
        return "You can view and activate every admin, head department, branch manager, and staff profile across CBS.";
      case "admin":
        return "You can oversee all head department, branch manager, and staff records globally.";
      case "head_department":
        return "You have visibility into the branch managers (and staff you onboard) within your division.";
      case "branch_manager":
        return "You can monitor staff mapped to your branch for operational readiness.";
      default:
        return "";
    }
  }, [user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    const success = await createUser(formData, user);
    if (success) {
      setFormData({
        fullName: "",
        username: "",
        password: "",
        role: formData.role,
        branchName: "",
        branchCode: "",
        departmentName: "",
        departments: [],
      });
      setDepartmentInput("");
    }
  };

  const handleRoleChange = (nextRole: UserRole) => {
    setFormData((prev) => ({
      ...prev,
      role: nextRole,
      branchName: nextRole === "branch_manager" || nextRole === "staff" ? prev.branchName : "",
      branchCode: nextRole === "branch_manager" || nextRole === "staff" ? prev.branchCode : "",
      departmentName: nextRole === "head_department" ? prev.departmentName : "",
      departments: nextRole === "head_department" ? prev.departments : [],
    }));
    if (nextRole !== "head_department") {
      setDepartmentInput("");
    }
  };

  const showBranchField = formData.role === "branch_manager" || formData.role === "staff";
  const showDepartmentField = formData.role === "head_department";

  const handleBranchSelect = (value: string) => {
    const branch = branches.find((entry) => entry.code === value);
    setFormData((prev) => ({
      ...prev,
      branchName: branch?.name ?? "",
      branchCode: branch?.code ?? "",
    }));
  };

  const handleDepartmentInput = (value: string) => {
    setDepartmentInput(value);
    const entries = value
      .split(",")
      .map((entry) => entry.trim())
      .filter(Boolean);
    if (entries.length > 3) {
      toast.error("Head Departments can manage at most 3 departments.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      departments: entries,
      departmentName: entries[0],
    }));
  };

  const headDepartments = useMemo(
    () => users.filter((record) => record.role === "head_department"),
    [users],
  );

  const branchSnapshots = useMemo(
    () =>
      branches.map((branch) => {
        const manager = users.find(
          (record) => record.role === "branch_manager" && record.branchCode === branch.code,
        );
        const staff = users.filter(
          (record) => record.role === "staff" && record.branchCode === branch.code,
        );
        return { branch, manager, staff };
      }),
    [branches, users],
  );

  const handleBranchSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    const success = await createBranch(
      {
        name: branchForm.name,
        code: branchForm.code,
      },
      user,
    );
    if (success) {
      setBranchForm({ name: "", code: "" });
    }
  };

  const handleBranchDelete = (code: string) => {
    if (!user) return;
    const target = branches.find((branch) => branch.code === code);
    if (!target) return;
    const confirmed = window.confirm(
      `Delete branch "${target.name}"? Assigned manager and staff accounts will be removed.`,
    );
    if (confirmed) {
      deleteBranch(code, user);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-wide text-muted-foreground">User Directory</p>
            <h1 className="text-3xl font-bold text-foreground">Manage Access</h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              Super Admin can onboard Admins, Admins can add Department heads, and Department
              heads onboard branch teams. Locked users cannot sign in until unlocked.
            </p>
          </div>
          <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
            <p className="font-semibold text-primary">Scope &amp; privileges</p>
            <p className="mt-1 text-sm">{scopeDescription}</p>
            {creatableRoles.length > 0 && (
              <p className="mt-3 text-xs uppercase tracking-wide text-primary/80">
                You can create:{" "}
                <span className="font-semibold">
                  {creatableRoles.map((role) => roleLabels[role]).join(", ")}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {Object.entries(roleLabels).map(([role, label]) => (
            <Card key={role}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Badge className={roleColors[role as UserRole]}>Active</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{roleCounts[role as UserRole] ?? 0}</div>
                <p className="text-xs text-muted-foreground">Total {label} profiles</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <Card className="border border-border/60 shadow-lg shadow-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <UserPlus className="h-5 w-5 text-primary" />
                Create New User
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Assign login credentials with the correct role and workspace context.
              </p>
            </CardHeader>
            <CardContent>
              {creatableRoles.length === 0 ? (
                <div className="rounded-lg border border-dashed border-muted p-6 text-center text-muted-foreground">
                  You don&rsquo;t have permission to create new users.
                </div>
              ) : (
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        placeholder="Enter full name"
                        value={formData.fullName}
                        onChange={(e) => setFormData((prev) => ({ ...prev, fullName: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username">Login Email</Label>
                      <Input
                        id="username"
                        type="email"
                        placeholder="user@cbs.in"
                        value={formData.username}
                        onChange={(e) => setFormData((prev) => ({ ...prev, username: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">Temporary Password</Label>
                      <Input
                        id="password"
                        type="text"
                        placeholder="Set a secure password"
                        value={formData.password}
                        onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Role</Label>
                      <Select value={formData.role} onValueChange={(value: UserRole) => handleRoleChange(value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose role" />
                        </SelectTrigger>
                        <SelectContent>
                          {creatableRoles.map((role) => (
                            <SelectItem key={role} value={role}>
                              {roleLabels[role]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {showDepartmentField && (
                    <div className="space-y-2">
                      <Label htmlFor="departmentName">Departments (max 3)</Label>
                      <Input
                        id="departmentName"
                        placeholder="Retail Banking, Corporate Banking"
                        value={departmentInput}
                        onChange={(e) => handleDepartmentInput(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Admins assign departments when creating a Head Department user.
                      </p>
                    </div>
                  )}
                  {showBranchField && (
                    <div className="space-y-2">
                      <Label htmlFor="branchName">Assigned Branch</Label>
                      <Select value={formData.branchCode} onValueChange={handleBranchSelect} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {branches.map((branch) => (
                            <SelectItem key={branch.code} value={branch.code}>
                              {branch.name} ({branch.code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Each branch supports one manager and up to 10 staff members.
                      </p>
                    </div>
                  )}
                  <Button type="submit" className="w-full">
                    Create Account
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border/60 bg-gradient-to-br from-primary/5 via-background to-accent/10 shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle>Access Governance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div>
                <p className="font-semibold text-foreground">Super Admin</p>
                <p>Creates Admin &amp; Head of Department users. Only one super admin exists.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Admin</p>
                <p>Creates Head of Department users and can lock/unlock any non-admin account.</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">Head Department</p>
                <p>Creates Branch Managers and Staff logins for their cluster.</p>
              </div>
              <Separator />
              <div className="rounded-xl border border-border/50 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-wide text-primary">Tip</p>
                <p className="mt-2 text-foreground">
                  Use lock/unlock controls to secure dormant accounts. Locked users will instantly be
                  logged out and must be unlocked to sign in again.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border border-border/80 shadow-xl shadow-secondary/10">
          <CardHeader>
            <CardTitle className="text-lg">
              Active Directory <span className="text-sm text-muted-foreground">({visibleUsers.length} users)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Workspace</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleUsers.map((row: ManagedUser) => (
                    <TableRow key={row.id}>
                    <TableCell>
                      <div className="font-semibold">{row.fullName}</div>
                      <p className="text-xs text-muted-foreground">{row.username}</p>
                    </TableCell>
                      <TableCell className="text-xs text-muted-foreground">{row.id}</TableCell>
                    <TableCell>
                      <Badge className={roleColors[row.role]}>{roleLabels[row.role]}</Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-foreground">
                          {row.branchName
                            ? `${row.branchName} (${row.branchCode})`
                            : row.departments?.length
                              ? `Departments: ${row.departments.join(", ")}`
                              : row.departmentName || "—"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {row.branchName ? "Branch" : row.departmentName ? "Department" : "Global"}
                      </p>
                    </TableCell>
                    <TableCell>
                      <Badge variant={row.isLocked ? "destructive" : "default"}>
                        {row.isLocked ? "Locked" : "Active"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "-"}
                    </TableCell>
                      <TableCell className="text-right">
                      {canCurrentUserLock(user, row) && (
                        <Button
                          variant={row.isLocked ? "secondary" : "outline"}
                          size="sm"
                          className="gap-2"
                          onClick={() =>
                            row.isLocked ? unlockUser(row.id, user!) : lockUser(row.id, user!)
                          }
                        >
                          {row.isLocked ? (
                            <>
                              <Unlock className="h-4 w-4" /> Unlock
                            </>
                          ) : (
                            <>
                              <Lock className="h-4 w-4" /> Lock
                            </>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {visibleUsers.length === 0 && (
              <div className="rounded-lg border border-dashed border-muted p-8 text-center text-muted-foreground">
                No users to display.
              </div>
            )}
          </CardContent>
        </Card>

        {user && (user.role === "super_admin" || user.role === "admin") && (
          <div className="grid gap-6 lg:grid-cols-[1fr]">
            <Card className="border border-border/80 shadow-xl shadow-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  Branch Intelligence
                </CardTitle>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Each CBS branch can host one manager and up to ten staff members.</p>
                  {user.role === "super_admin" && (
                    <form className="grid gap-3 md:grid-cols-3" onSubmit={handleBranchSubmit}>
                      <Input
                        placeholder="Branch name"
                        value={branchForm.name}
                        onChange={(e) => setBranchForm((prev) => ({ ...prev, name: e.target.value }))}
                        required
                      />
                      <Input
                        placeholder="BIC / SWIFT code"
                        value={branchForm.code}
                        onChange={(e) => setBranchForm((prev) => ({ ...prev, code: e.target.value }))}
                        required
                      />
                      <Button type="submit" className="w-full">
                        Add Branch
                      </Button>
                    </form>
                  )}
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Branch Name</TableHead>
                      <TableHead>BIC Code</TableHead>
                      <TableHead>Branch Manager</TableHead>
                      <TableHead>Staff (count / 10)</TableHead>
                      {user.role === "super_admin" && <TableHead className="text-right">Actions</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {branchSnapshots.map(({ branch, manager, staff }) => (
                      <TableRow key={branch.code}>
                        <TableCell className="font-medium">{branch.name}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{branch.code}</TableCell>
                        <TableCell>
                          {manager ? (
                            <div className="text-sm">
                              {manager.fullName}
                              <p className="text-xs text-muted-foreground">{manager.id}</p>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">Unassigned</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {staff.length} / 10
                          </div>
                          <div className="mt-1 space-y-1">
                            {staff.slice(0, 3).map((member) => (
                              <p key={member.id} className="text-xs text-muted-foreground">
                                {member.fullName} ({member.id})
                              </p>
                            ))}
                            {staff.length > 3 && (
                              <p className="text-[11px] text-muted-foreground">
                                +{staff.length - 3} more
                              </p>
                            )}
                          </div>
                        </TableCell>
                        {user.role === "super_admin" && (
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleBranchDelete(branch.code)}
                            >
                              Remove
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card className="border border-border/70 shadow-lg shadow-secondary/10">
              <CardHeader>
                <CardTitle>Head Departments Overview</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Each head can own up to three departments provisioned by Admins.
                </p>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                {headDepartments.map((head) => (
                  <div key={head.id} className="rounded-xl border border-border/60 p-4">
                    <p className="text-sm font-semibold">{head.fullName}</p>
                    <p className="text-xs text-muted-foreground mb-2">{head.id}</p>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      Departments
                    </p>
                    <p className="text-sm text-foreground">
                      {head.departments?.length ? head.departments.join(", ") : "Not assigned"}
                    </p>
                  </div>
                ))}
                {headDepartments.length === 0 && (
                  <p className="text-sm text-muted-foreground">No head departments available.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default UserManagement;

