"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Loader2 } from "lucide-react";

export default function FeesPage() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiRequest('/fees')
      .then((data) => setFees(data.fees || []))
      .catch(() => toast.error('Failed to load fees'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Fee Schedule</h1>
        <p className="text-slate-600">View all service fees and consultation charges</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
          <CardTitle className="text-emerald-900">Services & Charges</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600 mr-2" />
              <span className="text-slate-600">Loading fees...</span>
            </div>
          ) : fees.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm">No fees configured at this time.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {fees.map((f) => (
                <div
                  key={f.disease}
                  className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{f.disease}</h3>
                    {f.description && (
                      <p className="text-sm text-slate-600 mt-1">{f.description}</p>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <div className="text-xl font-bold text-emerald-600">₹{f.amount}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
