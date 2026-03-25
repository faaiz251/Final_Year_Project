'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import ChatComponent from '@/components/chat/ChatComponent';
import TreatmentSection from '@/components/treatment/TreatmentSection';
import { formatDate } from 'date-fns';
import toast from 'react-hot-toast';
import { Calendar, Clock, Stethoscope, User, FileText } from 'lucide-react';

export default function AppointmentDetailsPage() {
  const params = useParams();
  const appointmentId = params.appointmentId;
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
    fetchAppointment();
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      const data = await apiRequest(`/appointments/${appointmentId}`);
      setAppointment(data.appointment || data);
    } catch (error) {
      toast.error('Failed to load appointment');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading appointment details...</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Appointment not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Appointment Header */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Appointment Info */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">Appointment Details</h1>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold">
                      {formatDate(new Date(appointment.date), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold">{appointment.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Reason for Visit</p>
                    <p className="font-semibold">{appointment.reason || 'Regular Checkup'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Disease/Diagnosis</p>
                    <p className="font-semibold">{appointment.disease || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="pt-4">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    appointment.status === 'completed'
                      ? 'bg-green-100 text-green-700'
                      : appointment.status === 'confirmed'
                      ? 'bg-blue-100 text-blue-700'
                      : appointment.status === 'cancelled'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {appointment.status?.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Right Column - Doctor Info & Fee */}
            <div className="space-y-4">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Doctor Information</h3>
                {appointment.doctor && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      <p>
                        <span className="text-gray-600">Name: </span>
                        <span className="font-semibold">Dr. {appointment.doctor.name}</span>
                      </p>
                    </div>
                    <p>
                      <span className="text-gray-600">Specialization: </span>
                      <span className="font-semibold">
                        {appointment.doctor.specialization}
                      </span>
                    </p>
                    <p>
                      <span className="text-gray-600">Email: </span>
                      <span className="font-semibold">{appointment.doctor.email}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Payment Info */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold mb-4">Payment Information</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation Fee:</span>
                    <span className="font-semibold">₹{appointment.fee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-semibold capitalize">
                      {appointment.paymentMethod}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-semibold ${
                        appointment.paymentStatus === 'paid'
                          ? 'text-green-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {appointment.paymentStatus?.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor Notes Section */}
        {appointment.doctorNotes && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Doctor Notes</h2>
            <div className="bg-blue-50 p-4 rounded-lg text-gray-800">
              {appointment.doctorNotes}
            </div>
          </div>
        )}

        {/* Chat Component */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <ChatComponent
            appointmentId={appointmentId}
            userRole={userRole}
            userName={localStorage.getItem('userName')}
          />
        </div>

        {/* Treatment Section */}
        <TreatmentSection
          appointmentId={appointmentId}
          userRole={userRole}
          appointment={appointment}
        />
      </div>
    </div>
  );
}
