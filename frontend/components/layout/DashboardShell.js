"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarDays, Stethoscope, ClipboardList, Package, Settings, MessageSquare, Menu, X } from "lucide-react";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const items = user ? navConfig[user.role] || [] : [];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Menu Button & Header */}
      <header className="md:hidden flex items-center justify-between border-b border-border bg-background px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-5 h-5 text-emerald-600" />
          <h2 className="font-semibold text-foreground">HMS</h2>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 hover:bg-muted rounded-md transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside className={`${
        mobileMenuOpen ? "block" : "hidden md:block"
      } w-full md:w-64 border-r border-border bg-card md:sticky md:top-0 md:h-screen flex flex-col`}>
        <div className="px-6 py-4 border-b border-border hidden md:block">
          <h1 className="text-lg font-bold text-foreground">HMS {user?.role?.toUpperCase()}</h1>
          <p className="text-xs text-muted-foreground">{user?.name}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-emerald-600 text-white"
                    : "text-muted-foreground hover:bg-emerald-50"
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
          className="m-4 mt-auto rounded-md bg-muted hover:bg-muted text-foreground px-3 py-2 text-sm font-medium transition-colors w-[calc(100%-32px)]"
        >
          Logout
        </button>
      </aside>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 md:hidden z-30 top-16"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="hidden md:flex items-center justify-between border-b border-border bg-background px-6 py-3 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5 text-emerald-600" />
            <span className="font-semibold text-foreground">Healthcare Management System</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{user?.name}</span>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-6 bg-gradient-to-b from-emerald-50/50 to-background">{children}</div>
      </main>

      {/* Chat Button */}
      {user && (
        <button
          title="Chat"
          className="fixed right-6 bottom-6 z-50 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-full shadow-lg flex items-center justify-center transition-colors"
          onClick={() => {
            // placeholder - only visual
          }}
        >
          <MessageSquare className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

