"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";

export default function StaffDashboardPage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    apiRequest("/staff/me")
      .then((data) => setProfile(data.user))
      .catch(() => toast.error("Failed to load staff data"));
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Staff Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        {profile ? (
          <div className="space-y-1 text-sm text-slate-200">
            <p>
              Name: <span className="font-medium">{profile.name}</span>
            </p>
            <p>
              Department:{" "}
              <span className="font-medium">
                {profile.department?.name || "Not assigned"}
              </span>
            </p>
          </div>
        ) : (
          <p className="text-slate-300">Loading...</p>
        )}
      </CardContent>
    </Card>
  );
}

