"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarDays, Stethoscope, ClipboardList, Package, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const navConfig = {
  admin: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Users", icon: Users },
    { href: "/admin/departments", label: "Departments", icon: ClipboardList },
    { href: "/admin/inventory", label: "Inventory", icon: Package },
  ],
  doctor: [
    { href: "/doctor", label: "Dashboard", icon: LayoutDashboard },
    { href: "/doctor/attendance", label: "Attendance", icon: ClipboardList },
    { href: "/doctor/patients", label: "Patients", icon: Users },
    { href: "/doctor/prescriptions", label: "E-Prescribe", icon: Stethoscope },
  ],
  patient: [
    { href: "/patient", label: "Dashboard", icon: LayoutDashboard },
    { href: "/patient/profile", label: "Profile", icon: Settings },
    { href: "/patient/appointments", label: "Appointments", icon: CalendarDays },
    { href: "/patient/records", label: "Records", icon: ClipboardList },
    { href: "/fees", label: "Fees", icon: Package },
  ],
  staff: [
    { href: "/staff", label: "Dashboard", icon: LayoutDashboard },
    { href: "/staff/profile", label: "Profile", icon: Settings },
    { href: "/staff/schedule", label: "Schedule", icon: CalendarDays },
  ],
};

export default function DashboardShell({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const items = user ? navConfig[user.role] || [] : [];

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-50">
      <aside className="w-64 border-r border-slate-800 bg-slate-900/80 backdrop-blur-md hidden md:flex flex-col">
        <div className="px-6 py-4 border-b border-slate-800">
          <h1 className="text-lg font-semibold">HMS {user?.role?.toUpperCase()}</h1>
          <p className="text-xs text-slate-400">{user?.name}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  active ? "bg-emerald-500 text-slate-900" : "text-slate-200 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <button
          onClick={logout}
          className="m-4 mt-auto rounded-md border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900/70 px-4 py-3">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-emerald-400" />
            <span className="font-medium">Healthcare Management System</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-300">{user?.name}</span>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6 bg-slate-950">{children}</div>
      </main>
    </div>
  );
}

