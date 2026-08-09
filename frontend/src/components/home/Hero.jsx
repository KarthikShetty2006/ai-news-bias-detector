import { Search, Sparkles } from "lucide-react";
import Button from "../ui/Button";
import Container from "../layout/Container";

const topics = [
  "Artificial Intelligence",
  "Politics",
  "Technology",
  "Climate",
  "Finance",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-slate-50 border-b border-slate-200">
        <div className="absolute -left-40 -top-32 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

<div className="absolute right-0 top-20 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />
      <Container>
        <div className="max-w-4xl mx-auto py-24 text-center">

          <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700 text-sm font-medium">
            <Sparkles size={16} />
            AI Powered News Analysis
          </div>

          <h1 className="mt-8 text-5xl font-extrabold text-slate-900 leading-tight">
            Understand the Story
            <br />
            Behind Every Headline
          </h1>

          <p className="mt-6 text-lg text-slate-600">
            Detect political bias, sentiment, subjectivity and clickbait
            using AI before you trust a news article.
          </p>

          <div className="mt-10 flex bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">

            <input
              placeholder="Search a topic like Artificial Intelligence..."
              className="flex-1 px-6 py-5 outline-none text-lg"
            />

            <Button className="rounded-none px-8">
              <Search size={18} />
            </Button>

          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">

            {topics.map((topic) => (
              <button
                key={topic}
                className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm text-slate-700 hover:bg-blue-50 transition"
              >
                {topic}
              </button>
            ))}

          </div>

        </div>
      </Container>
    </section>
  );
}