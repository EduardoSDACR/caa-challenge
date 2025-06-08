"use client";
import NumberCommentsChart from "../../components/number-comments-chart";

function DashboardPage() {
  return (
    <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <NumberCommentsChart />
    </section>
  );
}
export default DashboardPage;
