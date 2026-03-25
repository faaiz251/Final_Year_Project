'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { format } from 'date-fns';import toast from 'react-hot-toast';
import { Calendar, Clock, User, FileText, AlertCircle, ChevronRight, Pill } from 'lucide-react';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // upcoming, completed, cancelled

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await apiRequest('/appointments');
      setAppointments(data.appointments || []);
    } catch (error) {
      toast.error('Failed to load appointments');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAppointments = () => {
    const now = new Date();
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.appointmentDate);
      switch (filter) {
        case 'upcoming':
          return aptDate > now && apt.status !== 'completed' && apt.status !== 'cancelled';
        case 'completed':
          return apt.status === 'completed';
        case 'cancelled':
          return apt.status === 'cancelled';
        default:
          return true;
      }
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredAppointments = getFilteredAppointments();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-4">Patient Appointments</h1>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm mb-1">Upcoming</p>
              <p className="text-3xl font-bold text-blue-600">
                {appointments.filter((a) => {
                  const d = new Date(a.appointmentDate);
                  return d > new Date() && a.status !== 'cancelled';
                }).length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold text-green-600">
                {appointments.filter((a) => a.status === 'completed').length}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-600 text-sm mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-600">{appointments.length}</p>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            {['upcoming', 'completed', 'cancelled'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === filterOption
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">No appointments</h2>
            <p className="text-gray-600">
              {filter === 'upcoming' ? 'No upcoming appointments scheduled' : `No ${filter} appointments`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => {
              const hasTreatment =
                appointment.treatment && appointment.treatment.treatmentStatus !== 'not-started';
              const hasPrescription = appointment.prescriptions && appointment.prescriptions.length > 0;

              return (
                <Link
                  key={appointment._id}
                  href={`/doctor/appointments/${appointment._id}`}
                  className="block"
                >
                  <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {appointment.patient?.name || 'Unknown Patient'}
                        </h3>
                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <User className="w-4 h-4" />
                          <span>{appointment.patient?.email}</span>
                        </div>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(appointment.status)}`}
                      >
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                    </div>

                    {/* Appointment Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Date</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(appointment.appointmentDate), 'MMM dd')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Time</p>
                        <p className="font-semibold flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {format(new Date(appointment.appointmentDate), 'HH:mm')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Reason</p>
                        <p className="font-semibold">{appointment.reason || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Disease</p>
                        <p className="font-semibold">{appointment.disease || 'N/A'}</p>
                      </div>
                    </div>

                    {/* Treatment & Prescription Status */}
                    <div className="flex gap-3 mb-4 flex-wrap">
                      {hasTreatment ? (
                        <div className="bg-green-50 px-3 py-2 rounded-lg flex items-center gap-2">
                          <Pill className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-green-700 font-semibold">
                            ✓ Treatment: {appointment.treatment.treatmentName}
                          </span>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 px-3 py-2 rounded-lg flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm text-yellow-700">No treatment plan yet</span>
                        </div>
                      )}
                      {hasPrescription && (
                        <div className="bg-blue-50 px-3 py-2 rounded-lg flex items-center gap-2">
                          <FileText className="w-4 h-4 text-blue-600" />
                          <span className="text-sm text-blue-700">{appointment.prescriptions.length} prescription(s)</span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-600">
                        Age: {appointment.patient?.age || 'N/A'} • {appointment.department || 'General'}
                      </p>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
