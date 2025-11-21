import { useEffect, useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAlerts } from '@/contexts/AlertContext';
import { toast } from '@/components/ui/sonner';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { user } = useAuth();
  const { alerts } = useAlerts();
  const [seenAlertIds, setSeenAlertIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) {
      setSeenAlertIds(new Set());
      return;
    }
    const stored = localStorage.getItem(`cbs_seen_alerts_${user.id}`);
    if (stored) {
      try {
        const parsed: string[] = JSON.parse(stored);
        setSeenAlertIds(new Set(parsed));
        return;
      } catch {
        setSeenAlertIds(new Set());
      }
    } else {
      setSeenAlertIds(new Set());
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      return;
    }
    const storageKey = `cbs_seen_alerts_${user.id}`;
    let updated = new Set(seenAlertIds);
    let changed = false;
    alerts
      .filter((alert) => alert.targetRoles.includes(user.role))
      .forEach((alert) => {
        if (!seenAlertIds.has(alert.id)) {
          toast(alert.title, {
            description: alert.message,
          });
          updated = new Set(updated).add(alert.id);
          changed = true;
        }
      });
    if (changed) {
      setSeenAlertIds(updated);
      localStorage.setItem(storageKey, JSON.stringify(Array.from(updated)));
    }
  }, [alerts, seenAlertIds, user]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div className="hidden md:flex items-center space-x-2 bg-muted rounded-lg px-3 py-2 w-80">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search customers, accounts..."
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
                  {user?.fullName.charAt(0)}
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
