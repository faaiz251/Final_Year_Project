'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { format, isValid } from 'date-fns';
import toast from 'react-hot-toast';

import {
  Calendar,
  Clock,
  Stethoscope,
  User,
  Pill,
  FileText,
} from 'lucide-react';

import ChatComponent from '@/components/chat/ChatComponent';
import TreatmentSection from '@/components/treatment/TreatmentSection';

export default function DoctorAppointmentPage() {
  const { appointmentId } = useParams();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showPrescriptionForm, setShowPrescriptionForm] =
    useState(false);

  const [prescriptionForm, setPrescriptionForm] = useState({
    medications: [
      {
        name: '',
        dosage: '',
        frequency: '',
      },
    ],
    prescriptionText: '',
  });

  useEffect(() => {
    if (appointmentId) {
      fetchAppointment();
    }
  }, [appointmentId]);

  // SAFE DATE FORMATTER
  const formatSafeDate = (date, formatType) => {
    if (!date) return 'N/A';

    const parsedDate = new Date(date);

    if (!isValid(parsedDate)) return 'Invalid Date';

    return format(parsedDate, formatType);
  };

  // FETCH SINGLE APPOINTMENT
  const fetchAppointment = async () => {
    try {
      setLoading(true);

      // FETCH ALL
      const data = await apiRequest('/appointments/doctor', 'GET');

      console.log('API RESPONSE => ', data);

      // FIND CURRENT APPOINTMENT
      const foundAppointment = data?.appointments?.find(
        (item) => item._id === appointmentId
      );

      console.log('FOUND APPOINTMENT => ', foundAppointment);

      if (!foundAppointment) {
        toast.error('Appointment not found');
        return;
      }

      setAppointment(foundAppointment);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load appointment');
    } finally {
      setLoading(false);
    }
  };

  // ADD MEDICINE
  const handleAddMedication = () => {
    setPrescriptionForm((prev) => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          name: '',
          dosage: '',
          frequency: '',
        },
      ],
    }));
  };

  // REMOVE MEDICINE
  const handleRemoveMedication = (index) => {
    setPrescriptionForm((prev) => ({
      ...prev,
      medications: prev.medications.filter(
        (_, i) => i !== index
      ),
    }));
  };

  // CHANGE MEDICINE
  const handleMedicationChange = (
    index,
    field,
    value
  ) => {
    setPrescriptionForm((prev) => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index
          ? {
              ...med,
              [field]: value,
            }
          : med
      ),
    }));
  };

  // SUBMIT PRESCRIPTION
  const handleSubmitPrescription = async (e) => {
    e.preventDefault();

    try {
      if (
        prescriptionForm.medications.some(
          (m) => !m.name
        )
      ) {
        toast.error(
          'Please fill all medication names'
        );

        return;
      }

      await apiRequest('/prescriptions', {
        method: 'POST',
        body: {
          patient: appointment?.patient?._id,
          medications:
            prescriptionForm.medications,
          prescriptionText:
            prescriptionForm.prescriptionText,
          disease: appointment?.disease,
          appointmentId,
        },
      });

      toast.success(
        'Prescription created successfully'
      );

      setPrescriptionForm({
        medications: [
          {
            name: '',
            dosage: '',
            frequency: '',
          },
        ],
        prescriptionText: '',
      });

      setShowPrescriptionForm(false);

      fetchAppointment();
    } catch (error) {
      console.error(error);
      toast.error(
        'Failed to create prescription'
      );
    }
  };

  // LOADING
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">
          Loading appointment...
        </p>
      </div>
    );
  }

  // NOT FOUND
  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-600">
          Appointment not found
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        {/* BACK */}
        <a
          href="/doctor/appointments"
          className="text-blue-600 hover:underline mb-4 inline-flex items-center gap-1"
        >
          ← Back to Appointments
        </a>

        {/* HEADER */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* PATIENT */}
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Patient Name
              </p>

              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <User className="w-5 h-5" />

                {appointment?.patient?.name}
              </h2>

              <p className="text-gray-700 mb-2">
                📧 {appointment?.patient?.email}
              </p>

              <p className="text-gray-700">
                📱{' '}
                {appointment?.patient?.phone ||
                  'N/A'}
              </p>
            </div>

            {/* DATE + TIME */}
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Appointment Date
              </p>

              <p className="text-lg font-semibold flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4" />

                {formatSafeDate(
                  appointment?.date,
                  'MMM dd, yyyy'
                )}
              </p>

              <p className="text-sm text-gray-500 mb-1">
                Appointment Time
              </p>

              <p className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4" />

                {appointment?.time || 'N/A'}
              </p>

              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 capitalize">
                {appointment?.status}
              </span>
            </div>

            {/* CLINICAL */}
            <div>
              <p className="text-sm text-gray-500 mb-1">
                Reason
              </p>

              <p className="text-lg font-semibold mb-4">
                {appointment?.reason ||
                  'General Checkup'}
              </p>

              <p className="text-sm text-gray-500 mb-1">
                Disease
              </p>

              <p className="text-lg font-semibold flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />

                {appointment?.disease ||
                  'Not specified'}
              </p>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="md:col-span-2 space-y-6">

            {/* TREATMENT */}
            <div className="bg-white rounded-xl shadow-md p-6">

              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5" />

                Treatment Plan
              </h2>

              <TreatmentSection
                appointment={appointment}
                onTreatmentUpdate={
                  fetchAppointment
                }
              />
            </div>

            {/* CHAT */}
            <div className="bg-white rounded-xl shadow-md p-6">

              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />

                Patient Communication
              </h2>

              <ChatComponent
                appointmentId={appointmentId}
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-white rounded-xl shadow-md p-6 h-fit">

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Pill className="w-5 h-5" />

              Prescriptions (
              {appointment?.prescriptions
                ?.length || 0}
              )
            </h2>

            {/* LIST */}
            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">

              {appointment?.prescriptions &&
              appointment?.prescriptions
                ?.length > 0 ? (
                appointment.prescriptions.map(
                  (prescription) => (
                    <div
                      key={prescription._id}
                      className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500"
                    >
                      <p className="text-sm font-semibold mb-2">
                        {prescription?.medications
                          ?.map(
                            (m) => m.name
                          )
                          .join(', ')}
                      </p>

                      <p className="text-xs text-gray-600">
                        {formatSafeDate(
                          prescription?.issuedDate,
                          'MMM dd, yyyy'
                        )}
                      </p>
                    </div>
                  )
                )
              ) : (
                <p className="text-gray-500 text-sm text-center py-4">
                  No prescriptions yet
                </p>
              )}
            </div>

            {/* BUTTON */}
            <button
              onClick={() =>
                setShowPrescriptionForm(
                  !showPrescriptionForm
                )
              }
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {showPrescriptionForm
                ? 'Cancel'
                : '+ Add Prescription'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}