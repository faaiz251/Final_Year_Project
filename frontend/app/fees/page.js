"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";

export default function FeesPage() {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    apiRequest('/fees')
      .then((data) => setFees(data.fees || []))
      .catch(() => toast.error('Failed to load fees'));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fee Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {fees.map((f) => (
            <div key={f.disease} className="flex justify-between p-3 bg-white/5 rounded-md">
              <div>
                <div className="font-semibold">{f.disease}</div>
                {f.description && <div className="text-sm text-slate-400">{f.description}</div>}
              </div>
              <div className="text-emerald-300 font-medium">₹{f.amount}</div>
            </div>
          ))}
          {fees.length === 0 && <div className="text-sm text-slate-400">No fees configured.</div>}
        </div>
      </CardContent>
    </Card>
  );
}
