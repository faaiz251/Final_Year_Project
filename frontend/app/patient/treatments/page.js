'use client';
import { useState, useEffect } from 'react';
import { apiRequest } from '@/lib/api';
import { formatDate, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { Calendar, ClipboardList, AlertCircle } from 'lucide-react';

export default function PatientTreatmentsPage() {
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    try {
      // Fetch all patient appointments and extract treatment data
      const data = await apiRequest('/appointments/my');
      const appointmentsWithTreatment = (data.appointments || []).filter(
        (apt) => apt.treatment && apt.treatment.treatmentStatus !== 'not-started'
      );
      setTreatments(appointmentsWithTreatment);
    } catch (error) {
      toast.error('Failed to load treatments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getProgressPercentage = (treatment) => {
    if (!treatment.treatmentStartDate || !treatment.treatmentEndDate) return 0;
    const start = new Date(treatment.treatmentStartDate);
    const end = new Date(treatment.treatmentEndDate);
    const today = new Date();
    const total = end - start;
    const elapsed = today - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const getRemainingDays = (endDate) => {
    const end = new Date(endDate);
    const today = new Date();
    const daysRemaining = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    return Math.max(0, daysRemaining);
  };

  const getRemainingDaysColor = (days) => {
    if (days > 30) return 'text-green-600';
    if (days > 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      case 'paused':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading treatments...</p>
      </div>
    );
  }

  if (treatments.length === 0) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <ClipboardList className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">No Active Treatments</h1>
            <p className="text-gray-600">
              Once a doctor initiates a treatment plan, it will appear here.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Treatment Plans</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {treatments.map((treatment) => {
            const treatmentData = treatment.treatment;
            const remainingDays = getRemainingDays(treatmentData.treatmentEndDate);
            const progressPercent = getProgressPercentage(treatmentData);

            return (
              <div key={treatment._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold">{treatmentData.treatmentName}</h2>
                      <p className="text-blue-100 mt-1">Dr. {treatment.doctor?.name}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(treatmentData.treatmentStatus)}`}>
                      {treatmentData.treatmentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Start Date</p>
                      <p className="font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(new Date(treatmentData.treatmentStartDate), 'MMM dd')}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">End Date</p>
                      <p className="font-semibold flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {formatDate(new Date(treatmentData.treatmentEndDate), 'MMM dd')}
                      </p>
                    </div>
                  </div>

                  {/* Remaining Days */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-gray-600">Time Remaining</p>
                      <p className={`font-bold text-lg ${getRemainingDaysColor(remainingDays)}`}>
                        {remainingDays} days
                      </p>
                    </div>
                    {remainingDays <= 7 && (
                      <div className="flex items-center gap-2 text-amber-600 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        <p>Treatment ending soon</p>
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <p className="text-sm text-gray-600">Progress</p>
                      <p className="text-sm font-semibold">{Math.round(progressPercent)}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* Notes */}
                  {treatmentData.treatmentNotes && (
                    <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Treatment Notes:</p>
                      <p className="text-sm text-gray-700">{treatmentData.treatmentNotes}</p>
                    </div>
                  )}

                  {/* Doctor Specialization */}
                  {treatment.doctor?.specialization && (
                    <div className="text-sm">
                      <span className="text-gray-600">Doctor Specialization: </span>
                      <span className="font-semibold">{treatment.doctor.specialization}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
