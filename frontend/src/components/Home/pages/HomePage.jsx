import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import CategoryCard from "../components/CategoryCard";
import CategoryNav from "../components/CategoryNav";
import SearchModal from "../components/SearchModal";
import ExpertSection from "../components/ExpertSection";
import HowItWorksAlternate from "../components/HowItWorksAlternate";
import ReadyToShare from "../components/ReadyToShare";
import CTASection from "../components/CTASection";
import FAQSection from "../components/FAQSection";
import ContactForm from "../components/ContactForm";
import {
  Landmark,
  SquareActivity,
  Palette,
  Cpu,
  GraduationCap,
  Handshake,
} from "lucide-react";
import Footer from "../components/Footer";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { getAllExperts } from "@/Redux/Slices/expert.Slice";
// import Spinner from "@/LoadingSkeleton/Spinner";
import Spinner from "@/components/LoadingSkeleton/Spinner";
import { useNavigate } from "react-router-dom";

// Sample categories remain unchanged
const categories = [
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <Landmark className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Finance",
  },
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <SquareActivity className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Health",
  },
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <GraduationCap className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Career",
  },
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <Cpu className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Technology",
  },
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <Handshake className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Business",
  },
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <Palette className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Arts",
  },
];

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCategoryNav, setShowCategoryNav] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const { experts } = useSelector((state) => state.expert);
  const { isLoggedIn, loading, error } = useSelector((state) => state.auth);
  console.log(experts);
  // Local state for filtered experts
  const [fitnessExperts, setFitnessExperts] = useState([]);
  const [careerExperts, setCareerExperts] = useState([]);

  // Check expert mode from localStorage
  useEffect(() => {
    const expertData = localStorage.getItem("expertData");
    if (expertData) {
      setIsExpertMode(true);
    }
  }, []);

  const handleToggle = () => {
    setIsExpertMode(!isExpertMode);
  };

  const handleCategorySelect = (categoryValue) => {
    // Navigate to explore page with category parameter
    navigate(`/explore?category=${categoryValue}`);
    setIsModalOpen(false); // Close the modal
  };

  // Show category navigation on scroll
  useEffect(() => {
    const handleScroll = () => {
      const categoryGrid = document.getElementById("category-grid");
      if (categoryGrid) {
        const gridBottom = categoryGrid.getBoundingClientRect().bottom;
        setShowCategoryNav(gridBottom <= 64);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // useEffect to fetch Top Fitness Experts
  useEffect(() => {
    const queryParams = {
      domain: "health_and_fitness",
      // Add other filters if needed, for example: sorting, price range, etc.
    };

    // Clean up query parameters: remove keys with empty strings or empty arrays
    const cleanedQueryParams = Object.fromEntries(
      Object.entries(queryParams).filter(([key, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== "";
      })
    );

    // Dispatch getAllExperts action
    dispatch(getAllExperts(cleanedQueryParams))
      .unwrap()
      .then((data) => {
        setFitnessExperts(data.experts); // Adjust based on your API response shape
      })
      .catch((error) => {
        console.error("Error fetching fitness experts:", error);
      });
  }, [dispatch]);

  useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate("/"); // Redirect after login completes
    }
  }, [loading, isLoggedIn, navigate]);
  // useEffect to fetch Career Mentors
  useEffect(() => {
    const queryParams = {
      domain: "career_and_education",
      // Add additional filters as needed
    };

    const cleanedQueryParams = Object.fromEntries(
      Object.entries(queryParams).filter(([key, value]) => {
        if (Array.isArray(value)) {
          return value.length > 0;
        }
        return value !== "";
      })
    );

    dispatch(getAllExperts(cleanedQueryParams))
      .unwrap()
      .then((data) => {
        setCareerExperts(data.experts);
      })
      .catch((error) => {
        console.error("Error fetching career experts:", error);
      });
  }, [dispatch]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="mx-5 sm:mx-0">
        <Navbar
          onSearch={() => setIsModalOpen(true)}
          isExpertMode={isExpertMode}
          onToggleExpertMode={handleToggle}
        />
        <AnimatePresence>
          {showCategoryNav && <CategoryNav categories={categories} />}
        </AnimatePresence>

        {/* Grid Background with gradient fade */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 w-full pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(
                to bottom,
                transparent,
                transparent 30%,
                rgba(255, 255, 255, 0.3) 60%,
                rgba(255, 255, 255, 0.6) 80%,
                rgba(255, 255, 255, 0.9) 90%,
                white 100%
              ),
              linear-gradient(
                to right,
                rgba(229, 231, 235, 0.7) 1px,
                transparent 1px
              ),
              linear-gradient(
                to bottom,
                rgba(229, 231, 235, 0.7) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "100% 100%, 48px 48px, 48px 48px",
            height: "120vh",
          }}
        />

        {/* Hero Section */}
        <div id="hero-section" className="relative pt-16 w-full">
          <div className="relative max-w-[1920px] mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <motion.h1 className="text-6xl sm:text-7xl font-bold mb-6">
                  Find Your Perfect{" "}
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-[#169544]"
                  >
                    Expert
                  </motion.span>
                </motion.h1>

                <motion.p className="text-gray-600 text-xl mb-10 max-w-2xl mx-auto">
                  Get personalized guidance from top professionals and
                  <br />
                  Unlock your potential
                </motion.p>

                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-expert"
                >
                  Find an Expert
                </motion.button>
              </motion.div>

              <motion.div
                id="category-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-16 w-full max-w-7xl mx-auto"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  {categories.map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <CategoryCard {...category} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Rest of the sections */}
        <div className="relative w-full">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
            <div className="space-y-8 sm:space-y-12">
              {/* Top Fitness Experts Section */}
              <ExpertSection
                title="Top Fitness Experts"
                subtitle="Specialized guidance in fitness"
                experts={fitnessExperts}
                link="/explore"
              />

              {/* Career Mentors Section */}
              <div className="bg-[#F3F3F3] -mx-4 sm:-mx-6 px-4 sm:px-6 py-8 sm:py-12">
                <ExpertSection
                  title="Career Mentors"
                  subtitle="Professional career guidance"
                  experts={careerExperts}
                  link="/explore"
                />
              </div>
            </div>

            <HowItWorksAlternate />
            <ReadyToShare />
            <FAQSection />
            <ContactForm />
            <CTASection onOpenSearchModal={() => setIsModalOpen(true)} />
          </div>
        </div>
        <Footer />
      </div>
      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategorySelect={handleCategorySelect}
      />
    </div>
  );
}

export default HomePage;
