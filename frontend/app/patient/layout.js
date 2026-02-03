"use client";

import ProtectedRoleLayout from "../../components/layout/ProtectedRoleLayout";
import DashboardShell from "../../components/layout/DashboardShell";

export default function PatientLayout({ children }) {
  return (
    <ProtectedRoleLayout role="patient">
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoleLayout>
  );
}

