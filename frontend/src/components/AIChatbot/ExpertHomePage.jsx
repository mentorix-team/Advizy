import { ArrowRight } from "lucide-react";
import { AnimatedGridBackground } from "./components/AnimatedGridBackground";
import ExpertButton from "./ExpertButton";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Navbar from "../Home/components/Navbar";

export default function ExpertHomePage() {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (query) document.title = `Searching: ${query} | Advizy`;
    else document.title = "Find Your Mentor | Advizy";
  }, [query]);

  const handleUserQuery = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      ``;
      setExperts([]);
      setAiMessage("");

      const res = await axios.post(
        "http://localhost:5030/api/v1/fastapi/search-experts",
        {
          query,
        }
      );

      const data = res.data;

      console.log("data::", data);

      setExperts(data.experts || []);
      setAiMessage(data.aiRecommendation || "");
      setLoading(false);
    } catch (err) {
      console.error("Error:", err.message);
      setLoading(false);
    }
  };
  return (
    <div className="relative min-h-screen">
      <AnimatedGridBackground />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          {/* Main heading */}
          <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
            Find someone who's
            <br />
            <span className="text-primary">been there before</span>
          </h1>

          {/* Subheading */}
          <p className="mb-12 text-lg text-gray-400 md:text-xl">
            Connect with mentors who actually know what you're going through
          </p>

          {/* Search input */}
          <div className="mb-8 flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUserQuery()}
              placeholder='e.g. "I need a finance mentor for investment"'
              className="h-14 flex-1 px-4 py-3 border-gray-700 bg-[#1a1a1a] text-white placeholder:text-gray-500 rounded-lg outline-none focus:border-[#00d364] focus:ring-2 focus:ring-[#00d364]/30"
            />
            <ExpertButton onClick={handleUserQuery} />
          </div>

          {/* Try suggestions */}
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Try:</p>
            <div className="flex flex-wrap gap-3">
              <a href="/mentors">
                <button
                  variant="outline"
                  className="flex border border-gray-700 bg-transparent py-1 px-2 rounded-full  text-gray-300  hover:text-white"
                >
                  Help me get better at system design
                </button>
              </a>
              <a href="/mentors">
                <button
                  variant="outline"
                  className="flex border border-gray-700 bg-transparent py-1 px-2 rounded-full  text-gray-300  hover:text-white"
                >
                  Career advice for switching to product
                </button>
              </a>
              <a href="/mentors">
                <button
                  variant="outline"
                  className="flex border border-gray-700 bg-transparent py-1 px-2 rounded-full  text-gray-300  hover:text-white"
                >
                  Starting my first startup
                </button>
              </a>
              <a href="/mentors">
                <button
                  variant="outline"
                  className="flex border border-gray-700 bg-transparent py-1 px-2 rounded-full  text-gray-300 hover:text-white"
                >
                  Learning machine learning from scratch
                </button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
