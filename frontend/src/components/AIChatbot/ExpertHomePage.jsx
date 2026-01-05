import { ArrowRight } from "lucide-react";
import { AnimatedGridBackground } from "./components/AnimatedGridBackground";
import ExpertButton from "./ExpertButton";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import AiNavbar from "./components/AiNavbar";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ExpertHomePage() {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [experts, setExperts] = useState([]);
  const [aiMessage, setAiMessage] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);

  const navigate = useNavigate();

  const loadingSteps = [
    "Understanding your query...",
    "Finding perfect matches for you...",
    "Selecting top experts...",
    "Preparing recommendations..."
  ];

  const calculateAverageRating = (reviews) => {
    if (!reviews || !Array.isArray(reviews) || reviews.length === 0) {
      return 0;
    }
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getOneOnOnePricing = (services) => {
    if (!services || !Array.isArray(services)) return null;

    const oneOnOneService = services.find(service =>
      service.title === "One-on-One Mentoring" || service.title?.toLowerCase().includes("one-on-one")
    );

    if (!oneOnOneService) return null;

    // Get the hourly rate
    const hourlyRate = oneOnOneService.hourlyRate;

    // Get the lowest price from one_on_one array or use duration/price directly
    let startingPrice = null;
    if (oneOnOneService.one_on_one && oneOnOneService.one_on_one.length > 0) {
      const prices = oneOnOneService.one_on_one.map(slot => slot.price).filter(price => price > 0);
      startingPrice = Math.min(...prices);
    } else if (oneOnOneService.price) {
      startingPrice = oneOnOneService.price;
    }

    return {
      hourlyRate,
      startingPrice
    };
  };

  useEffect(() => {
    if (query) document.title = `Searching: ${query} | Advizy`;
    else document.title = "Find Your Mentor | Advizy";
  }, [query]);

  useEffect(() => {
    let interval;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep(prev => {
          if (prev < loadingSteps.length - 1) {
            return prev + 1;
          }
          return prev;
        });
      }, 1500); // Change step every 1.5 seconds
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading]);

  const handleUserQuery = async () => {
    if (!query.trim()) return;

    try {
      setLoading(true);
      setLoadingStep(0);
      setExperts([]);
      setAiMessage("");

      const res = await axios.post(
        "https://api.advizy.in/api/v1/fastapi/search-experts",
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
      <AiNavbar />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-4xl">
          {/* Main heading - Hide when loading */}
          {!loading && (
            <>
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
                  className="h-14 flex-1 px-4 py-3 border border-zinc-800 bg-[#1a1a1a] text-white placeholder:text-gray-500 rounded-lg outline-none focus:border-[#00d364] focus:ring-2 focus:ring-[#00d364]/30"
                />
                <ExpertButton onClick={handleUserQuery} />
              </div>

              {/* Try suggestions */}
              <div className="space-y-3">
                <p className="text-sm text-gray-500">Try:</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setQuery("Help me get better at system design")}
                    className="flex border border-zinc-800 bg-transparent py-1 px-2 rounded-full text-gray-300 hover:text-white hover:border-[#00d364] transition-colors cursor-pointer"
                  >
                    Help me get better at system design
                  </button>
                  <button
                    onClick={() => setQuery("Career advice for switching to product")}
                    className="flex border border-zinc-800 bg-transparent py-1 px-2 rounded-full text-gray-300 hover:text-white hover:border-[#00d364] transition-colors cursor-pointer"
                  >
                    Career advice for switching to product
                  </button>
                  <button
                    onClick={() => setQuery("Starting my first startup")}
                    className="flex border border-zinc-800 bg-transparent py-1 px-2 rounded-full text-gray-300 hover:text-white hover:border-[#00d364] transition-colors cursor-pointer"
                  >
                    Starting my first startup
                  </button>
                  <button
                    onClick={() => setQuery("Learning machine learning from scratch")}
                    className="flex border border-zinc-800 bg-transparent py-1 px-2 rounded-full text-gray-300 hover:text-white hover:border-[#00d364] transition-colors cursor-pointer"
                  >
                    Learning machine learning from scratch
                  </button>
                </div>
              </div>
            </>
          )}

          {/* API Response Display */}
          {loading && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#00d364] mb-4"></div>
              <p className="text-xl text-gray-300 mb-2">{loadingSteps[loadingStep]}</p>
              <div className="flex justify-center gap-2 mt-4">
                {loadingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${index <= loadingStep ? 'bg-[#00d364]' : 'bg-gray-600'
                      }`}
                  />
                ))}
              </div>
            </div>
          )}

          {aiMessage && (
            <div className="mt-8 p-6 bg-[#1a1a1a] border border-zinc-800 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3">AI Recommendation</h3>
              <p className="text-gray-300 leading-relaxed">{aiMessage}</p>
            </div>
          )}

          {experts.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-white mb-4">Recommended Experts</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {experts.map((expert, index) => (
                  <div key={index} className="p-4 bg-[#1a1a1a] border border-zinc-800 rounded-lg hover:border-green-400/20 transition-colors">
                    <div className="flex items-center gap-3 mb-3">
                      {expert.profileImage ? (
                        <img
                          src={expert?.profileImage?.secure_url}
                          alt={`${expert.firstName} ${expert.lastName} image`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {expert.name?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-white">{`${expert.firstName} ${expert.lastName}` || 'Unknown Expert'}</h4>
                        <p className="text-sm text-gray-400">{`${expert?.credentials?.professionalTitle}` || 'No domain specified'}</p>
                      </div>
                    </div>
                    {expert?.bio && (
                      <p className="text-sm text-gray-300 mb-3 line-clamp-2">{expert?.bio}</p>
                    )}
                    {expert?.credentials?.niche && expert?.credentials?.niche.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {expert?.credentials?.niche.slice(0, 3).map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-2 py-1 bg-[#00d364]/20 text-[#00d364] text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <hr class="my-4 h-px bg-zinc-800 border-0 " />

                    {/* Pricing Display */}
                    {(() => {
                      const pricing = getOneOnOnePricing(expert?.credentials?.services);
                      return pricing ? (
                        <div className="mb-3">
                          <div className="flex items-center justify-between">
                            {/* <span className="text-sm text-gray-400">One-on-One Mentoring</span> */}
                            <div className="flex items-center gap-2 mb-3">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium text-white">
                                  {calculateAverageRating(expert.reviews)}
                                </span>
                              </div>
                              {expert.reviews && expert.reviews.length > 0 && (
                                <span className="text-xs text-gray-400">
                                  ({expert.reviews.length} reviews)
                                </span>
                              )}
                            </div>
                            <div className="text-right">
                              {pricing.hourlyRate && pricing.hourlyRate > 0 && (
                                <div className="text-sm font-medium text-white">
                                  ₹{pricing.hourlyRate}/hour
                                </div>
                              )}
                              {pricing.startingPrice && pricing.startingPrice !== pricing.hourlyRate && (
                                <div className="text-xs text-gray-400">
                                  From ₹{pricing.startingPrice}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })()}

                    <a
                      href={`/expert/${expert?.redirect_url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2 px-4 bg-[#00d364] text-black font-semibold rounded-lg hover:bg-[#00d364]/90 transition-colors text-center"
                    >
                      View Profile
                    </a>


                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}