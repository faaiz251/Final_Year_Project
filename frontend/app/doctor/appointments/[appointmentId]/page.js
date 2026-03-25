'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { Calendar, Clock, Stethoscope, User, AlertCircle, Pill, FileText } from 'lucide-react';

// Import integrated components
import ChatComponent from '@/components/chat/ChatComponent';
import TreatmentSection from '@/components/treatment/TreatmentSection';

export default function DoctorAppointmentPage() {
  const { appointmentId } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [prescriptionForm, setPrescriptionForm] = useState({
    medications: [{ name: '', dosage: '', frequency: '' }],
    prescriptionText: '',
  });

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      const data = await apiRequest(`/appointments/${appointmentId}`);
      setAppointment(data.appointment);
    } catch (error) {
      toast.error('Failed to load appointment');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedication = () => {
    setPrescriptionForm((prev) => ({
      ...prev,
      medications: [...prev.medications, { name: '', dosage: '', frequency: '' }],
    }));
  };

  const handleRemoveMedication = (index) => {
    setPrescriptionForm((prev) => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index),
    }));
  };

  const handleMedicationChange = (index, field, value) => {
    setPrescriptionForm((prev) => ({
      ...prev,
      medications: prev.medications.map((med, i) =>
        i === index ? { ...med, [field]: value } : med
      ),
    }));
  };

  const handleSubmitPrescription = async (e) => {
    e.preventDefault();
    try {
      if (prescriptionForm.medications.some((m) => !m.name)) {
        toast.error('Please fill in all medication names');
        return;
      }

      await apiRequest('/prescriptions', {
        method: 'POST',
        body: {
          patient: appointment.patient._id,
          medications: prescriptionForm.medications,
          prescriptionText: prescriptionForm.prescriptionText,
          disease: appointment.disease,
          appointmentId: appointmentId,
        },
      });

      toast.success('Prescription created successfully');
      setPrescriptionForm({
        medications: [{ name: '', dosage: '', frequency: '' }],
        prescriptionText: '',
      });
      setShowPrescriptionForm(false);
      fetchAppointment();
    } catch (error) {
      toast.error('Failed to create prescription');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading appointment...</p>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Appointment not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <a href="/doctor/appointments" className="text-blue-600 hover:underline mb-4 flex items-center gap-1">
          ← Back to Appointments
        </a>

        {/* Appointment Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Patient Info */}
            <div>
              <p className="text-gray-600 text-sm mb-1">Patient Name</p>
              <p className="text-2xl font-bold flex items-center gap-2 mb-4">
                <User className="w-5 h-5" />
                {appointment.patient?.name}
              </p>
              <p className="text-gray-700 mb-2">📧 {appointment.patient?.email}</p>
              <p className="text-gray-700">📱 {appointment.patient?.phone || 'N/A'}</p>
            </div>

            {/* Appointment Details */}
            <div>
              <p className="text-gray-600 text-sm mb-1">Date & Time</p>
              <p className="text-lg font-semibold flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4" />
                {format(new Date(appointment.appointmentDate), 'MMM dd, yyyy')}
              </p>
              <p className="text-lg font-semibold flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4" />
                {format(new Date(appointment.appointmentDate), 'MMM dd')}
              </p>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700">
                {appointment.status.toUpperCase()}
              </span>
            </div>

            {/* Clinical Info */}
            <div>
              <p className="text-gray-600 text-sm mb-1">Reason for Visit</p>
              <p className="text-lg font-semibold mb-4">{appointment.reason || 'General Checkup'}</p>

              <p className="text-gray-600 text-sm mb-1">Disease/Condition</p>
              <p className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Stethoscope className="w-4 h-4" />
                {appointment.disease || 'Not specified'}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Treatment Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5" />
                Treatment Plan
              </h2>
              <TreatmentSection appointment={appointment} onTreatmentUpdate={fetchAppointment} />
            </div>

            {/* Chat Section */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Patient Communication
              </h2>
              <ChatComponent appointmentId={appointmentId} />
            </div>
          </div>

          {/* Sidebar - Prescriptions */}
          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Pill className="w-5 h-5" />
              Prescriptions ({appointment.prescriptions?.length || 0})
            </h2>

            {/* Existing Prescriptions */}
            <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
              {appointment.prescriptions && appointment.prescriptions.length > 0 ? (
                appointment.prescriptions.map((prescription) => (
                  <div key={prescription._id} className="bg-gray-50 p-3 rounded-lg border-l-4 border-blue-500">
                    <p className="text-sm font-semibold text-gray-800 mb-2">
                      {prescription.medications?.map((m) => m.name).join(', ') || 'Prescription'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {formatDate(new Date(prescription.issuedDate), 'MMM dd, yyyy')}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm py-4 text-center">No prescriptions yet</p>
              )}
            </div>

            {/* Add Prescription Button */}
            <button
              onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {showPrescriptionForm ? 'Cancel' : '+ Add Prescription'}
            </button>

            {/* Prescription Form */}
            {showPrescriptionForm && (
              <form onSubmit={handleSubmitPrescription} className="mt-4 space-y-4 border-t pt-4">
                {/* Disease Auto-filled */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Disease</label>
                  <input
                    type="text"
                    value={appointment.disease || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                  />
                </div>

                {/* Medications */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Medications</label>
                  {prescriptionForm.medications.map((med, index) => (
                    <div key={index} className="mb-3 p-3 bg-gray-50 rounded-lg space-y-2">
                      <input
                        type="text"
                        placeholder="Medicine name"
                        value={med.name}
                        onChange={(e) => handleMedicationChange(index, 'name', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Dosage (e.g., 500mg)"
                        value={med.dosage}
                        onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Frequency (e.g., 3x daily)"
                        value={med.frequency}
                        onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      />
                      {prescriptionForm.medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMedication(index)}
                          className="text-red-600 text-sm font-semibold hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="text-blue-600 text-sm font-semibold hover:underline mt-2"
                  >
                    + Add another
                  </button>
                </div>

                {/* Prescription Notes */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
                  <textarea
                    placeholder="Instructions, precautions, etc."
                    value={prescriptionForm.prescriptionText}
                    onChange={(e) =>
                      setPrescriptionForm((prev) => ({
                        ...prev,
                        prescriptionText: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none h-20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Save Prescription
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
