import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

type SentimentData = {
  name: string;
  value: number;
  color: string;
};

function FeelingDistributionChart() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<SentimentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSentimentData = async () => {
      if (status !== "authenticated") return;

      const apiURL = process.env.NEXT_PUBLIC_API_URL;

      try {
        setLoading(true);

        const response = await fetch(
          `${apiURL}comment-metrics/feeling-distribution`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch feelings data");

        const json = await response.json();
        const chartData = [
          {
            name: "Positive",
            value: json.positive,
            color: "#4ade80",
          },
          {
            name: "Neutral",
            value: json.neutral,
            color: "#60a5fa",
          },
          {
            name: "Negative",
            value: json.negative,
            color: "#f87171",
          },
        ];

        setData(chartData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSentimentData();
  }, [status]);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow h-80 flex items-center justify-center">
        <p>Loading sentiment data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow h-80 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`Count: ${value}`, ""]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default FeelingDistributionChart;
