import React, { createContext, useContext, useEffect, useState } from "react";
import axios, { API_ENDPOINTS } from "../config/api";
import { useToast } from "../components/Toast";

interface UserRole {
  id: string;
  name: string;
  permissions: string[];
}

interface UserManagementContextType {
  roles: UserRole[];
  permissions: string[];
  hasPermission: (permission: string) => boolean;
  isAdmin: boolean;
  isModerator: boolean;
  refreshUserData: () => Promise<void>;
}

const UserManagementContext = createContext<
  UserManagementContextType | undefined
>(undefined);

interface UserManagementProviderProps {
  children: React.ReactNode;
}

export function UserManagementProvider({
  children,
}: UserManagementProviderProps) {
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);
  const { showToast } = useToast();

  // Default roles and permissions
  const defaultRoles: UserRole[] = [
    {
      id: "user",
      name: "User",
      permissions: [
        "create_recipe",
        "rate_recipe",
        "comment_recipe",
        "create_post",
        "manage_pantry",
        "create_meal_plan",
      ],
    },
    {
      id: "moderator",
      name: "Moderator",
      permissions: [
        "create_recipe",
        "rate_recipe",
        "comment_recipe",
        "create_post",
        "manage_pantry",
        "create_meal_plan",
        "moderate_content",
        "delete_posts",
        "ban_users",
        "view_reports",
      ],
    },
    {
      id: "admin",
      name: "Administrator",
      permissions: [
        "create_recipe",
        "rate_recipe",
        "comment_recipe",
        "create_post",
        "manage_pantry",
        "create_meal_plan",
        "moderate_content",
        "delete_posts",
        "ban_users",
        "view_reports",
        "manage_users",
        "manage_roles",
        "system_settings",
        "view_analytics",
        "export_data",
        "system_admin",
      ],
    },
  ];

  useEffect(() => {
    setRoles(defaultRoles);
    fetchUserPermissions();
  }, []);

  const fetchUserPermissions = async () => {
    try {
      // Get current user's permissions from the server
      const response = await axios.get(API_ENDPOINTS.ADMIN.SYSTEM_SETTINGS);
      setUserPermissions(response.data.permissions || []);
    } catch (error) {
      // Fallback to role-based permissions if API fails
      const userRole = localStorage.getItem("userRole") || "user";
      const rolePermissions =
        defaultRoles.find((role) => role.id === userRole)?.permissions || [];
      setUserPermissions(rolePermissions);
    }
  };

  const refreshUserData = async () => {
    await fetchUserPermissions();
  };

  const hasPermission = (permission: string): boolean => {
    return userPermissions.includes(permission);
  };

  const isAdmin = hasPermission("system_admin");
  const isModerator = hasPermission("moderate_content");

  const value: UserManagementContextType = {
    roles,
    permissions: userPermissions,
    hasPermission,
    isAdmin,
    isModerator,
    refreshUserData,
  };

  return (
    <UserManagementContext.Provider value={value}>
      {children}
    </UserManagementContext.Provider>
  );
}

export function useUserManagement() {
  const context = useContext(UserManagementContext);
  if (context === undefined) {
    throw new Error(
      "useUserManagement must be used within a UserManagementProvider"
    );
  }
  return context;
}

// Permission checking hook for components
export function usePermissions() {
  const { hasPermission, isAdmin, isModerator } = useUserManagement();

  return {
    hasPermission,
    isAdmin,
    isModerator,
    canModerateContent: hasPermission("moderate_content"),
    canManageUsers: hasPermission("manage_users"),
    canViewAnalytics: hasPermission("view_analytics"),
    canExportData: hasPermission("export_data"),
    canManageSystem: hasPermission("system_settings"),
  };
}

// HOC for protecting components based on permissions
export function withPermission<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermission: string,
  fallbackComponent?: React.ComponentType<P>
) {
  return function PermissionWrappedComponent(props: P) {
    const { hasPermission } = useUserManagement();

    if (hasPermission(requiredPermission)) {
      return <Component {...props} />;
    }

    if (fallbackComponent) {
      const FallbackComponent = fallbackComponent;
      return <FallbackComponent {...props} />;
    }

    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Access Denied
        </h3>
        <p className="text-gray-600">
          You don't have permission to access this feature.
        </p>
      </div>
    );
  };
}

export default UserManagementProvider;
