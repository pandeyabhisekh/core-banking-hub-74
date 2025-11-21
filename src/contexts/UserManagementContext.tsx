import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  BRANCH_DIRECTORY,
  BranchInfo,
  CreateBranchPayload,
  CreateUserPayload,
  DemoCredential,
  INITIAL_USERS,
  ManagedUser,
  User,
  UserRole,
} from "@/types/auth";

interface UserManagementContextValue {
  users: ManagedUser[];
  branches: BranchInfo[];
  demoCredentials: DemoCredential[];
  createUser: (payload: CreateUserPayload, creator: User) => Promise<boolean>;
  lockUser: (userId: string, actor: User) => void;
  unlockUser: (userId: string, actor: User) => void;
  findUserByCredentials: (username: string, password: string) => ManagedUser | undefined;
  createBranch: (payload: CreateBranchPayload, actor: User) => Promise<boolean>;
  deleteBranch: (branchCode: string, actor: User) => void;
}

const UserManagementContext = createContext<UserManagementContextValue | undefined>(undefined);

const STORAGE_KEY = "cbs_users";
const BRANCH_STORAGE_KEY = "cbs_branches";

const CREATION_RULES: Record<UserRole, UserRole[]> = {
  super_admin: ["admin"],
  admin: ["head_department", "branch_manager", "staff"],
  head_department: ["branch_manager", "staff"],
  branch_manager: [],
  staff: [],
};

const normalizeUsername = (username: string) => username.trim().toLowerCase();

const loadInitialUsers = (): ManagedUser[] => {
  if (typeof window === "undefined") {
    return INITIAL_USERS;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return INITIAL_USERS;
    }
  }
  return INITIAL_USERS;
};

const loadInitialBranches = (): BranchInfo[] => {
  if (typeof window === "undefined") {
    return BRANCH_DIRECTORY;
  }

  const stored = window.localStorage.getItem(BRANCH_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return BRANCH_DIRECTORY;
    }
  }
  return BRANCH_DIRECTORY;
};

export const UserManagementProvider = ({ children }: { children: React.ReactNode }) => {
  const [users, setUsers] = useState<ManagedUser[]>(() => loadInitialUsers());
  const [branches, setBranches] = useState<BranchInfo[]>(() => loadInitialBranches());

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(BRANCH_STORAGE_KEY, JSON.stringify(branches));
    }
  }, [branches]);

  const demoCredentials = useMemo<DemoCredential[]>(() => {
    return users
      .filter((user) => user.isDemo)
      .map(({ username, password, role, fullName, branchName, departmentName }) => ({
        username,
        password,
        role,
        fullName,
        branchName,
        departmentName,
      }));
  }, [users]);

  const findUserByCredentials = (username: string, password: string) => {
    const normalized = normalizeUsername(username);
    return users.find(
      (user) => normalizeUsername(user.username) === normalized && user.password === password,
    );
  };

  const createUser = async (payload: CreateUserPayload, creator: User): Promise<boolean> => {
    const allowedRoles = CREATION_RULES[creator.role] ?? [];

    if (!allowedRoles.includes(payload.role)) {
      toast.error(`You are not allowed to create ${payload.role.replace("_", " ")} accounts.`);
      return false;
    }

    const normalized = normalizeUsername(payload.username);
    const exists = users.some((user) => normalizeUsername(user.username) === normalized);
    if (exists) {
      toast.error("A user with this login already exists.");
      return false;
    }

    let branchMeta: BranchInfo | undefined = undefined;
    if (payload.role === "branch_manager" || payload.role === "staff") {
      if (!payload.branchCode) {
        toast.error("Select a branch for this user.");
        return false;
      }
      branchMeta = branches.find((branch) => branch.code === payload.branchCode);
      if (!branchMeta) {
        toast.error("Invalid branch selection.");
        return false;
      }

      if (payload.role === "branch_manager") {
        const hasManager = users.some(
          (user) => user.role === "branch_manager" && user.branchCode === branchMeta!.code,
        );
        if (hasManager) {
          toast.error(`${branchMeta.name} already has a branch manager.`);
          return false;
        }
      } else {
        const staffCount = users.filter(
          (user) => user.role === "staff" && user.branchCode === branchMeta!.code,
        ).length;
        if (staffCount >= 10) {
          toast.error(`${branchMeta.name} already has 10 staff members.`);
          return false;
        }
      }
    }

    if (payload.role === "head_department") {
      const departments = payload.departments?.filter((dept) => dept.trim().length > 0) ?? [];
      if (departments.length === 0) {
        toast.error("Assign at least one department (max 3) to this head.");
        return false;
      }
      if (departments.length > 3) {
        toast.error("Head departments can manage only 3 departments.");
        return false;
      }
      payload.departmentName = departments[0];
    }

    const newUser: ManagedUser = {
      id: `user_${Date.now()}`,
      username: payload.username,
      email: payload.username,
      password: payload.password,
      role: payload.role,
      fullName: payload.fullName,
      branchName: branchMeta?.name || payload.branchName,
      branchCode: branchMeta?.code || payload.branchCode,
      departmentName: payload.departmentName,
      departments: payload.departments,
      permissions: [],
      isLocked: false,
      createdBy: creator.id,
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newUser]);
    toast.success(`${payload.fullName} added as ${payload.role.replace("_", " ")}`);
    return true;
  };

  const canToggleLock = (actor: User, target: ManagedUser) => {
    if (!["super_admin", "admin"].includes(actor.role)) {
      return false;
    }
    if (target.role === "super_admin") {
      return false;
    }
    if (actor.role === "admin" && target.role === "admin") {
      return false;
    }
    return true;
  };

  const lockUser = (userId: string, actor: User) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) {
          return user;
        }
        if (!canToggleLock(actor, user)) {
          toast.error("You are not allowed to lock this user.");
          return user;
        }
        if (user.isLocked) {
          return user;
        }
        toast.warning(`${user.fullName} has been locked.`);
        return { ...user, isLocked: true };
      }),
    );
  };

  const unlockUser = (userId: string, actor: User) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id !== userId) {
          return user;
        }
        if (!canToggleLock(actor, user)) {
          toast.error("You are not allowed to unlock this user.");
          return user;
        }
        if (!user.isLocked) {
          return user;
        }
        toast.success(`${user.fullName} is unlocked now.`);
        return { ...user, isLocked: false };
      }),
    );
  };

  const createBranch = async (payload: CreateBranchPayload, actor: User): Promise<boolean> => {
    if (actor.role !== "super_admin") {
      toast.error("Only the Super Admin can create branches.");
      return false;
    }
    if (!payload.name.trim() || !payload.code.trim()) {
      toast.error("Branch name and code are required.");
      return false;
    }
    const name = payload.name.trim();
    const code = payload.code.trim().toUpperCase();

    const exists = branches.some(
      (branch) => branch.code.toUpperCase() === code || branch.name.toLowerCase() === name.toLowerCase(),
    );
    if (exists) {
      toast.error("A branch with this name or code already exists.");
      return false;
    }

    setBranches((prev) => [...prev, { name, code }]);
    toast.success(`${name} branch added.`);
    return true;
  };

  const deleteBranch = (branchCode: string, actor: User) => {
    if (actor.role !== "super_admin") {
      toast.error("Only the Super Admin can delete branches.");
      return;
    }
    const target = branches.find((branch) => branch.code === branchCode);
    if (!target) {
      toast.error("Branch not found.");
      return;
    }

    setBranches((prev) => prev.filter((branch) => branch.code !== branchCode));
    setUsers((prev) =>
      prev.filter(
        (user) => !(user.branchCode && user.branchCode === branchCode && (user.role === "branch_manager" || user.role === "staff")),
      ),
    );
    toast.warning(`${target.name} branch removed. Associated staff and managers were deactivated.`);
  };

  return (
    <UserManagementContext.Provider
      value={{
        users,
        branches,
        demoCredentials,
        createUser,
        lockUser,
        unlockUser,
        findUserByCredentials,
        createBranch,
        deleteBranch,
      }}
    >
      {children}
    </UserManagementContext.Provider>
  );
};

export const useUserManagement = () => {
  const context = useContext(UserManagementContext);
  if (!context) {
    throw new Error("useUserManagement must be used within a UserManagementProvider");
  }
  return context;
};

