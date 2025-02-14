import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import CategoryCard from '../components/CategoryCard';
import CategoryNav from '../components/CategoryNav';
import SearchModal from '../components/SearchModal';
import ExpertSection from '../components/ExpertSection';
import HowItWorksAlternate from '../components/HowItWorksAlternate';
// import TestimonialsSection from '../components/TestimonialsSection';
import ReadyToShare from '../components/ReadyToShare';
import CTASection from '../components/CTASection';
import FAQSection from '../components/FAQSection';
import ContactForm from '../components/ContactForm';
import { Landmark,SquareActivity,Palette, Cpu, GraduationCap, Handshake} from 'lucide-react';
import Footer from '../components/Footer';

const categories = [
  {
    icon: (
      <div class="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
        <Landmark className='text-primary w-5 h-5'/>
      </div>
    ),
    title: 'Finance'
  },
  {
    icon: (
      <div class="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
      <SquareActivity className='text-primary w-5 h-5'/>

    </div>
    ),
    title: 'Health'
  },
  {
    icon: (
      <div class="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
      <GraduationCap className='text-primary w-5 h-5'/>
    </div>
    ),
    title: 'Career'
  },
  {
    icon: (
      <div class="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
      <Cpu className='text-primary w-5 h-5'/>
    </div>
    ),
    title: 'Technology'
  },
  {
    icon: (
      <div class="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
      <Handshake className='text-primary w-5 h-5'/>
    </div>
    ),
    title: 'Business'
  },
  {
    icon: (
      <div class="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center">
      <Palette className='text-primary w-5 h-5'/>
    </div>
    ),
    title: 'Arts'
  }
];

const experts = [
  {
    name: "Brooklyn Simmons",
    title: "Startup Advisor & Entrepreneur",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&auto=format&fit=crop&q=80",
    rating: 4.5,
    reviews: 756,
    experience: "2+ yrs in industry",
    price: 1400,
    duration: 50,
    expertise: ["Relationship skills", "Mental Health", "Stress Management", "Stress"],
    nextSlot: "Tomorrow, 10:00 AM"
  },
  {
    name: "Leslie Alexander",
    title: "Business Coach & Mentor",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviews: 892,
    experience: "5+ yrs in industry",
    price: 1800,
    duration: 60,
    expertise: ["Leadership", "Business Strategy", "Career Development", "Communication"],
    nextSlot: "Today, 3:00 PM"
  },
  {
    name: "Cameron Wilson",
    title: "Life Coach & Wellness Expert",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&auto=format&fit=crop&q=80",
    rating: 4.7,
    reviews: 634,
    experience: "3+ yrs in industry",
    price: 1600,
    duration: 45,
    expertise: ["Life Coaching", "Wellness", "Personal Development", "Mindfulness"],
    nextSlot: "Tomorrow, 2:00 PM"
  },
  {
    name: "Jenny Wilson",
    title: "Fitness & Nutrition Coach",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviews: 945,
    experience: "4+ yrs in industry",
    price: 1500,
    duration: 55,
    expertise: ["Fitness Training", "Nutrition", "Weight Management", "Health"],
    nextSlot: "Today, 5:00 PM"
  }
];

function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCategoryNav, setShowCategoryNav] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);

  useEffect(() => {
    const expertData = localStorage.getItem('expertData');
    if (expertData) {
      setIsExpertMode(true);
    }
  }, []);

  const handleToggle = () => {
    setIsExpertMode(!isExpertMode);
  };

  useEffect(() => {
    const handleScroll = () => {
      const categoryGrid = document.getElementById('category-grid');
      if (categoryGrid) {
        const gridBottom = categoryGrid.getBoundingClientRect().bottom;
        setShowCategoryNav(gridBottom <= 64);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
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
          backgroundSize: '100% 100%, 48px 48px, 48px 48px',
          height: '120vh'
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
              <motion.h1 
                className="text-6xl sm:text-7xl font-bold mb-6"
              >
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
              
              <motion.p 
                className="text-gray-600 text-xl mb-10 max-w-2xl mx-auto"
              >
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
              className="mt-16 w-full max-w-7xl"
            >
              <div className="grid grid-cols-6 gap-4">
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
            <ExpertSection
              title="Top Fitness Experts"
              subtitle="Specialized guidance in fitness"
              experts={experts}
              link="/fitness-experts"
            />

            <div className="bg-[#F3F3F3] -mx-4 sm:-mx-6 px-4 sm:px-6 py-8 sm:py-12">
              <ExpertSection
                title="Career Mentors"
                subtitle="Professional career guidance"
                experts={experts}
                link="/career-mentors"
              />
            </div>
          </div>

          <HowItWorksAlternate />
          {/* <TestimonialsSection /> */}
          <ReadyToShare />
          <FAQSection />
          <ContactForm />
          <CTASection onOpenSearchModal={() => setIsModalOpen(true)} />
        </div>
      </div>
      <Footer />
      <SearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default HomePage;