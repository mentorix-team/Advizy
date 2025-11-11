import { useEffect, useState } from "react";
import axios from "axios";
import SmallSpinner from "@/components/LoadingSkeleton/SmallSpinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchSupportQueries } from "@/Redux/Slices/supportQueriesSlice";

function SupportRequests() {
  const [supportRequests, setSupportRequests] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");

  const dispatch = useDispatch();
  const { queries, loading, error } = useSelector(
    (state) => state.supportQueries
  );

  // console.log(queries)

  useEffect(() => {
    dispatch(fetchSupportQueries());
  }, [dispatch]);

  // const fetchSupportRequests = async () => {
  //   try {
  //     setLoading(true);
  //     setError("");

  //     const { data } = await axios.get(
  //       "http://localhost:5030/api/v1/expert/support-requests",
  //       { withCredentials: true }
  //     );

  //     console.log("Support requests data:", data);

  //     setSupportRequests(data.data);
  //   } catch (err) {
  //     setError(err.response?.data?.error || "Failed to fetch support requests");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  if (loading) return <SmallSpinner />;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Support Queries</h2>
      {queries.length === 0 ? (
        <p>No support queries found.</p>
      ) : (
        <ul className="space-y-4">
          {queries.map((query) => (
            <li
              key={query._id}
              className="border p-4 rounded-lg shadow-md hover:shadow-lg transition"
            >
              <p>
                <strong>Name:</strong> {query.name}
              </p>
              <p>
                <strong>Mobile:</strong> {query.mobile}
              </p>
              <p>
                <strong>Problem:</strong> {query.problem}
              </p>
              <p className="text-sm text-gray-500">
                Submitted: {new Date(query.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SupportRequests;
