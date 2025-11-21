export type UserRole = 'super_admin' | 'admin' | 'head_department' | 'branch_manager' | 'staff';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  branchId?: string;
  branchName?: string;
  departmentId?: string;
  departmentName?: string;
  permissions: Permission[];
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

// Demo credentials for testing
export const DEMO_CREDENTIALS: DemoCredential[] = [
  {
    username: 'superadmin',
    password: 'super@123',
    role: 'super_admin',
    fullName: 'System Administrator',
  },
  {
    username: 'admin',
    password: 'admin@123',
    role: 'admin',
    fullName: 'John Admin',
  },
  {
    username: 'headdept',
    password: 'head@123',
    role: 'head_department',
    fullName: 'Sarah Williams',
    departmentName: 'Operations',
  },
  {
    username: 'manager',
    password: 'manager@123',
    role: 'branch_manager',
    fullName: 'Mike Johnson',
    branchName: 'Main Branch',
  },
  {
    username: 'staff',
    password: 'staff@123',
    role: 'staff',
    fullName: 'Emily Davis',
    branchName: 'Main Branch',
  },
];
