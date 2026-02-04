"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { apiRequest } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Loader2, Calendar, Pill } from "lucide-react";

export default function PatientRecordsPage() {
  const { user, loading } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loadingPres, setLoadingPres] = useState(true);

  useEffect(() => {
    if (loading || !user) return;
    const fetchPres = async () => {
      try {
        const data = await apiRequest(`/prescriptions/patient/${user._id}`);
        setPrescriptions(data.prescriptions || []);
      } catch (err) {
        // ignore
      } finally {
        setLoadingPres(false);
      }
    };
    fetchPres();
  }, [user, loading]);

  if (loading) return <div className="flex items-center justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-emerald-600" /></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Medical Records</h1>
        <p className="text-slate-600">View your prescriptions and medical history</p>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-slate-200">
          <CardTitle className="flex items-center gap-2 text-emerald-900">
            <Pill className="w-5 h-5" />
            Prescriptions
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {loadingPres ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-5 h-5 animate-spin text-emerald-600 mr-2" />
              <span className="text-slate-600">Loading prescriptions...</span>
            </div>
          ) : prescriptions.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm">No prescriptions found.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {prescriptions.map((p) => (
                <div
                  key={p._id}
                  className="p-4 rounded-lg border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">Dr. {p.doctor?.name || 'Doctor'}</h3>
                      <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(p.issuedDate || p.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      {p.status || 'Active'}
                    </Badge>
                  </div>

                  {p.medications && p.medications.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-semibold text-slate-900">Medications</h4>
                      <ul className="space-y-1">
                        {p.medications.map((m, i) => (
                          <li key={i} className="text-sm text-slate-700 p-2 rounded bg-slate-50">
                            <span className="font-medium text-emerald-700">{m.name}</span>
                            {m.dosage && <span className="text-slate-600"> • {m.dosage}</span>}
                            {m.frequency && <span className="text-slate-600"> • {m.frequency}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
