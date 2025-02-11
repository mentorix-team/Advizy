import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import CategoryCard from '../components/CategoryCard';
import CategoryNav from '../components/CategoryNav';
import SearchModal from '../components/SearchModal';
import ExpertSection from '../components/ExpertSection';
import HowItWorksAlternate from '../components/HowItWorksAlternate';
import TestimonialsSection from '../components/TestimonialsSection';
import ReadyToShare from '../components/ReadyToShare';
import CTASection from '../components/CTASection';
import FAQSection from '../components/FAQSection';
import ContactForm from '../components/ContactForm';

const categories = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
        <path d="M12.6 18.55L12.5 18.65L12.39 18.55C7.64 14.24 4.5 11.39 4.5 8.5C4.5 6.5 6 5 8 5C9.54 5 11.04 6 11.57 7.36H13.43C13.96 6 15.46 5 17 5C19 5 20.5 6.5 20.5 8.5C20.5 11.39 17.36 14.24 12.6 18.55ZM17 3C15.26 3 13.59 3.81 12.5 5.08C11.41 3.81 9.74 3 8 3C4.92 3 2.5 5.41 2.5 8.5C2.5 12.27 5.9 15.36 11.05 20.03L12.5 21.35L13.95 20.03C19.1 15.36 22.5 12.27 22.5 8.5C22.5 5.41 20.08 3 17 3Z" fill="#169544"/>
      </svg>
    ),
    title: 'Finance'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="37" height="38" viewBox="0 0 37 38" fill="none">
        <g clipPath="url(#clip0_2780_2014)">
          <path fillRule="evenodd" clipRule="evenodd" d="M19.266 10.5733L20.0321 11.3393C20.54 11.8472 20.8253 12.5361 20.8253 13.2544C20.8253 13.9727 20.54 14.6616 20.0321 15.1695L13.9038 21.2977C13.3959 21.8056 12.707 22.091 11.9887 22.091C11.2704 22.091 10.5816 21.8056 10.0736 21.2977L9.30761 20.5317C8.7997 20.0238 8.51436 19.3349 8.51436 18.6166C8.51436 17.8983 8.7997 17.2095 9.30761 16.7015L15.4359 10.5733C15.9438 10.0654 16.6327 9.78003 17.351 9.78003C18.0692 9.78003 18.7581 10.0654 19.266 10.5733ZM18.5 13.6374L12.3717 19.7657C12.2702 19.8673 12.1324 19.9243 11.9887 19.9243C11.8451 19.9243 11.7073 19.8673 11.6057 19.7657L10.8397 18.9996C10.7381 18.8981 10.681 18.7603 10.681 18.6166C10.681 18.473 10.7381 18.3352 10.8397 18.2336L16.9679 12.1053C17.0695 12.0038 17.2073 11.9467 17.351 11.9467C17.4946 11.9467 17.6324 12.0038 17.734 12.1053L18.5 12.8714C18.6016 12.973 18.6587 13.1107 18.6587 13.2544C18.6587 13.3981 18.6016 13.5358 18.5 13.6374Z" fill="#169544"/>
          <path d="M15.4359 17.468L20.032 22.0642L18.5 23.5963L13.9038 19.0001L15.4359 17.468ZM17.7339 15.1699L22.3301 19.7661L20.7981 21.2982L16.2019 16.702L17.7339 15.1699Z" fill="#169544"/>
        </g>
        <defs>
          <clipPath id="clip0_2780_2014">
            <rect width="26" height="26" fill="white" transform="translate(18.5 0.615234) rotate(45)"/>
          </clipPath>
        </defs>
      </svg>
    ),
    title: 'Fitness'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="26" viewBox="0 0 25 26" fill="none">
        <path d="M15.625 8.83268V6.74935C15.625 6.19681 15.4055 5.66691 15.0148 5.27621C14.6241 4.88551 14.0942 4.66602 13.5417 4.66602H11.4583C10.9058 4.66602 10.3759 4.88551 9.98519 5.27621C9.59449 5.66691 9.375 6.19681 9.375 6.74935V8.83268M15.625 8.83268H19.7917C20.3442 8.83268 20.8741 9.05218 21.2648 9.44288C21.6555 9.83358 21.875 10.3635 21.875 10.916V19.2493C21.875 19.8019 21.6555 20.3318 21.2648 20.7225C20.8741 21.1132 20.3442 21.3327 19.7917 21.3327H7.29167M15.625 8.83268H9.375M9.375 8.83268H7.29167M7.29167 21.3327H5.20833C4.6558 21.3327 4.12589 21.1132 3.73519 20.7225C3.34449 20.3318 3.125 19.8019 3.125 19.2493V10.916C3.125 10.3635 3.34449 9.83358 3.73519 9.44288C4.12589 9.05218 4.6558 8.83268 5.20833 8.83268H7.29167M7.29167 21.3327V8.83268M17.7083 8.83268V21.3327" stroke="#169544" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Career'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
        <g clipPath="url(#clip0_2780_2026)">
          <path d="M19.5 4H5.5C4.39543 4 3.5 4.89543 3.5 6V15C3.5 16.1046 4.39543 17 5.5 17H19.5C20.6046 17 21.5 16.1046 21.5 15V6C21.5 4.89543 20.6046 4 19.5 4Z" stroke="#169544" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1.5 20H23.5" stroke="#169544" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs>
          <clipPath id="clip0_2780_2026">
            <rect width="24" height="24" fill="white" transform="translate(0.5)"/>
          </clipPath>
        </defs>
      </svg>
    ),
    title: 'Education'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
        <g clipPath="url(#clip0_2780_2026)">
          <path d="M19.5 4H5.5C4.39543 4 3.5 4.89543 3.5 6V15C3.5 16.1046 4.39543 17 5.5 17H19.5C20.6046 17 21.5 16.1046 21.5 15V6C21.5 4.89543 20.6046 4 19.5 4Z" stroke="#169544" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1.5 20H23.5" stroke="#169544" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs>
          <clipPath id="clip0_2780_2026">
            <rect width="24" height="24" fill="white" transform="translate(0.5)"/>
          </clipPath>
        </defs>
      </svg>
    ),
    title: 'Technology'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
        <g clipPath="url(#clip0_2780_2026)">
          <path d="M19.5 4H5.5C4.39543 4 3.5 4.89543 3.5 6V15C3.5 16.1046 4.39543 17 5.5 17H19.5C20.6046 17 21.5 16.1046 21.5 15V6C21.5 4.89543 20.6046 4 19.5 4Z" stroke="#169544" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M1.5 20H23.5" stroke="#169544" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
        <defs>
          <clipPath id="clip0_2780_2026">
            <rect width="24" height="24" fill="white" transform="translate(0.5)"/>
          </clipPath>
        </defs>
      </svg>
    ),
    title: 'Business'
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
        <path d="M12.6 18.55L12.5 18.65L12.39 18.55C7.64 14.24 4.5 11.39 4.5 8.5C4.5 6.5 6 5 8 5C9.54 5 11.04 6 11.57 7.36H13.43C13.96 6 15.46 5 17 5C19 5 20.5 6.5 20.5 8.5C20.5 11.39 17.36 14.24 12.6 18.55ZM17 3C15.26 3 13.59 3.81 12.5 5.08C11.41 3.81 9.74 3 8 3C4.92 3 2.5 5.41 2.5 8.5C2.5 12.27 5.9 15.36 11.05 20.03L12.5 21.35L13.95 20.03C19.1 15.36 22.5 12.27 22.5 8.5C22.5 5.41 20.08 3 17 3Z" fill="#169544"/>
      </svg>
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
      <Navbar onSearch={() => setIsModalOpen(true)} />
      
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
              <div className="grid grid-cols-7 gap-4">
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
          <div className="space-y-12 sm:space-y-16">
            <ExpertSection
              title="Top Fitness Experts"
              subtitle="Specialized guidance in fitness"
              experts={experts}
              link="/fitness-experts"
            />

            <div className="bg-[#F3F3F3] -mx-4 sm:-mx-6 px-4 sm:px-6 py-12">
              <ExpertSection
                title="Career Mentors"
                subtitle="Professional career guidance"
                experts={experts}
                link="/career-mentors"
              />
            </div>
          </div>

          <HowItWorksAlternate />
          <TestimonialsSection />
          <ReadyToShare />
          <FAQSection />
          <ContactForm />
          <CTASection onOpenSearchModal={() => setIsModalOpen(true)} />
        </div>
      </div>

      <SearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

export default HomePage;