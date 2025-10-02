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
import {
  BookOpen,
  Palette,
  Rocket,
  Laptop,
  Briefcase,
  Search,
  Award,
  User,
  Clock3,
} from "lucide-react";
import Footer from "../components/Footer";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { getAllExperts } from "@/Redux/Slices/expert.Slice";
import Spinner from "@/components/LoadingSkeleton/Spinner";
import { useNavigate, useLocation, replace } from "react-router-dom";

// Sample categories remain unchanged
const categories = [
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <Briefcase className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Carrer growth",
  },
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <Rocket className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Startup",
  },
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <Laptop className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Freelancing",
  },
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <BookOpen className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Upskilling",
  },
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <Search className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Job Hunting",
  },
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <Award className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Education",
  },
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <User className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Personal Branding",
  },
  {
    icon: (
      <div className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <Clock3 className="text-primary w-5 h-5" />
      </div>
    ),
    title: "Work Life Balance",
  },
];

// Mapping from category titles to domain values
const categoryToDomainMap = {
  "Carrer growth": "career_and_education",
  "Startup": "business_and_entrepreneurship",
  "Freelancing": "business_and_entrepreneurship",
  "Upskilling": "career_and_education",
  "Job Hunting": "career_and_education",
  "Education": "career_and_education",
  "Personal Branding": "personal_development",
  "Work Life Balance": "personal_development",
};

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCategoryNav, setShowCategoryNav] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const { experts, dataLoading } = useSelector((state) => state.expert);
  const { isLoggedIn, loading, error } = useSelector((state) => state.auth);

  // Track if we've already redirected to prevent multiple redirects
  const [hasRedirected, setHasRedirected] = useState(false);

  // Assuming `data` is the array you console.logged
  const careerExperts = Array.isArray(experts)
    ? experts
      .filter((expert) => expert?.credentials?.domain === "career_and_education") // Filter by domain
      .map((expert) => {
        return {
          id: expert._id,
          name: `${expert.firstName} ${expert.lastName}`,
          city: expert.city,
          image: expert?.profileImage?.secure_url || "", // Fallback if not available
          title: expert?.credentials?.professionalTitle?.[0] || "Mentor", // Fallback to "Mentor" if no title
          redirect_url: expert?.redirect_url,
          services: expert.credentials?.services || [], // Fallback to empty array if no services
          availability: expert.availability, // Include availability data
          reviews: expert.reviews || [],
          admin_approved_expert: expert?.admin_approved_expert || false,
          reviews: expert?.reviews || [], // Fallback to empty array if no reviews
        };
      })
    : [];

  useEffect(() => {
    const expertDataString = localStorage.getItem("expertData");
    if (expertDataString) {
      const expertData = JSON.parse(expertDataString);
      if (expertData.admin_approved_expert === true) {
        setIsExpertMode(true);
      } else {
        setIsExpertMode(false);
      }
    }
  }, []);

  const handleToggle = () => {
    setIsExpertMode(!isExpertMode);
  };

  // Handler for HomePage grid/buttons (uses domain mapping)
  const handleHomeCategorySelect = (category) => {

    const domainValue = categoryToDomainMap[category.title];
    if (domainValue) {
      navigate(`/explore?category=${domainValue}`);
      setIsModalOpen(false);
    } else {
      console.warn(`No domain mapping found for category: ${category.title}`);
    }
  };

  // Handler for SearchModal (uses category.value directly)
  const handleModalCategorySelect = (category) => {
    if (category.value) {
      navigate(`/explore?category=${category.value}`);
      setIsModalOpen(false);
    } else {
      console.warn(`No value found for category:`, category);
    }
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

  // Fixed redirect logic to prevent multiple history entries
  // useEffect(() => {
  //   if (!loading && isLoggedIn && location.pathname !== "/" && !hasRedirected) {
  //     setHasRedirected(true);
  //     navigate("/", { replace: true });
  //   }
  //   if (location.pathname === "/") {
  //     setHasRedirected(false);
  //   }
  // }, [loading, isLoggedIn, location.pathname, navigate, hasRedirected]);

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
        // setCareerExperts(data.experts);
      })
      .catch((error) => {
        console.error("Error fetching career experts:", error);
      });
  }, [dispatch]);

  if (loading) {
    return <Spinner />;
  }
  if (dataLoading) {
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
          {showCategoryNav && (
            <CategoryNav
              categories={categories}
              onCategorySelect={handleHomeCategorySelect}
            />
          )}
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
        <div id="hero-section" className="relative pt-8 sm:pt-16 w-full">
          <div className="relative max-w-[1920px] mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)]"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center w-full"
              >
                <motion.h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 sm:mt-4 leading-tight">
                  Find Your Right
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="text-[#169544] tracking-wide"
                  >
                    {" Mentor "}
                  </motion.span>
                </motion.h1>
                <motion.p className="text-gray-600 text-base sm:text-lg md:text-xl mb-6 sm:mb-10 max-w-2xl mx-auto px-2">
                  Your Growth, success, clarity start here. Find the right
                  guidance for your journey.
                </motion.p>
                <motion.button
                  onClick={() => setIsModalOpen(true)}
                  className="btn-expert"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Find a Mentor
                </motion.button>
              </motion.div>
              <motion.div
                id="category-grid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-10 sm:mt-16 w-full max-w-5xl mx-auto px-2 sm:px-4"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                  {categories.map((category, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleHomeCategorySelect(category)}
                      className="cursor-pointer"
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
            <div className="space-y-8 sm:space-y-12 mt-10">
              {/* Career Mentors Section */}
              <div className="-mx-4 sm:-mx-6 px-4 py-4 sm:px-6 sm:py-6">
                <ExpertSection
                  title="Career Mentors"
                  subtitle="Professional career guidance"
                  experts={careerExperts}
                  link="/explore?category=career_and_education"
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
        onCategorySelect={handleModalCategorySelect}
      />
    </div>
  );
}

export default HomePage;