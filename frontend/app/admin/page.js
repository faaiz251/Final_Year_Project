"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/api";
import { motion } from "framer-motion";

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    apiRequest("/admin/summary")
      .then((data) => setSummary(data))
      .catch(() => setSummary(null));
  }, []);

  const cards = [
    { label: "Doctors", value: summary?.totalDoctors ?? "...", color: "from-emerald-500 to-emerald-400" },
    { label: "Patients", value: summary?.totalPatients ?? "...", color: "from-sky-500 to-sky-400" },
    { label: "Staff", value: summary?.totalStaff ?? "...", color: "from-violet-500 to-violet-400" },
    { label: "Appointments", value: summary?.totalAppointments ?? "...", color: "from-amber-500 to-amber-400" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-50">Admin Dashboard</h2>
      <div className="grid gap-4 md:grid-cols-4">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`rounded-xl bg-gradient-to-br ${card.color} p-4 text-slate-950 shadow-lg`}
          >
            <p className="text-sm font-medium">{card.label}</p>
            <p className="mt-2 text-2xl font-semibold">{card.value}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

