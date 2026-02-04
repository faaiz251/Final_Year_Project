"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { apiRequest } from "../../../lib/api";
import { Card, CardHeader, CardTitle, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { User, Mail, Phone, MapPin, Calendar, AlertCircle } from "lucide-react";

export default function PatientProfilePage() {
  const [profile, setProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/users/profile")
      .then((data) => {
        setProfile(data.user);
      })
      .catch(() => toast.error("Failed to load profile"))
      .finally(() => setLoading(false));
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
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

    if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-border shadow-sm">
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Loading profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="border-border shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p>Failed to load profile</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Your Profile</h1>
        <p className="text-muted-foreground">Manage your personal and medical information</p>
      </div>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-border">
          <CardTitle className="text-foreground">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  Full Name
                </label>
                <Input
                  value={profile.name || ""}
                  onChange={(e) => handleChange("name", e.target.value)}
                  placeholder="Your full name"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-emerald-600" />
                  Email
                </label>
                <Input
                  value={profile.email || ""}
                  disabled
                  className="w-full bg-card"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  Phone Number
                </label>
                <Input
                  type="tel"
                  value={profile.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="Your phone number"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground">Gender</label>
                <select
                  className="h-10 w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  value={profile.gender || ""}
                  onChange={(e) => handleChange("gender", e.target.value)}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  Date of Birth
                </label>
                <Input
                  type="date"
                  value={profile.dateOfBirth || ""}
                  onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="block text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Address
                </label>
                <textarea
                  className="w-full h-20 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
                  value={profile.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Your full address"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader className="bg-gradient-to-r from-teal-50 to-emerald-50 border-b border-border">
          <CardTitle className="text-foreground">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <p className="text-lg font-semibold text-foreground mt-1 capitalize">{profile.role}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Member Since</p>
              <p className="text-lg font-semibold text-foreground mt-1">
                {profile.createdAt
                  ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

