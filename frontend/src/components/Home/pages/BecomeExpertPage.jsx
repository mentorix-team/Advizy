import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import Navbar from "../components/Navbar";
// import { useAutoScroll } from '../hooks/useAutoScroll';
import ExpertFAQ from "../components/ExpertFAQ";
import PricingSection from "../components/PricingSection";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import SearchModal from "../components/SearchModal";
import { UserPlus, Users, Sparkles, LightbulbIcon } from 'lucide-react';
const features = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 sm:w-8 sm:h-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "Help Others Grow",
    description:
      "Your journey can inspire and shape someone's future. Share your knowledge and make a lasting impact  ",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 sm:w-8 sm:h-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Work on Your Terms",
    description:
      "Set your own schedule and rates. Control when and how you work. Our flexible system empowers you.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 sm:w-8 sm:h-8"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
        />
      </svg>
    ),
    title: "Expand your Influence",
    description:
      "Reach individuals across the world who need your insights. build your personal brand globally.",
  },
];

const keyFeatures = [
  {
    id: "01",
    title: "1:1 Expert Sessions",
    content:
      "Deliver personalized guidance through seamless one-on-one sessions, tailored to each client's unique needs.",
    image: "https://i.postimg.cc/yYjLYCw7/Frame-1615.png",
  },
  {
    id: "02",
    title: "Diverse Service Options",
    content:
      "Offer consultations, coaching, and specialized services, giving clients the flexibility to choose what suits them best.",
    image: "https://i.postimg.cc/CKsGJGSS/img2.png",
  },
  {
    id: "03",
    title: "Complete Schedule Control",
    content:
      "Set your availability, manage your time, and work on your own terms without restrictions.",
    image: "https://i.postimg.cc/59DVqGg5/img3.png",
  },
  {
    id: "04",
    title: "Effortless Client Management",
    content:
      "Streamline bookings, track sessions, and stay organized with an intuitive scheduling system.",
    image: "https://i.postimg.cc/Njkvt0cb/img4.png",
  },
  {
    id: "05",
    title: "Secure & Hassle-Free Payments",
    content:
      "Get paid seamlessly through multiple trusted payment gateways, ensuring reliability and convenience.",
    image: "https://i.postimg.cc/yYjLYCw7/Frame-1615.png",
  },
];

const testimonials = [
  {
    rating: 5,
    text: "Advizy has transformed my consulting business. I now work with clients from different countries, and the platform is incredibly easy to use.",
    name: "Dr. Priya S.",
    title: "Career Consultant",
  },
  {
    rating: 5,
    text: "The dashboard makes managing sessions a breeze. Plus, payments are always on time!",
    name: "Alex T.",
    title: "Fitness Coach",
  },
  {
    rating: 5,
    text: "I love how Advizy values both experts and clients. It's a win-win for everyone.",
    name: "Sarah M.",
    title: "Relationship Advisor",
  },
];

const steps = [
  {
    number: "1",
    title: "Create Your Profile",
    description:
      "Showcase your expertise, set your rates, and define your services. It only takes a few minutes to get started.",
  },
  {
    number: "2",
    title: "Set Your Availability",
    description:
      "Choose when and how you want to work. Our flexible scheduling tools put you in control of your time.",
  },
  {
    number: "3",
    title: "Start Earning",
    description:
      "Focus on sharing your expertise while we handle everything else. Get paid for your valuable knowledge and time.",
  },
];

const Image3D = ({ src, alt }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = ((e.clientX - centerX) / rect.width) * 100;
    const y = ((e.clientY - centerY) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={imageRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
      className="relative w-full h-full"
    >
      <motion.div
        className="absolute inset-0 bg-black/10 rounded-2xl blur-xl"
        style={{
          rotateX: -mousePosition.y * 0.1,
          rotateY: mousePosition.x * 0.1,
          translateZ: "-50px",
        }}
      />

      <motion.div
        className="relative w-full h-full"
        animate={{
          rotateX: -mousePosition.y * 0.1,
          rotateY: mousePosition.x * 0.1,
          translateZ: "50px",
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.5,
        }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <motion.img
          src={src}
          alt={alt}
          className="w-full h-full object-contain"
          loading="lazy"
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          animate={{
            x: ["100%", "-100%"],
            opacity: [0, 0.3, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />

        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50"
          style={{
            rotateX: mousePosition.y * 0.2,
            rotateY: -mousePosition.x * 0.2,
            translateZ: "25px",
          }}
        />
      </motion.div>
    </motion.div>
  );
};

const BecomeExpertPage = () => {
  const [activeFeature, setActiveFeature] = useState(keyFeatures[0]);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // const [autoScrollPaused, setAutoScrollPaused] = useState(false);
  // const autoScrollIntervalRef = useRef(null);
  // const [clonedTestimonials, setClonedTestimonials] = useState([]);
  // const { scrollRef, handleMouseEnter, handleMouseLeave } = useAutoScroll(0.5);
  const imageControls = useAnimation();
  const navigate = useNavigate();

  const handleExpertOnboarding = () => {
    const expertData = localStorage.getItem('expertData');
  
    if (!expertData) {
      navigate("/expert-onboarding");
    } else {
      alert("You're already an expert! Switch to expert mode.");
    }
  };
  

  // useEffect(() => {
  // setClonedTestimonials([...testimonials, ...testimonials, ...testimonials]);
  // }, []);

  // const startAutoScroll = (startIndex = 0) => {
  //   if (autoScrollIntervalRef.current) {
  //     clearInterval(autoScrollIntervalRef.current);
  //   }

  //   let currentIndex = startIndex;

  //   autoScrollIntervalRef.current = setInterval(() => {
  //     if (!autoScrollPaused) {
  //       currentIndex = (currentIndex + 1) % keyFeatures.length;
  //       handleFeatureChange(keyFeatures[currentIndex]);
  //     }
  //   }, 3000);
  // };

  // useEffect(() => {
  //   startAutoScroll();
  //   return () => {
  //     if (autoScrollIntervalRef.current) {
  //       clearInterval(autoScrollIntervalRef.current);
  //     }
  //   };
  // }, [autoScrollPaused]);

  const handleFeatureHover = async (feature) => {
    if (feature.id !== activeFeature.id) {
      setAutoScrollPaused(true);
      await imageControls.start({
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 },
      });
      handleFeatureChange(feature);
      const currentIndex = keyFeatures.findIndex((f) => f.id === feature.id);
      startAutoScroll(currentIndex);
    }
  };

  const handleFeatureLeave = () => {
    setAutoScrollPaused(false);
  };

  const handleFeatureChange = async (feature) => {
    setActiveFeature(feature);
    await imageControls.start({
      opacity: 1,
      scale: 1,
      transition: { duration: 0.2 },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onSearch={() => setIsModalOpen(true)}
        isExpertMode={isExpertMode}
      />

      {/* Hero Section */}
      <div className="pt-20 sm:pt-24 md:pt-32 pb-8 sm:pb-12 md:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <span className="inline-block px-4 py-1.5 bg-green-50 text-primary rounded-full text-sm font-medium mb-6 sm:mb-8">
            Your Knowledge. Your Time. Your Earnings.
          </span>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 sm:mb-8">
            Turn Your Expertise <br className="hidden sm:block" />
            Into Opportunity
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-0 mb-8 sm:mb-10">
            Join Advizy as a mentor
            <br className="block sm:hidden" />
            and be a part of mentors that makes
            <br className="block" />
            quality guidance accessible to all.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleExpertOnboarding}
              className="btn-expert w-full sm:w-auto"
            >
              Share your expertise
            </button>
          </div>
        </motion.div>
      </div>

       {/* Vision Section */}
       <div className="py-12 sm:py-16 bg-[#F9FDF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="w-12 h-12 mx-auto mb-4 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <LightbulbIcon className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Our Vision for Mentorship
            </h2>
            <p className="text-gray-600 mt-4">
              At Advizy, we believe mentorship is more than just advice—it's a movement to democratize knowledge and create equal opportunities for growth.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                <UserPlus className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">A Social Cause</h3>
              <p className="text-gray-600 mt-2">
                We're building a platform where knowledge sharing is valued as a social good. Our mentors join not just to earn, but to make a meaningful impact on others' lives.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Community-Driven</h3>
              <p className="text-gray-600 mt-2">
                We're creating a supportive community where mentors collaborate, share insights, and grow together while helping others achieve their goals.
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg">Transformative Impact</h3>
              <p className="text-gray-600 mt-2">
                We measure success by the lives changed through our platform. Every mentor has the opportunity to create ripple effects that extend far beyond individual sessions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expertise Section */}
      <div className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
                alt="Mentorship meeting"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
                Why We Need Your Expertise
              </h2>
              <p className="text-gray-600 mt-4">
                In a world where quality guidance is often inaccessible or unaffordable, we're creating a platform that connects people with the right mentors at the right time. Your knowledge and experience can be the catalyst that helps someone overcome obstacles, discover new opportunities, and achieve their full potential.
              </p>
              <p className="text-gray-600 mt-4">
                By joining Advizy as a mentor, you're not just sharing your expertise—you're helping build a more equitable world where everyone has access to the guidance they need to succeed.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Advizy */}
      <div className="py-12 sm:py-16 bg-[#F9FDF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Why Become A Mentor
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.1 }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                  borderColor: "#169544",
                  transition: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                    mass: 1,
                  },
                }}
                className="relative bg-white p-6 sm:p-8 rounded-xl shadow-sm border-2 border-transparent transition-all duration-300 overflow-hidden"
              >
                <motion.div
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-lg flex items-center justify-center text-primary mb-4 sm:mb-6"
                  whileHover={{
                    scale: 1.1,
                    rotate: 5,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 10,
                    },
                  }}
                >
                  {feature.icon}
                </motion.div>
                <motion.h3
                  className="text-lg sm:text-xl font-bold mb-2 sm:mb-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p
                  className="text-sm sm:text-base text-gray-600"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  {feature.description}
                </motion.p>

                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                  animate={{
                    x: ["100%", "-100%"],
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 3,
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Key Features
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="lg:order-2 relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.id}
                  className="absolute inset-0 flex items-center justify-center"
                  animate={imageControls}
                  initial={{ opacity: 1, scale: 1 }}
                >
                  <motion.img
                    src={activeFeature.image}
                    alt={activeFeature.title}
                    className="w-full h-full object-contain p-4 sm:p-6 md:p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                    animate={{
                      x: ["100%", "-100%"],
                      opacity: [0, 0.1, 0],
                    }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="space-y-4 sm:space-y-6 lg:order-1">
              {keyFeatures.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => handleFeatureHover(feature)}
                  onMouseLeave={handleFeatureLeave}
                  className={`border border-gray-100 rounded-lg p-4 sm:p-6 cursor-pointer transition-all duration-300
                    ${
                      activeFeature.id === feature.id
                        ? "border-primary bg-green-50 shadow-md transform -translate-x-2"
                        : "hover:border-gray-200 hover:shadow-sm hover:-translate-x-1"
                    }`}
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span
                      className={`text-xs sm:text-sm font-medium transition-colors duration-300
                      ${
                        activeFeature.id === feature.id
                          ? "text-primary"
                          : "text-gray-400"
                      }`}
                    >
                      {feature.id}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="mt-2 text-sm sm:text-base text-gray-600">
                    {feature.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      {/* <div className="py-12 sm:py-16 bg-[#F9FDF9] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">What Our Experts Say</h2>
          </motion.div>

          <div 
            ref={scrollRef}
            className="flex gap-4 sm:gap-6 md:gap-8 overflow-x-hidden pb-8"
            style={{ 
              paddingTop: '20px',
              marginTop: '-20px'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {clonedTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2 }}
                whileHover={{ 
                  scale: 1.08,
                  y: -10,
                  borderColor: '#169544',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                  transition: {
                    type: "spring",
                    stiffness: 200,
                    damping: 25,
                    duration: 0.2
                  }
                }}
                className="flex-shrink-0 w-[280px] sm:w-[320px] md:w-[400px] bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-transparent transform-gpu z-10"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm sm:text-base text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-sm sm:text-base">{testimonial.name}</p>
                  <p className="text-gray-500 text-xs sm:text-sm">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div> */}

      {/* Get Started Steps Section */}
      <div className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl font-bold">How It Works</h2>
          </motion.div>

          <div className="space-y-8 sm:space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-4 sm:gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#169544] text-white flex items-center justify-center text-base sm:text-lg font-medium">
                    {step.number}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center text-2xl sm:text-3xl font-bold text-[#169544] mt-12 sm:mt-16"
            >
              You bring the knowledge. We take care of the rest.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl font-bold text-[#1D2939] mb-4"
            >
              Simple, Transparent Pricing
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-gray-600"
            >
              No hidden fees. No complicated rules. Just a smarter way to grow
              together.
            </motion.p>
          </div>

          <PricingSection />
        </div>
      </div>

      {/* FAQ Section */}
      <ExpertFAQ />

      {/* Ready to Share Section */}
      <div className="py-16 sm:py-20 md:py-24 bg-[#F9FDF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6"
            >
              Join your Commmunity of Changemakers
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 md:mb-10"
            >
              Join Advizy today and become part of a global community of
              professionals making an impact!
            </motion.p>

            <motion.button
              onClick={handleExpertOnboarding}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-expert inline-flex items-center gap-2"
            >
              Start your journey
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </div>
      <Footer />
      <SearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </div>
  );
};

export default BecomeExpertPage;
