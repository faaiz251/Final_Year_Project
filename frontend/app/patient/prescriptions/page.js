// 'use client';
// import PrescriptionHistory from '@/components/prescription/PrescriptionHistory';
// import { useEffect, useState } from 'react';

// export default function PatientPrescriptionsPage() {
//   const [userId, setUserId] = useState('');
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const id = localStorage.getItem('user');
//     setUserId(id);
//     setLoading(false);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-4xl mx-auto">
//         {loading ? (
//           <div className="text-center py-8">
//             <p className="text-gray-600">Loading...</p>
//           </div>
//         ) : (
//           <PrescriptionHistory patientId={userId} />
//         )}
//       </div>
//     </div>
//   );
// }


'use client';

import PrescriptionHistory from '@/components/prescription/PrescriptionHistory';
import { useEffect, useState } from 'react';

export default function PatientPrescriptionsPage() {
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUserId(parsedUser.id); // ✅ FIXED
      } catch (err) {
        console.error('Invalid user data in localStorage');
      }
    }

    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">User not found. Please login again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <PrescriptionHistory patientId={userId} />
      </div>
    </div>
  );
}