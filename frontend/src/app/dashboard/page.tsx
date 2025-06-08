"use client";
import FeelingDistributionChart from "@/components/feeling-distribution-chart";
import NumberCommentsChart from "../../components/number-comments-chart";
import FrequentCommentsTable from "@/components/frequent-comments-table";

function DashboardPage() {
  return (
    <section className="h-[calc(100vh-7rem)]">
      <div className="flex justify-center items-center">
        <NumberCommentsChart />
        <FeelingDistributionChart />
      </div>
      <div className="flex justify-center items-center p-5">
        <FrequentCommentsTable />
      </div>
    </section>
  );
}
export default DashboardPage;
