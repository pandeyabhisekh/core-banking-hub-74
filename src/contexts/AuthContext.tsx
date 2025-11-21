import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, Permission } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUserManagement } from '@/contexts/UserManagementContext';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { findUserByCredentials, users } = useUserManagement();

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('cbs_user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        const latest = users.find((u) => u.id === parsedUser.id);
        if (latest && !latest.isLocked) {
          setUser(parsedUser);
        } else {
          localStorage.removeItem('cbs_user');
        }
      } catch {
        localStorage.removeItem('cbs_user');
      }
    }
  }, [users]);

  const login = async (username: string, password: string): Promise<boolean> => {
    const managedUser = findUserByCredentials(username, password);

    if (!managedUser) {
      toast.error('Invalid credentials');
      return false;
    }

    if (managedUser.isLocked) {
      toast.error('This user is locked. Contact an administrator.');
      return false;
    }

    // Create user object with role-based permissions
    const newUser: User = {
      id: managedUser.id,
      username: managedUser.username,
      email: managedUser.email,
      fullName: managedUser.fullName,
      role: managedUser.role,
      branchName: managedUser.branchName,
      branchCode: managedUser.branchCode,
      departmentName: managedUser.departmentName,
      departments: managedUser.departments,
      permissions: getRolePermissions(managedUser.role),
      isLocked: managedUser.isLocked,
      createdBy: managedUser.createdBy,
      createdAt: managedUser.createdAt,
    };

    setUser(newUser);
    localStorage.setItem('cbs_user', JSON.stringify(newUser));
    toast.success(`Welcome back, ${newUser.fullName}!`);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cbs_user');
    navigate('/login');
    toast.info('Logged out successfully');
  };
  
  useEffect(() => {
    if (!user) return;
    const latest = users.find((u) => u.id === user.id);
    if (!latest || latest.isLocked) {
      setUser(null);
      localStorage.removeItem('cbs_user');
      toast.error('Your user has been locked by an administrator.');
      navigate('/login');
    }
  }, [users, user, navigate]);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper function to get permissions based on role
function getRolePermissions(role: UserRole): Permission[] {
  const baseModules: Permission[] = [
    { module: 'dashboard', actions: ['read'] },
    { module: 'reports', actions: ['read'] }
  ];
  
  switch (role) {
    case 'super_admin':
      return [
        { module: 'users', actions: ['create', 'read', 'update', 'delete'] },
        { module: 'branches', actions: ['create', 'read', 'update', 'delete'] },
        { module: 'system', actions: ['create', 'read', 'update', 'delete'] },
        { module: 'audit', actions: ['read'] },
        ...baseModules,
      ];
    case 'admin':
      return [
        { module: 'users', actions: ['create', 'read', 'update'] },
        { module: 'branches', actions: ['read', 'update'] },
        { module: 'customers', actions: ['read'] },
        { module: 'accounts', actions: ['read'] },
        { module: 'transactions', actions: ['read'] },
        ...baseModules,
      ];
    case 'head_department':
      return [
        { module: 'users', actions: ['create', 'read', 'update'] },
        { module: 'customers', actions: ['create', 'read', 'update'] },
        { module: 'accounts', actions: ['create', 'read', 'update', 'authorize'] },
        { module: 'transactions', actions: ['read', 'authorize'] },
        { module: 'approvals', actions: ['read', 'authorize'] },
        ...baseModules,
      ];
    case 'branch_manager':
      return [
        { module: 'customers', actions: ['create', 'read', 'update'] },
        { module: 'accounts', actions: ['create', 'read', 'update', 'authorize'] },
        { module: 'transactions', actions: ['read', 'authorize'] },
        { module: 'approvals', actions: ['read', 'authorize'] },
        { module: 'teller', actions: ['read'] },
        ...baseModules,
      ];
    case 'staff':
      return [
        { module: 'customers', actions: ['create', 'read'] },
        { module: 'accounts', actions: ['create', 'read'] },
        { module: 'transactions', actions: ['create', 'read'] },
        { module: 'teller', actions: ['create', 'read'] },
        ...baseModules,
      ];
    default:
      return [];
  }
}
