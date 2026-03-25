'use client';
import PrescriptionHistory from '@/components/prescription/PrescriptionHistory';
import { useEffect, useState } from 'react';

export default function PatientPrescriptionsPage() {
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setUserId(id);
    setLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <PrescriptionHistory patientId={userId} />
        )}
      </div>
    </div>
  );
}
