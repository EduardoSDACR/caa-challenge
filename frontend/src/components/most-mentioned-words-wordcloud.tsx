import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

type WordData = {
  word: string;
  count: number;
};

function MostMentionedWordsWordCloud() {
  const { data: session, status } = useSession();
  const [words, setWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;

    const apiURL = process.env.NEXT_PUBLIC_API_URL;

    const fetchWords = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${apiURL}comment-metrics/most-mentioned-words`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
          }
        );

        if (!response.ok) throw new Error("Failed to fetch words");

        const wordList = await response.json();

        setWords(wordList);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [status]);

  if (loading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow h-64 flex items-center justify-center">
        <p>Loading word cloud...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow h-64 flex items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg word-cloud-container p-8 flex flex-wrap justify-center gap-4">
      {words.map((word, i) => (
        <span
          key={`${word.word}-${i}`}
          className="inline-block m-1 hover:scale-110 transition-transform"
          style={{
            fontSize: `${word.count / 2}px`,
            opacity: 0.7 + (word.count / 48) * 0.3,
            transform: `rotate(${Math.random() * 20 - 10}deg)`,
          }}
        >
          {word.word}
        </span>
      ))}
    </div>
  );
}

export default MostMentionedWordsWordCloud;
