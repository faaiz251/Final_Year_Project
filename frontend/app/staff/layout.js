"use client";

import ProtectedRoleLayout from "../../components/layout/ProtectedRoleLayout";
import DashboardShell from "../../components/layout/DashboardShell";

export default function StaffLayout({ children }) {
  return (
    <ProtectedRoleLayout role="staff">
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoleLayout>
  );
}

