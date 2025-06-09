import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type CommentData = {
  date: string;
  count: number;
};

function NumberCommentsChart() {
  const { data: session, status } = useSession();
  const [timeRange, setTimeRange] = useState<"day" | "week">("day");
  const [dailyData, setDailyData] = useState<CommentData[]>([]);
  const [weeklyData, setWeeklyData] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (status !== "authenticated") return;

      const apiURL = process.env.NEXT_PUBLIC_API_URL;

      try {
        setLoading(true);

        const dailyResponse = await fetch(
          `${apiURL}comment-metrics/number-of-comments?mode=days`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );

        if (!dailyResponse.ok) throw new Error("Failed to fetch daily data");

        const dailyJson = await dailyResponse.json();
        setDailyData(dailyJson);

        const weeklyResponse = await fetch(
          `${apiURL}comment-metrics/number-of-comments?mode=weeks`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );
        if (!weeklyResponse.ok) throw new Error("Failed to fetch weekly data");

        const weeklyJson = await weeklyResponse.json();
        setWeeklyData(weeklyJson);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [status]);

  const transformedDailyData = dailyData
    .map((item) => ({
      name: new Date(item.date).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      value: item.count,
    }))
    .reverse();

  const transformedWeeklyData = weeklyData
    .map((item) => ({
      name: `Week ${item.date}`,
      value: item.count,
    }))
    .reverse();

  const data =
    timeRange === "day" ? transformedDailyData : transformedWeeklyData;

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow h-80 flex items-center justify-center">
        <p>Loading chart data...</p>
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          {timeRange === "day" ? "Daily Metrics" : "Weekly Metrics"}
        </h2>
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            onClick={() => setTimeRange("day")}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              timeRange === "day"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Days
          </button>
          <button
            onClick={() => setTimeRange("week")}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              timeRange === "week"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Weeks
          </button>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="value"
              fill={timeRange === "day" ? "#4BC0C0" : "#9966FF"}
              name={timeRange === "day" ? "Daily Value" : "Weekly Value"}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default NumberCommentsChart;
