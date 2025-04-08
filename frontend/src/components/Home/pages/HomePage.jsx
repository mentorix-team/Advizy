import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../components/Navbar";
import CategoryCard from "../components/CategoryCard";
import CategoryNav from "../components/CategoryNav";
import SearchModal from "../components/SearchModal";
import ExpertSection from "../components/ExpertSection";
import WhyAdvizySection from "../components/WhyAdvizySection";
import HowItWorksAlternate from "../components/HowItWorksAlternate";
import ReadyToShare from "../components/ReadyToShare";
import CTASection from "../components/CTASection";
import FAQSection from "../components/FAQSection";
import ContactForm from "../components/ContactForm";
import { IoBookOutline, ActivitySquare as LuBriefcase, Palette, IoBookOutline, LuRocket, FaLaptop } from "lucide-react";
import Footer from "../components/Footer";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { getAllExperts } from "@/Redux/Slices/expert.Slice";
import Spinner from "@/components/LoadingSkeleton/Spinner";
import { useNavigate } from "react-router-dom";

// Sample categories remain unchanged
const categories = [
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <LuBriefcase  className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Carrer growth",
  },
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <LuRocket  className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Startup",
  },
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center" >
        <FaLaptop  className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Freelancing",
  },
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <IoBookOutline  className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Upskilling",
  },
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <IoSearch  className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Job Hunting",
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
  const [fitnessExperts, setFitnessExperts] = useState([]);
  const [careerExperts, setCareerExperts] = useState([]);

  useEffect(() => {
    const expertData = localStorage.getItem("expertData");
    if (expertData) {
      setIsExpertMode(true);
    }
  }, []);

  const handleToggle = () => {
    setIsExpertMode(!isExpertMode);
  };

  const handleCategorySelect = (category) => {
    console.log('category selected: ', category)
    navigate(`/explore?category=${category.value}`);
    setIsModalOpen(false);
  };

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

  useEffect(() => {
    const queryParams = {
      domain: "health_and_fitness",
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
        setFitnessExperts(data.experts);
      })
      .catch((error) => {
        console.error("Error fetching fitness experts:", error);
      });
  }, [dispatch]);

  useEffect(() => {
    if (!loading && isLoggedIn) {
      navigate("/");
    }
  }, [loading, isLoggedIn, navigate]);

  useEffect(() => {
    const queryParams = {
      domain: "career_and_education",
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

              {/* Why Adviszy Section */}
              <WhyAdvizySection />
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