"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "../components/ui/button";
import { useAuth } from "../context/AuthContext";
import hms from './image.png';
import { Stethoscope, Calendar, Users, FileText, Lock } from "lucide-react";

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
    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-emerald-50 to-slate-100">
      {!loading && !user ? (
        <>
          {/* Hero Section */}
          <section className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-7xl">
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left Content */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-flex px-4 py-2 bg-emerald-100 rounded-full">
                      <p className="text-sm font-medium text-emerald-700">✨ Modern Healthcare Solutions</p>
                    </div>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 leading-tight">
                      Your Health, <span className="text-emerald-600">Our Priority</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-slate-600 max-w-lg leading-relaxed">
                      A comprehensive healthcare management platform designed to streamline appointments, manage medical records, and connect patients with healthcare professionals effortlessly.
                    </p>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 pt-1">
                        <Calendar className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Smart Scheduling</h3>
                        <p className="text-slate-600 text-sm">Book appointments with ease and receive instant confirmations</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 pt-1">
                        <FileText className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Medical Records</h3>
                        <p className="text-slate-600 text-sm">Securely store and access your entire medical history</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 pt-1">
                        <Users className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Expert Doctors</h3>
                        <p className="text-slate-600 text-sm">Connect with qualified healthcare professionals</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 pt-1">
                        <Lock className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">Secure & Private</h3>
                        <p className="text-slate-600 text-sm">Your data is encrypted and protected at all times</p>
                      </div>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <Button 
                      onClick={() => router.push('/login')} 
                      size="lg" 
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold h-12"
                    >
                      Sign In
                    </Button>
                    <Button 
                      onClick={() => router.push('/register')} 
                      variant="outline" 
                      size="lg"
                      className="h-12 font-semibold border-2"
                    >
                      Get Started
                    </Button>
                  </div>
                </div>

                {/* Right Image */}
                <div className="relative hidden md:block">
                  <div className="relative h-96 lg:h-screen max-h-96 rounded-2xl overflow-hidden shadow-2xl">
                    <Image
                      src={hms}
                      alt="Healthcare professionals providing care"
                      fill
                      className="object-cover"
                      sizes="(min-width: 768px) 50vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Trusted by Healthcare Professionals</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">Join thousands of doctors and patients using our platform</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
                  <p className="text-slate-600">Active Doctors</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">10K+</div>
                  <p className="text-slate-600">Satisfied Patients</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-emerald-600 mb-2">50K+</div>
                  <p className="text-slate-600">Appointments Booked</p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-slate-600 text-lg">Loading...</p>
        </div>
      )}
    </main>
  );
}

