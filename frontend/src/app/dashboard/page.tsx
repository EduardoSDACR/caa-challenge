"use client";
import FeelingDistributionChart from "@/components/feeling-distribution-chart";
import NumberCommentsChart from "../../components/number-comments-chart";

function DashboardPage() {
  return (
    <section className="h-[calc(100vh-7rem)] flex justify-center items-center">
      <NumberCommentsChart />
      <FeelingDistributionChart />
    </section>
  );
}
export default DashboardPage;
