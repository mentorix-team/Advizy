import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';

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
        className="relative w-full h-full "
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
          className="w-full h-full object-cover"
          loading="lazy"
          animate={{
            y: [0, -10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
          animate={{
            x: ['100%', '-100%'],
            opacity: [0, 0.3, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 3
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

const VisionCard = ({ icon, title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative bg-white rounded-lg p-8 shadow-sm border-2 border-transparent overflow-hidden"
      whileHover={{ 
        scale: 1.05, 
        y: -10,
        borderColor: '#169544',
        transition: {
          duration: 0.3,
          ease: "easeOut"
        }
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Top right quarter circle */}
      <motion.div 
        className="absolute -top-16 -right-16 w-32 h-32"
        initial={{ scale: 1, opacity: 0.3 }}
        animate={{
          scale: isHovered ? 2.1 : 1,
          opacity: isHovered ? 0.4 : 0.3
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut"
        }}
        style={{
          background: '#E8F5E9',
          borderBottomLeftRadius: '100%'
        }}
      />

      <div className="relative z-10">
        <motion.div 
          className="w-12 h-12 bg-[#E8F5E9] rounded-full flex items-center justify-center mb-6 text-primary"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-bold mb-4 text-[#1D1F1D]">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

const MissionSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const x = ((e.clientX - centerX) / rect.width) * 20;
    const y = ((e.clientY - centerY) / rect.height) * 20;
    
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div className="py-24 bg-[#F9FDF9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold">Our Mission</h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative perspective-1000"
          >
            <motion.div
              className="relative aspect-[4/3] "
              animate={{
                rotateX: -mousePosition.y * 0.5,
                rotateY: mousePosition.x * 0.5,
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
                src="https://i.postimg.cc/BZH2kYSV/13746503-5340735.png"
                alt="Mentorix Mission"
                className="w-full h-full object-cover"
                loading="lazy"
                animate={{
                  scale: [1, 1.02, 1],
                  translateZ: ["0px", "20px", "0px"]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                animate={{
                  x: ['100%', '-100%'],
                  opacity: [0, 0.3, 0]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 3
                }}
              />

              {/* 3D lighting effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent opacity-50"
                style={{
                  rotateX: mousePosition.y * 0.2,
                  rotateY: -mousePosition.x * 0.2,
                  translateZ: "25px",
                }}
              />
            </motion.div>

            {/* Shadow */}
            <motion.div
              className="absolute -inset-4 bg-black/10 rounded-2xl blur-xl -z-10"
              animate={{
                rotateX: -mousePosition.y * 0.5,
                rotateY: mousePosition.x * 0.5,
                translateZ: "-50px",
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="text-xl text-gray-600">
              At Mentorix, our mission extends beyond simply connecting mentors and
              mentees. We're building a future where world-class expertise is accessible to
              everyone, regardless of their location, background, or circumstances.
            </p>

            <p className="text-xl text-gray-600">
              We believe that knowledge should know no boundaries. Our platform breaks
              down traditional barriers to learning and professional development, creating
              opportunities for meaningful connections that drive personal and professional
              growth.
            </p>

            <p className="text-xl text-gray-600">
              Through our innovative approach, we're not just facilitating mentorship — we're
              fostering a global community of lifelong learners and leaders who are passionate
              about sharing their expertise and helping others succeed.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const WhatWeProvideSection = () => {
  const [activeUserItem, setActiveUserItem] = useState('exploring');
  const [activeExpertItem, setActiveExpertItem] = useState('globalAudience');
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);
  const userIntervalRef = useRef(null);
  const expertIntervalRef = useRef(null);

  const userItems = {
    exploring: {
      title: "Exploring Experts Profiles",
      content: {
        description: "Browse through our extensive network of verified experts across various fields.",
        features: [
          "Advanced search filters to find the perfect match",
          "Verified credentials and expertise areas",
          "Real user reviews and ratings",
          "Detailed expert portfolios",
          "Direct messaging capabilities"
        ]
      }
    },
    scheduling: {
      title: "Scheduling The meeting",
      content: {
        description: "Effortlessly schedule sessions that fit your calendar.",
        features: [
          "Real-time availability checking",
          "Automated timezone conversion",
          "Flexible scheduling options",
          "Calendar integration",
          "Instant confirmation"
        ]
      }
    },
    payment: {
      title: "Secure Payment",
      content: {
        description: "Safe and secure payment processing for all sessions.",
        features: [
          "Multiple payment methods accepted",
          "Encrypted transaction processing",
          "Automatic payment receipts",
          "Transparent pricing",
          "Money-back guarantee"
        ]
      }
    },
    consultation: {
      title: "In-App Video Consultation",
      content: {
        description: "High-quality video consultations right in your browser.",
        features: [
          "HD video quality",
          "Screen sharing capabilities",
          "Built-in chat function",
          "Recording options",
          "No downloads required"
        ]
      }
    },
    feedback: {
      title: "Give Feedback",
      content: {
        description: "Share your experience and help others find great experts.",
        features: [
          "Detailed rating system",
          "Written reviews",
          "Photo and video testimonials",
          "Verified session badges",
          "Impact tracking"
        ]
      }
    }
  };

  const expertItems = {
    globalAudience: {
      title: "Global Audience",
      content: {
        description: "Reach clients from around the world and expand your professional network.",
        features: [
          "Worldwide visibility",
          "Multi-language support",
          "Cultural exchange opportunities",
          "Global networking",
          "Market expansion"
        ]
      }
    },
    availability: {
      title: "Flexible Availability",
      content: {
        description: "Set your own schedule and manage your time effectively.",
        features: [
          "Custom availability settings",
          "Time zone management",
          "Buffer time settings",
          "Vacation mode",
          "Automated scheduling"
        ]
      }
    },
    appointments: {
      title: "Smart Appointments",
      content: {
        description: "Efficiently manage your client sessions and bookings.",
        features: [
          "Automated reminders",
          "Session preparation tools",
          "Client history access",
          "Notes and follow-ups",
          "Calendar sync"
        ]
      }
    },
    services: {
      title: "Customizable Services",
      content: {
        description: "Create and manage your service offerings with full control.",
        features: [
          "Custom package creation",
          "Pricing flexibility",
          "Service bundling",
          "Special offers",
          "Subscription options"
        ]
      }
    },
    payments: {
      title: "Secure Payments",
      content: {
        description: "Receive payments securely and manage your earnings.",
        features: [
          "Multiple currency support",
          "Automated payouts",
          "Transaction history",
          "Tax documentation",
          "Revenue analytics"
        ]
      }
    }
  };

  const startUserAutoScroll = () => {
    if (userIntervalRef.current) {
      clearInterval(userIntervalRef.current);
    }

    const keys = Object.keys(userItems);
    let currentIndex = keys.indexOf(activeUserItem);

    userIntervalRef.current = setInterval(() => {
      if (!autoScrollPaused) {
        currentIndex = (currentIndex + 1) % keys.length;
        setActiveUserItem(keys[currentIndex]);
      }
    }, 3000);
  };

  const startExpertAutoScroll = () => {
    if (expertIntervalRef.current) {
      clearInterval(expertIntervalRef.current);
    }

    const keys = Object.keys(expertItems);
    let currentIndex = keys.indexOf(activeExpertItem);

    expertIntervalRef.current = setInterval(() => {
      if (!autoScrollPaused) {
        currentIndex = (currentIndex + 1) % keys.length;
        setActiveExpertItem(keys[currentIndex]);
      }
    }, 3000);
  };

  useEffect(() => {
    startUserAutoScroll();
    startExpertAutoScroll();

    return () => {
      if (userIntervalRef.current) clearInterval(userIntervalRef.current);
      if (expertIntervalRef.current) clearInterval(expertIntervalRef.current);
    };
  }, [autoScrollPaused]);

  const handleUserItemHover = (key) => {
    setAutoScrollPaused(true);
    setActiveUserItem(key);
  };

  const handleExpertItemHover = (key) => {
    setAutoScrollPaused(true);
    setActiveExpertItem(key);
  };

  const handleItemLeave = () => {
    setAutoScrollPaused(false);
  };

  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold">What We Provide</h2>
        </motion.div>

        <div className="space-y-24">
          {/* For Users Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-primary mb-4">For Users</h3>
              {Object.entries(userItems).map(([key, item]) => (
                <motion.div
                  key={key}
                  className="w-full"
                  onMouseEnter={() => handleUserItemHover(key)}
                  onMouseLeave={handleItemLeave}
                >
                  <motion.div
                    className={`relative rounded-lg border ${
                      activeUserItem === key 
                        ? 'border-primary bg-[#F9FDF9]' 
                        : 'border-gray-100 hover:border-gray-200'
                    } p-4 transition-all duration-300`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${
                        activeUserItem === key ? 'text-primary' : 'text-gray-400'
                      }`}>
                        {String(Object.keys(userItems).indexOf(key) + 1).padStart(2, '0')}
                      </span>
                      <h4 className={`text-base font-medium ${
                        activeUserItem === key ? 'text-primary' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </h4>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>

            <div className="bg-[#E8F5E9] rounded-3xl p-8 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeUserItem}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <h4 className="text-xl text-[#1D1F1D] mb-6">
                    {userItems[activeUserItem].content.description}
                  </h4>
                  <div className="space-y-4">
                    {userItems[activeUserItem].content.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <svg 
                          className="w-5 h-5 text-primary flex-shrink-0" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                        <span className="text-[#1D1F1D]">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Decorative Elements */}
              <motion.div
                className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full opacity-50 -z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  filter: "blur(40px)",
                  transform: "translate(25%, -25%)"
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-48 h-48 bg-green-100 rounded-full opacity-50 -z-10"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, -90, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  filter: "blur(30px)",
                  transform: "translate(-25%, 25%)"
                }}
              />
            </div>
          </div>

          {/* For Experts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="bg-[#E8F5E9] rounded-3xl p-8 relative overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeExpertItem}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10"
                >
                  <h4 className="text-xl text-[#1D1F1D] mb-6">
                    {expertItems[activeExpertItem].content.description}
                  </h4>
                  <div className="space-y-4">
                    {expertItems[activeExpertItem].content.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3"
                      >
                        <svg 
                          className="w-5 h-5 text-primary flex-shrink-0" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                        <span className="text-[#1D1F1D]">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Decorative Elements */}
              <motion.div
                className="absolute top-0 right-0 w-64 h-64 bg-green-100 rounded-full opacity-50 -z-10"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  filter: "blur(40px)",
                  transform: "translate(25%, -25%)"
                }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-48 h-48 bg-green-100 rounded-full opacity-50 -z-10"
                animate={{
                  scale: [1, 1.3, 1],
                  rotate: [0, -90, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  filter: "blur(30px)",
                  transform: "translate(-25%, 25%)"
                }}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-primary mb-4">For Experts</h3>
              {Object.entries(expertItems).map(([key, item]) => (
                <motion.div
                  key={key}
                  className="w-full"
                  onMouseEnter={() => handleExpertItemHover(key)}
                  onMouseLeave={handleItemLeave}
                >
                  <motion.div
                    className={`relative rounded-lg border ${
                      activeExpertItem === key 
                        ? 'border-primary bg-[#F9FDF9]' 
                        : 'border-gray-100 hover:border-gray-200'
                    } p-4 transition-all duration-300`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${
                        activeExpertItem === key ? 'text-primary' : 'text-gray-400'
                      }`}>
                        {String(Object.keys(expertItems).indexOf(key) + 1).padStart(2, '0')}
                      </span>
                      <h4 className={`text-base font-medium ${
                        activeExpertItem === key ? 'text-primary' : 'text-gray-900'
                      }`}>
                        {item.title}
                      </h4>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const JourneyCTASection = () => {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl font-bold mb-6"
          >
            Ready to Start Your Journey?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-gray-600 mb-10"
          >
            Join Mentorix today and connect with world-class experts to achieve your goals.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-4">
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-expert"
            >
              Find an Expert
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Become an Expert
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-5xl font-bold text-[#169544] mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              About Mentorix
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              "At Mentorix, we bring together people and experts from all fields to share knowledge, grow skills, and unlock new opportunities. Our mission is to make expert guidance accessible to everyone, helping you reach your full potential."
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-expert"
            >
              Discover Mentorix
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative perspective-1000"
          >
            <div className="relative aspect-[4/3]">
              <Image3D 
                src="https://i.postimg.cc/DyPNYcd2/OBJECTS.png"
                alt="About Mentorix"
              />
            </div>

           {/* Decorative elements */}
            <motion.div
              className="absolute -top-4 -right-4 w-24 h-24 bg-[#E8F5E9] rounded-full -z-10"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#E8F5E9] rounded-full -z-10"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, -5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>
      </div>

      {/* Who We Are Section */}
      <div className="bg-[#F3F3F3] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16" >
            <h2 className="text-4xl font-bold mb-4">Who We Are</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are a team of passionate individuals dedicated to transforming the way people learn and grow professionally.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <VisionCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              }
              title="Innovation"
              description="We constantly push boundaries to create cutting-edge solutions that make mentorship more accessible and effective."
            />
            <VisionCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="Community"
              description="We foster a vibrant community where knowledge sharing and collaboration thrive."
            />
            <VisionCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              }
              title="Excellence"
              description="We maintain the highest standards in every aspect of our platform and service delivery."
            />
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <MissionSection />

      {/* What We Provide Section */}
      <WhatWeProvideSection />

      {/* Journey CTA Section */}
      <JourneyCTASection />
    </div>
  );
};

export default AboutPage;