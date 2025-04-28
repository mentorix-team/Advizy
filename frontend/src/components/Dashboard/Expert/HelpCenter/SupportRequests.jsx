import { useEffect, useState } from "react";
import axios from "axios";
import SmallSpinner from "@/components/LoadingSkeleton/SmallSpinner";

function SupportRequests() {
  const [supportRequests, setSupportRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSupportRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await axios.get(
        "https://advizy.onrender.com/api/v1/expert/support-requests",
        { withCredentials: true }
      );

      console.log("Support requests data:", data);

      setSupportRequests(data.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch support requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupportRequests();
  }, []);

  if (loading) return <SmallSpinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Support Queries</h2>
      {supportRequests.length === 0 ? (
        <p>No support queries found.</p>
      ) : (
        <ul className="space-y-4">
          {supportRequests.map((request) => (
            <li
              key={request._id}
              className="border p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <p><strong>Name:</strong> {request.name}</p>
              <p><strong>Mobile:</strong> {request.mobile}</p>
              <p><strong>Problem:</strong> {request.problem}</p>
              <p className="text-sm text-gray-500">
                Submitted: {new Date(request.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SupportRequests;
