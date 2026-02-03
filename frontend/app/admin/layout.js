"use client";

import ProtectedRoleLayout from "../../components/layout/ProtectedRoleLayout";
import DashboardShell from "../../components/layout/DashboardShell";

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoleLayout role="admin">
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoleLayout>
  );
}

