"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";

export default function DoctorAttendancePage() {
  const [saving, setSaving] = useState(false);

  const mark = async (status) => {
    setSaving(true);
    try {
      await apiRequest("/doctor/attendance", {
        method: "POST",
        body: JSON.stringify({ status }),
      });
      toast.success(`Marked ${status}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-3">
        <Button disabled={saving} onClick={() => mark("present")}>
          Mark Present
        </Button>
        <Button variant="outline" disabled={saving} onClick={() => mark("absent")}>
          Mark Absent
        </Button>
      </CardContent>
    </Card>
  );
}

