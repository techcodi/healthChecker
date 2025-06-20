import "chartjs-adapter-date-fns";
import supabase from "../supabase";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../ui/Spinner";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  TimeScale
);

function HealthRecoords() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["analystics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("symptom_checks")
        .select("symptoms, created_at");
      if (error) throw new Error(error.message);

      return data;
    },
  });

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;

  const totalChecks = data.length;

  const keywords = {};
  const dailyCounts = {};
  data.forEach(({ symptoms, created_at }) => {
    symptoms
      .toLowerCase()
      .split(/[\s,.\-]+/)
      .forEach((word) => {
        if (word.length > 3) {
          keywords[word] = (keywords[word] || 0) + 1;
        }
      });

    // Count per day
    const day = new Date(created_at).toISOString().split("T")[0];
    dailyCounts[day] = (dailyCounts[day] || 0) + 1;
  });

  const topKeywords = Object.entries(keywords)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const keywordChartData = {
    labels: topKeywords.map(([word]) => word),
    datasets: [
      {
        label: "Keyword Frequency",
        data: topKeywords.map(([, count]) => count),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  const trendData = {
    labels: Object.keys(dailyCounts).sort(),
    datasets: [
      {
        label: "Symptom Checks per Day",
        data: Object.keys(dailyCounts)
          .sort()
          .map((day) => dailyCounts[day]),
        fill: false,
        borderColor: "#4BC0C0",
        tension: 0.3,
      },
    ],
  };

  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <p>Total Symptom Checks: {totalChecks}</p>

      <div style={{ maxWidth: 600, margin: "2rem auto" }}>
        <h4>Top Reported Keywords</h4>
        <Bar data={keywordChartData} />

        <h4 style={{ marginTop: "2rem" }}>Symptom Check Trends</h4>
        <Line data={trendData} />
      </div>
    </div>
  );
}

export default HealthRecoords;
