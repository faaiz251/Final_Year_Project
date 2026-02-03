"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";

export default function PatientProfilePage() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    apiRequest("/users/profile")
      .then((data) => setProfile(data.user))
      .catch(() => toast.error("Failed to load profile"));
  }, []);

  const handleChange = (field, value) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { user } = await apiRequest("/users/profile", {
        method: "PUT",
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          gender: profile.gender,
          dateOfBirth: profile.dateOfBirth,
          address: profile.address,
        }),
      });
      setProfile(user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!profile) {
    return <p className="text-slate-200">Loading profile...</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Patient Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSave} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs mb-1 text-slate-300">Name</label>
            <Input value={profile.name || ""} onChange={(e) => handleChange("name", e.target.value)} />
          </div>
          <div>
            <label className="block text-xs mb-1 text-slate-300">Email</label>
            <Input value={profile.email || ""} disabled />
          </div>
          <div>
            <label className="block text-xs mb-1 text-slate-300">Phone</label>
            <Input
              value={profile.phone || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs mb-1 text-slate-300">Gender</label>
            <Input
              value={profile.gender || ""}
              onChange={(e) => handleChange("gender", e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs mb-1 text-slate-300">Address</label>
            <Input
              value={profile.address || ""}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

