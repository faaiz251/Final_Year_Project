'use client';
import { useState, useEffect } from 'react';
import { treatmentAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { formatDate } from 'date-fns';

export default function TreatmentSection({ appointmentId, userRole, appointment }) {
  const [treatment, setTreatment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    treatmentName: '',
    treatmentDurationDays: '',
    treatmentNotes: '',
  });

  useEffect(() => {
    if (appointment?.treatment?.treatmentStatus !== 'not-started') {
      fetchTreatment();
    }
  }, [appointmentId]);

  const fetchTreatment = async () => {
    try {
      const data = await treatmentAPI.getTreatment(appointmentId);
      setTreatment(data.appointment);
    } catch (error) {
      console.error('Failed to fetch treatment:', error);
    }
  };

  const handleStartTreatment = async (e) => {
    e.preventDefault();

    if (!formData.treatmentName || !formData.treatmentDurationDays) {
      toast.error('Treatment name and duration are required');
      return;
    }

    setLoading(true);
    try {
      const data = await treatmentAPI.startTreatment(appointmentId, {
        treatmentName: formData.treatmentName,
        treatmentDurationDays: parseInt(formData.treatmentDurationDays),
        treatmentNotes: formData.treatmentNotes,
      });
      setTreatment(data.appointment);
      setShowForm(false);
      setFormData({ treatmentName: '', treatmentDurationDays: '', treatmentNotes: '' });
      toast.success('Treatment started successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to start treatment');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const data = await treatmentAPI.updateStatus(appointmentId, newStatus);
      setTreatment(data.appointment);
      toast.success('Treatment status updated');
    } catch (error) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const getProgressPercentage = () => {
    if (!treatment?.treatment) return 0;
    const start = new Date(treatment.treatment.treatmentStartDate);
    const end = new Date(treatment.treatment.treatmentEndDate);
    const today = new Date();
    const total = end - start;
    const elapsed = today - start;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const getRemainingDaysColor = (days) => {
    if (days > 30) return 'text-green-600';
    if (days > 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  // If user is doctor and no treatment started, show form
  if (userRole === 'doctor' && (!treatment?.treatment || treatment.treatment.treatmentStatus === 'not-started')) {
    return (
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Treatment Plan</h2>

        {!showForm ? (
          <button
            onClick={() => setShowForm(true)}
            disabled={!appointment?.isCompleted}
            className={`px-4 py-2 rounded-lg font-semibold ${
              appointment?.isCompleted
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {appointment?.isCompleted
              ? 'Start Treatment Plan'
              : 'Complete appointment first'}
          </button>
        ) : (
          <form onSubmit={handleStartTreatment} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Treatment Name</label>
              <input
                type="text"
                value={formData.treatmentName}
                onChange={(e) =>
                  setFormData({ ...formData, treatmentName: e.target.value })
                }
                placeholder="E.g., Diabetes Management"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Duration (Days)</label>
              <input
                type="number"
                value={formData.treatmentDurationDays}
                onChange={(e) =>
                  setFormData({ ...formData, treatmentDurationDays: e.target.value })
                }
                placeholder="30"
                min="1"
                max="730"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea
                value={formData.treatmentNotes}
                onChange={(e) =>
                  setFormData({ ...formData, treatmentNotes: e.target.value })
                }
                placeholder="Treatment instructions and notes..."
                className="w-full border rounded-lg px-4 py-2 resize-none"
                rows="4"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Starting...' : 'Start Treatment'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    );
  }

  // Show treatment details if treatment exists
  if (treatment?.treatment && treatment.treatment.treatmentStatus !== 'not-started') {
    const treatmentData = treatment.treatment;
    const remainingDays = treatment.remainingDays || 0;
    const progressPercent = getProgressPercentage();

    return (
      <div className="bg-white border rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">{treatmentData.treatmentName}</h2>
            <p className="text-gray-600">Active Treatment Plan</p>
          </div>
          {userRole === 'doctor' && (
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange('completed')}
                disabled={treatmentData.treatmentStatus === 'completed'}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                Complete
              </button>
              <button
                onClick={() => handleStatusChange('paused')}
                disabled={treatmentData.treatmentStatus === 'paused'}
                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
              >
                Pause
              </button>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              treatmentData.treatmentStatus === 'active'
                ? 'bg-blue-100 text-blue-700'
                : treatmentData.treatmentStatus === 'completed'
                ? 'bg-green-100 text-green-700'
                : 'bg-yellow-100 text-yellow-700'
            }`}
          >
            {treatmentData.treatmentStatus.toUpperCase()}
          </span>
        </div>

        {/* Timeline */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Start Date</p>
            <p className="font-semibold">
              {formatDate(new Date(treatmentData.treatmentStartDate), 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">End Date</p>
            <p className="font-semibold">
              {formatDate(new Date(treatmentData.treatmentEndDate), 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Remaining Days</p>
            <p className={`font-semibold ${getRemainingDaysColor(remainingDays)}`}>
              {remainingDays} days
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <p className="text-sm font-medium">Progress</p>
            <p className="text-sm text-gray-600">{Math.round(progressPercent)}%</p>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Notes */}
        {treatmentData.treatmentNotes && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-semibold text-sm mb-2">Treatment Notes</p>
            <p className="text-gray-700">{treatmentData.treatmentNotes}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
