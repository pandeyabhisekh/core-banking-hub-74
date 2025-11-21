export type UserRole = 'super_admin' | 'admin' | 'head_department' | 'branch_manager' | 'staff';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  branchId?: string;
  branchName?: string;
  branchCode?: string;
  departmentId?: string;
  departmentName?: string;
  departments?: string[];
  permissions: Permission[];
  isLocked?: boolean;
  createdBy?: string;
  createdAt?: string;
}

export interface Permission {
  module: string;
  actions: ('create' | 'read' | 'update' | 'delete' | 'authorize')[];
}

export interface DemoCredential {
  username: string;
  password: string;
  role: UserRole;
  fullName: string;
  branchName?: string;
  departmentName?: string;
}

export interface ManagedUser extends User {
  password: string;
  isLocked: boolean;
  isDemo?: boolean;
}

export interface CreateUserPayload {
  fullName: string;
  username: string;
  password: string;
  role: UserRole;
  branchName?: string;
  branchCode?: string;
  departmentName?: string;
  departments?: string[];
}

export interface BranchInfo {
  name: string;
  code: string;
}

export interface CreateBranchPayload {
  name: string;
  code: string;
}

export const BRANCH_DIRECTORY: BranchInfo[] = [
  { name: "Agartala", code: "SBININBB476" },
  { name: "Ballygunge (Kolkata)", code: "SBININBB328" },
  { name: "Bhagalpur", code: "SBININBB384" },
  { name: "Bhubaneswar Main Branch", code: "SBININBB270" },
  { name: "Burnpur", code: "SBININBB640" },
  { name: "Cuttack", code: "SBININBB768" },
  { name: "Darjeeling", code: "SBININBB336" },
  { name: "Dhanbad", code: "SBININBB388" },
  { name: "Dibrugarh", code: "SBININBB661" },
  { name: "Durgapur", code: "SBININBB337" },
  { name: "Guwahati", code: "SBININBB159" },
  { name: "Gorakhpur", code: "SBININBB497" },
  { name: "Imphal", code: "SBININBB480" },
  { name: "Jamshedpur", code: "SBININBB164" },
  { name: "Kanpur Main Branch", code: "SBININBB124" },
  { name: "Karimganj", code: "SBININBB481" },
  { name: "Lucknow Main Branch", code: "SBININBB157" },
  { name: "Muzaffarpur", code: "SBININBB791" },
  { name: "Naini", code: "SBININBB351" },
  { name: "Netaji Subhas Road (Kolkata)", code: "SBININBB495" },
  { name: "Ahmednagar", code: "SBININBB507" },
  { name: "Andheri West (Mumbai)", code: "SBININBB354" },
  { name: "Backbay Reclamation (Mumbai)", code: "SBININBB107" },
  { name: "Bhabha Atomic Research Centre (Mumbai)", code: "SBININBB508" },
  { name: "Bhandup (Mumbai)", code: "SBININBB509" },
  { name: "Borivli East (Mumbai)", code: "SBININBB510" },
  { name: "Byculla (Mumbai)", code: "SBININBB511" },
  { name: "Calangute (Goa)", code: "SBININBB512" },
  { name: "IIT Powai (Mumbai)", code: "SBININBB519" },
  { name: "Dadar (Mumbai)", code: "SBININBB355" },
];

export type AlertAudience = 'everyone' | UserRole;

export interface Alert {
  id: string;
  title: string;
  message: string;
  creatorId: string;
  creatorName: string;
  creatorRole: UserRole;
  targetRoles: UserRole[];
  createdAt: string;
}

export interface CreateAlertPayload {
  title: string;
  message: string;
  audience?: AlertAudience;
}

export const INITIAL_USERS: ManagedUser[] = [
  {
    id: 'user-superadmin',
    username: 'superadmin@cbs.in',
    email: 'superadmin@cbs.in',
    password: 'superadmin',
    role: 'super_admin',
    fullName: 'CBS Super Administrator',
    departmentName: 'Corporate Office',
    permissions: [],
    isLocked: false,
    isDemo: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-admin-01',
    username: 'ops.admin@cbs.in',
    email: 'ops.admin@cbs.in',
    password: 'admin123',
    role: 'admin',
    fullName: 'Amit Verma',
    departmentName: 'Central Operations',
    permissions: [],
    isLocked: false,
    isDemo: true,
    createdBy: 'user-superadmin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-head-01',
    username: 'head.ops@cbs.in',
    email: 'head.ops@cbs.in',
    password: 'head123',
    role: 'head_department',
    fullName: 'Prisha Kulkarni',
    departmentName: 'Retail Banking',
    departments: ['Retail Banking', 'Digital Banking'],
    permissions: [],
    isLocked: false,
    isDemo: true,
    createdBy: 'user-admin-01',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-manager-01',
    username: 'manager.south@cbs.in',
    email: 'manager.south@cbs.in',
    password: 'manager123',
    role: 'branch_manager',
    fullName: 'Dev Sharma',
    branchName: 'Andheri West (Mumbai)',
    branchCode: 'SBININBB354',
    permissions: [],
    isLocked: false,
    isDemo: true,
    createdBy: 'user-head-01',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'user-staff-01',
    username: 'staff.premium@cbs.in',
    email: 'staff.premium@cbs.in',
    password: 'staff123',
    role: 'staff',
    fullName: 'Neha Singh',
    branchName: 'Andheri West (Mumbai)',
    branchCode: 'SBININBB354',
    permissions: [],
    isLocked: false,
    isDemo: true,
    createdBy: 'user-manager-01',
    createdAt: new Date().toISOString(),
  },
];

export const DEMO_CREDENTIALS: DemoCredential[] = INITIAL_USERS.filter((user) => user.isDemo).map(
  ({ username, password, role, fullName, branchName, departmentName }) => ({
    username,
    password,
    role,
    fullName,
    branchName,
    departmentName,
  }),
);
