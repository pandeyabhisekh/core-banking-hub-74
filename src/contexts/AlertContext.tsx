import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Alert, CreateAlertPayload, User, UserRole } from "@/types/auth";
import { toast } from "sonner";

interface AlertContextValue {
  alerts: Alert[];
  createAlert: (payload: CreateAlertPayload, creator: User) => Promise<boolean>;
}

const AlertContext = createContext<AlertContextValue | undefined>(undefined);

const STORAGE_KEY = "cbs_alerts";

const ALL_ROLES: UserRole[] = ["super_admin", "admin", "head_department", "branch_manager", "staff"];

export const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    }
  }, [alerts]);

  const createAlert = async (payload: CreateAlertPayload, creator: User): Promise<boolean> => {
    if (!payload.title.trim() || !payload.message.trim()) {
      toast.error("Alert title and message are required.");
      return false;
    }

    let targetRoles: UserRole[] = [];

    if (creator.role === "head_department") {
      targetRoles = ["branch_manager", "staff"];
    } else if (creator.role === "super_admin" || creator.role === "admin") {
      if (!payload.audience) {
        toast.error("Please select an alert audience.");
        return false;
      }
      if (payload.audience === "everyone") {
        targetRoles = ALL_ROLES;
      } else {
        targetRoles = [payload.audience];
      }
    } else {
      toast.error("You are not allowed to create alerts.");
      return false;
    }

    const alert: Alert = {
      id: `alert_${Date.now()}`,
      title: payload.title.trim(),
      message: payload.message.trim(),
      creatorId: creator.id,
      creatorName: creator.fullName,
      creatorRole: creator.role,
      targetRoles,
      createdAt: new Date().toISOString(),
    };

    setAlerts((prev) => [alert, ...prev]);
    toast.success("Alert broadcasted successfully.");
    return true;
  };

  const value = useMemo(() => ({ alerts, createAlert }), [alerts]);

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlerts must be used within an AlertProvider");
  }
  return context;
};

