// TeacherApproval.jsx
import { useEffect, useState } from "react";
import Card from "../components/Card";

function TeacherApproval() {
  const [applications, setApplications] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('/api/admin/teacher-applications');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleStatusUpdate = async (requestId, teacherId, status) => {
    try {
      const response = await fetch(`/api/admin/teacher-applications/${requestId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          status,
          teacher_id: teacherId
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const result = await response.json();
      setMessage(result.message);
      // Refresh applications list
      fetchApplications();

      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setError(error.message);
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  if (!applications) {
    return <div className="p-4">Loading applications...</div>;
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      {message && (
      <div className={`border px-4 py-3 rounded ${
        message.includes('rejected') 
          ? 'bg-red-100 border-red-400 text-red-700'
          : 'bg-green-100 border-green-400 text-green-700'
      }`}>
        {message}
      </div>
    )}
      
      <div className="grid grid-cols-12 gap-4">
        <Card className="flex flex-col justify-between col-span-4 row-span-1">
          <div className="flex">
            <p className="text-lg font-semibold">Pending Applications</p>
          </div>
          <p className="text-right text-4xl font-bold">{applications.length}</p>
        </Card>
      </div>

      <Card className="flex-1">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold border-b pb-2">Teacher Applications</h2>
          
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Designation</th>
                  <th className="px-4 py-2 text-left">Application Date</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.request_id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">{app.name}</td>
                    <td className="px-4 py-3">{app.email}</td>
                    <td className="px-4 py-3">{app.designation}</td>
                    <td className="px-4 py-3">
                      {new Date(app.request_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(app.request_id, app.teacher_id, 'approved')}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(app.request_id, app.teacher_id, 'rejected')}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                        >
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default TeacherApproval;