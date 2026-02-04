"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import hms from './image.png';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      return;
    } else {
      router.replace(`/${user.role}`);
    }
  }, [user, loading, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-emerald-50/30">
      {!loading && !user ? (
        <section className="w-full max-w-6xl p-6 md:p-12 grid gap-8 md:grid-cols-2 items-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground">Healthcare Management System</h1>
              <p className="text-lg text-emerald-600 font-medium">Modern. Secure. Reliable.</p>
            </div>
            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              A comprehensive platform to book appointments, manage medical records, and streamline clinical workflows. Trusted by healthcare professionals for everyday care.
            </p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                Easy appointment booking and scheduling
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                Secure electronic prescriptions and records
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                Role-based access for doctors, staff, and patients
              </li>
            </ul>
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
              <Button onClick={() => router.push('/login')} size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700">
                Sign in
              </Button>
              <Button onClick={() => router.push('/register')} variant="outline" size="lg" className="w-full sm:w-auto">
                Create account
              </Button>
            </div>
            <p className="text-sm text-muted-foreground pt-2">Built with privacy and simplicity in mind.</p>
          </div>

          <div className="rounded-xl overflow-hidden shadow-lg hidden md:block relative h-80">
            <Image
              src={hms}
              alt="Hospital staff collaborating"
              fill
              className="object-cover"
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </div>
        </section>
      ) : (
        <p className="text-slate-600">Loading...</p>
      )}
    </main>
  );
}

