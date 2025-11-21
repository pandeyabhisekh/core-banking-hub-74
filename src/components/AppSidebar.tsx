import { 
  Building2, 
  LayoutDashboard, 
  Users, 
  UserCircle, 
  Wallet, 
  ArrowLeftRight, 
  CheckCircle, 
  FileText, 
  Settings,
  LogOut,
  TrendingUp,
  Shield
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const menuItems = {
  super_admin: [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'User Management', url: '/users', icon: Users },
    { title: 'System Settings', url: '/settings', icon: Settings },
    { title: 'Audit Logs', url: '/audit', icon: Shield },
    { title: 'Reports', url: '/reports', icon: FileText },
  ],
  admin: [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'User Management', url: '/users', icon: Users },
    { title: 'Branches', url: '/branches', icon: Building2 },
    { title: 'Customers', url: '/customers', icon: UserCircle },
    { title: 'Reports', url: '/reports', icon: FileText },
  ],
  head_department: [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Customers', url: '/customers', icon: UserCircle },
    { title: 'Accounts', url: '/accounts', icon: Wallet },
    { title: 'Transactions', url: '/transactions', icon: ArrowLeftRight },
    { title: 'Approvals', url: '/approvals', icon: CheckCircle },
    { title: 'Reports', url: '/reports', icon: FileText },
  ],
  branch_manager: [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Customers', url: '/customers', icon: UserCircle },
    { title: 'Accounts', url: '/accounts', icon: Wallet },
    { title: 'Transactions', url: '/transactions', icon: ArrowLeftRight },
    { title: 'Approvals', url: '/approvals', icon: CheckCircle },
    { title: 'Reports', url: '/reports', icon: FileText },
  ],
  staff: [
    { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
    { title: 'Customers', url: '/customers', icon: UserCircle },
    { title: 'Accounts', url: '/accounts', icon: Wallet },
    { title: 'Transactions', url: '/transactions', icon: ArrowLeftRight },
    { title: 'Teller Operations', url: '/teller', icon: TrendingUp },
  ],
};

export function AppSidebar() {
  const { user, logout } = useAuth();
  const { open } = useSidebar();
  
  if (!user) return null;

  const items = menuItems[user.role] || [];

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          {open && (
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-sidebar-foreground">CoreBank</span>
              <span className="text-xs text-sidebar-foreground/70">CBS Platform</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <Separator className="bg-sidebar-border" />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            {open ? 'Navigation' : ''}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end
                      className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="w-4 h-4" />
                      {open && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {open && (
          <div className="mb-3 p-3 bg-sidebar-accent rounded-lg">
            <p className="text-xs font-medium text-sidebar-foreground">{user.fullName}</p>
            <p className="text-xs text-sidebar-foreground/70 capitalize">
              {user.role.replace('_', ' ')}
            </p>
            {user.branchName && (
              <p className="text-xs text-sidebar-foreground/60 mt-1">{user.branchName}</p>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start text-sidebar-foreground hover:bg-destructive hover:text-destructive-foreground"
        >
          <LogOut className="w-4 h-4" />
          {open && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
