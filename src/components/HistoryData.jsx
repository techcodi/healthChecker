import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import supabase from "../supabase";
import Spinner from "../ui/Spinner";
import { useState } from "react";
import "./HistoryData.css";
function HistoryData() {
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("symptom_checks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <Spinner />;
  if (error) return <p>Error: {error.message}</p>;

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const last7Days = new Date(now);
  last7Days.setDate(now.getDate() - 6);

  const filterData = data.filter((item) => {
    const itemDate = new Date(item.created_at);
    const itemDateStr = itemDate.toISOString().split("T")[0];
    if (filter === "today") return itemDateStr === today;
    if (filter === "yesterday")
      return itemDateStr === yesterday.toISOString().split("T")[0];
    if (filter === "last7days") return itemDate >= last7Days;
    return true;
  });
  return (
    <div className="history-data">
      <div className="filter-options">
        <h2>Symptom Check History</h2>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            Filter:
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ marginLeft: "0.5rem" }}
            >
              <option value="all">All</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7">Last 7 Days</option>
            </select>
          </label>
        </div>
      </div>
      <div>
        {filterData.length === 0 ? (
          <p>No past checks yet.</p>
        ) : (
          <ul>
            {filterData.map((item) => (
              <li
                key={item.id}
                style={{
                  marginBottom: "1.5rem",
                  border: "1px solid #ddd",
                  padding: "1rem",
                  borderRadius: "8px",
                }}
              >
                <p>
                  <strong>Symptoms:</strong> {item.symptoms}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(item.created_at).toLocaleString()}
                </p>

                {expandedId === item.id ? (
                  <>
                    <p>
                      <strong>Recommended Actions:</strong>
                    </p>
                    <ul>
                      {item.result.split("\n").map((line, idx) => (
                        <li key={idx}>{line}</li>
                      ))}
                    </ul>
                    <button
                      onClick={() => setExpandedId(null)}
                      style={buttonStyle}
                    >
                      Hide Details
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setExpandedId(item.id)}
                    style={buttonStyle}
                    className="view-details-button"
                  >
                    View Details
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const buttonStyle = {
  marginTop: "0.5rem",
  padding: "0.4rem 0.8rem",
  backgroundColor: "#007c91",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

export default HistoryData;
