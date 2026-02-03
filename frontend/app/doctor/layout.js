"use client";

import ProtectedRoleLayout from "../../components/layout/ProtectedRoleLayout";
import DashboardShell from "../../components/layout/DashboardShell";

export default function DoctorLayout({ children }) {
  return (
    <ProtectedRoleLayout role="doctor">
      <DashboardShell>{children}</DashboardShell>
    </ProtectedRoleLayout>
  );
}

