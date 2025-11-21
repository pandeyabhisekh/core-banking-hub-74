import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole, DEMO_CREDENTIALS, Permission } from '@/types/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

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

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('cbs_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Find matching demo credential
    const credential = DEMO_CREDENTIALS.find(
      (c) => c.username === username && c.password === password
    );

    if (!credential) {
      toast.error('Invalid credentials');
      return false;
    }

    // Create user object with role-based permissions
    const newUser: User = {
      id: `user_${Date.now()}`,
      username: credential.username,
      email: `${credential.username}@cbs.bank`,
      fullName: credential.fullName,
      role: credential.role,
      branchName: credential.branchName,
      departmentName: credential.departmentName,
      permissions: getRolePermissions(credential.role),
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
