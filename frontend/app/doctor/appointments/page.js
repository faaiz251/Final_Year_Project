'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { apiRequest } from '@/lib/api';
import { format, isValid } from 'date-fns';
import toast from 'react-hot-toast';

import {
  Calendar,
  Clock,
  User,
  FileText,
  AlertCircle,
  ChevronRight,
  Pill,
} from 'lucide-react';

export default function DoctorAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  // upcoming | completed | cancelled
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await apiRequest('/appointments/doctor', 'GET');

      console.log('BACKEND DATA => ', data);

      setAppointments(data?.appointments || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  // SAFE DATE
  const getValidDate = (date) => {
    if (!date) return null;

    const parsedDate = new Date(date);

    return isValid(parsedDate) ? parsedDate : null;
  };

  // SAFE FORMAT
  const formatAppointmentDate = (date, formatType) => {
    const parsedDate = getValidDate(date);

    if (!parsedDate) return 'N/A';

    return format(parsedDate, formatType);
  };

  // FILTER APPOINTMENTS
  const getFilteredAppointments = () => {
    const now = new Date();

    return appointments.filter((appointment) => {
      const appointmentDate = getValidDate(appointment?.date);

      // COMPLETED
      if (filter === 'completed') {
        return (
          appointment?.status === 'completed' ||
          appointment?.isCompleted === true
        );
      }

      // CANCELLED
      if (filter === 'cancelled') {
        return appointment?.status === 'cancelled';
      }

      // UPCOMING
      if (filter === 'upcoming') {
        return (
          appointmentDate &&
          appointmentDate >= now &&
          appointment?.status !== 'completed' &&
          appointment?.status !== 'cancelled' &&
          appointment?.isCompleted !== true
        );
      }

      return true;
    });
  };

  // STATUS COLORS
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

  // COUNTS
  const upcomingCount = appointments.filter((appointment) => {
    const appointmentDate = getValidDate(appointment?.date);

    return (
      appointmentDate &&
      appointmentDate >= new Date() &&
      appointment?.status !== 'completed' &&
      appointment?.status !== 'cancelled' &&
      appointment?.isCompleted !== true
    );
  }).length;

  const completedCount = appointments.filter((appointment) => {
    return (
      appointment?.status === 'completed' ||
      appointment?.isCompleted === true
    );
  }).length;

  const cancelledCount = appointments.filter((appointment) => {
    return appointment?.status === 'cancelled';
  }).length;

  const filteredAppointments = getFilteredAppointments();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-lg">
          Loading appointments...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Patient Appointments
          </h1>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

            {/* UPCOMING */}
            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-sm text-gray-500 mb-2">
                Upcoming
              </p>

              <h2 className="text-3xl font-bold text-blue-600">
                {upcomingCount}
              </h2>
            </div>

            {/* COMPLETED */}
            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-sm text-gray-500 mb-2">
                Completed
              </p>

              <h2 className="text-3xl font-bold text-green-600">
                {completedCount}
              </h2>
            </div>

            {/* CANCELLED */}
            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-sm text-gray-500 mb-2">
                Cancelled
              </p>

              <h2 className="text-3xl font-bold text-red-600">
                {cancelledCount}
              </h2>
            </div>

            {/* TOTAL */}
            <div className="bg-white rounded-xl shadow p-5">
              <p className="text-sm text-gray-500 mb-2">
                Total
              </p>

              <h2 className="text-3xl font-bold text-gray-700">
                {appointments.length}
              </h2>
            </div>
          </div>

          {/* FILTERS */}
          <div className="flex gap-3 flex-wrap">

            {['upcoming', 'completed', 'cancelled'].map((item) => (
              <button
                key={item}
                onClick={() => setFilter(item)}
                className={`px-5 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filter === item
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* EMPTY */}
        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">

            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />

            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              No appointments found
            </h2>

            <p className="text-gray-500">
              No {filter} appointments available
            </p>
          </div>
        ) : (
          <div className="space-y-5">

            {filteredAppointments.map((appointment) => {

              const hasTreatment =
                appointment?.treatment &&
                appointment?.treatment?.treatmentStatus !==
                  'not-started';

              const hasPrescription =
                appointment?.prescriptions &&
                appointment?.prescriptions?.length > 0;

              return (
                <Link
                  key={appointment?._id}
                  href={`/doctor/appointments/${appointment?._id}`}
                  className="block"
                >
                  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-all duration-300 cursor-pointer">

                    {/* TOP */}
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">

                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">
                          {appointment?.patient?.name ||
                            'Unknown Patient'}
                        </h2>

                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />

                          <span>
                            {appointment?.patient?.email ||
                              'No Email'}
                          </span>
                        </div>
                      </div>

                      <div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusBadgeColor(
                            appointment?.status
                          )}`}
                        >
                          {appointment?.status || 'Unknown'}
                        </span>
                      </div>
                    </div>

                    {/* DETAILS */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-5">

                      {/* DATE */}
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Date
                        </p>

                        <p className="font-semibold flex items-center gap-1">
                          <Calendar className="w-4 h-4" />

                          {formatAppointmentDate(
                            appointment?.date,
                            'MMM dd, yyyy'
                          )}
                        </p>
                      </div>

                      {/* TIME */}
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Time
                        </p>

                        <p className="font-semibold flex items-center gap-1">
                          <Clock className="w-4 h-4" />

                          {appointment?.time || 'N/A'}
                        </p>
                      </div>

                      {/* REASON */}
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Reason
                        </p>

                        <p className="font-semibold">
                          {appointment?.reason || 'N/A'}
                        </p>
                      </div>

                      {/* PAYMENT */}
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Payment
                        </p>

                        <p className="font-semibold capitalize">
                          {appointment?.paymentStatus || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* TREATMENT + PRESCRIPTION */}
                    <div className="flex flex-wrap gap-3 mb-5">

                      {/* TREATMENT */}
                      {hasTreatment ? (
                        <div className="bg-green-50 px-4 py-2 rounded-lg flex items-center gap-2">

                          <Pill className="w-4 h-4 text-green-600" />

                          <span className="text-sm text-green-700 font-medium">
                            Treatment Started
                          </span>
                        </div>
                      ) : (
                        <div className="bg-yellow-50 px-4 py-2 rounded-lg flex items-center gap-2">

                          <AlertCircle className="w-4 h-4 text-yellow-600" />

                          <span className="text-sm text-yellow-700">
                            No treatment plan
                          </span>
                        </div>
                      )}

                      {/* PRESCRIPTION */}
                      {hasPrescription && (
                        <div className="bg-blue-50 px-4 py-2 rounded-lg flex items-center gap-2">

                          <FileText className="w-4 h-4 text-blue-600" />

                          <span className="text-sm text-blue-700">
                            {appointment?.prescriptions?.length}{' '}
                            prescription(s)
                          </span>
                        </div>
                      )}
                    </div>

                    {/* FOOTER */}
                    <div className="border-t pt-4 flex items-center justify-between">

                      <p className="text-sm text-gray-600">
                        Age:{' '}
                        {appointment?.patient?.age || 'N/A'}
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