'use client';
import { useState, useEffect } from 'react';
import { prescriptionAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDate } from 'date-fns';

export default function PrescriptionHistory({ patientId }) {
  const [prescriptions, setPrescriptions] = useState([]);
  const [diseaseWiseSummary, setDiseaseWiseSummary] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [diseaseDetails, setDiseaseDetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('summary'); // summary or byDisease

  useEffect(() => {
    fetchPrescriptionData();
  }, [patientId]);

  const fetchPrescriptionData = async () => {
    setLoading(true);
    try {
      // Fetch summary
      const summaryData = await prescriptionAPI.getSummary(patientId);
      setDiseaseWiseSummary(summaryData.diseaseWiseSummary || []);

      // Fetch full history
      const historyData = await prescriptionAPI.getHistory(patientId);
      setPrescriptions(historyData.prescriptions || []);
    } catch (error) {
      toast.error('Failed to fetch prescriptions');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDisease = async (disease) => {
    setSelectedDisease(disease);
    setViewMode('byDisease');
    try {
      const data = await prescriptionAPI.getByDisease(patientId, disease);
      setDiseaseDetails(data.prescriptions || []);
    } catch (error) {
      toast.error('Failed to fetch disease details');
    }
  };

  if (loading) {
    return (
      <div className="bg-white border rounded-lg p-6 text-center">
        <p className="text-gray-600">Loading prescriptions...</p>
      </div>
    );
  }

  // Summary View
  if (viewMode === 'summary') {
    return (
      <div className="space-y-6">
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Your Prescriptions</h2>
          <p className="text-gray-600 mb-6">
            Total: {diseaseWiseSummary.length} disease conditions treated
          </p>

          {diseaseWiseSummary.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No prescriptions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {diseaseWiseSummary.map((item, idx) => (
                <div
                  key={idx}
                  className="border rounded-lg p-4 hover:shadow-lg cursor-pointer transition"
                  onClick={() => handleSelectDisease(item._id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item._id}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>{item.count}</strong> prescription
                        {item.count !== 1 ? 's' : ''} issued
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {item.count}x
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-gray-600">First Issued</p>
                      <p className="font-semibold">
                        {formatDate(new Date(item.firstPrescribed), 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Last Issued</p>
                      <p className="font-semibold">
                        {formatDate(new Date(item.lastPrescribed), 'MMM dd, yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 text-blue-600 text-sm font-semibold">
                    View Details →
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Disease Details View
  return (
    <div className="space-y-6">
      <div className="bg-white border rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => {
              setViewMode('summary');
              setSelectedDisease(null);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold">{selectedDisease}</h2>
        </div>

        {/* Summary for this disease */}
        {diseaseWiseSummary.find((d) => d._id === selectedDisease) && (
          <div className="grid grid-cols-3 gap-4 mb-6 bg-blue-50 p-4 rounded-lg">
            <div>
              <p className="text-sm text-gray-600">Total Prescriptions</p>
              <p className="text-2xl font-bold text-blue-700">
                {diseaseWiseSummary.find((d) => d._id === selectedDisease).count}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">First Prescribed</p>
              <p className="font-semibold">
                {formatDate(
                  new Date(
                    diseaseWiseSummary.find((d) => d._id === selectedDisease)
                      .firstPrescribed
                  ),
                  'MMM dd, yyyy'
                )}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Prescribed</p>
              <p className="font-semibold">
                {formatDate(
                  new Date(
                    diseaseWiseSummary.find((d) => d._id === selectedDisease)
                      .lastPrescribed
                  ),
                  'MMM dd, yyyy'
                )}
              </p>
            </div>
          </div>
        )}

        {/* Prescriptions list for this disease */}
        <div className="space-y-4">
          {diseaseDetails.map((rx, idx) => (
            <div key={idx} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">Prescription #{diseaseDetails.length - idx}</h4>
                  <p className="text-sm text-gray-600">
                    Prescribed by: Dr. {rx.doctor?.name}
                  </p>
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  {formatDate(new Date(rx.issuedDate), 'MMM dd, yyyy')}
                </p>
              </div>

              {/* Medications */}
              {rx.medications && rx.medications.length > 0 && (
                <div className="mb-3">
                  <p className="font-semibold text-sm mb-2">Medications:</p>
                  <ul className="space-y-2">
                    {rx.medications.map((med, i) => (
                      <li key={i} className="text-sm text-gray-700 ml-4">
                        <strong>• {med.name}</strong>
                        {med.dosage && <span> - {med.dosage}</span>}
                        {med.frequency && <span> ({med.frequency})</span>}
                        {med.duration && <span> × {med.duration}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prescription text */}
              {rx.prescription && (
                <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                  <p className="text-sm text-gray-700">{rx.prescription}</p>
                </div>
              )}

              {/* Status */}
              <div className="mt-3">
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full ${
                    rx.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {rx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
