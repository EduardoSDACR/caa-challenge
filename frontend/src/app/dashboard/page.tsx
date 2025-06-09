"use client";
import FeelingDistributionChart from "@/components/feeling-distribution-chart";
import NumberCommentsChart from "../../components/number-comments-chart";
import FrequentCommentsTable from "@/components/frequent-comments-table";
import MostMentionedWordsWordCloud from "@/components/most-mentioned-words-wordcloud";

function DashboardPage() {
  return (
    <section className="h-[calc(100vh-7rem)]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full p-5">
        <div className="bg-white rounded-lg shadow p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Number of comments</h2>
          <div className="flex-1 min-h-0">
            <NumberCommentsChart />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Feelings Distribution</h2>
          <div className="flex-1 min-h-0">
            <FeelingDistributionChart />
          </div>
        </div>

        {/* Second Row */}
        <div className="bg-white rounded-lg shadow p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Frequent Comments</h2>
          <div className="flex-1 min-h-0 overflow-auto">
            <FrequentCommentsTable />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4 flex flex-col">
          <h2 className="text-lg font-semibold mb-2">Most Mentioned Words</h2>
          <div className="flex-1 min-h-0">
            <MostMentionedWordsWordCloud />
          </div>
        </div>
      </div>
    </section>
  );
}
export default DashboardPage;
