import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {useNavigate} from 'react-router-dom'
import Navbar from '../components/Navbar';
import { useAutoScroll } from '../hooks/useAutoScroll';
import ExpertFAQ from '../components/ExpertFAQ';
import PricingSection from '../components/PricingSection';

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Expand Your Reach",
    description: "Connect with people worldwide.                                                Grow your impact with ease.                                                                Mentorix brings opportunities to you."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Work on Your Terms",
    description: "Set your own schedule and rates. Control when and how you work. Our flexible system empowers you."
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: "Streamlined Operations",
    description: "We handle everything for you.  Focus on sharing your knowledge. Help others without the hassle."
  }
];

const keyFeatures = [
  {
    id: "01",
    title: "1:1 Expert Sessions",
    content: "Conduct personalized one-on-one sessions with clients, offering tailored guidance and support.",
    image: "https://i.postimg.cc/yYjLYCw7/Frame-1615.png"
  },
  {
    id: "02",
    title: "Flexible Service Packages",
    content: "Create custom service packages that suit your expertise and client needs.",
    image: "https://i.postimg.cc/CKsGJGSS/img2.png"
  },
  {
    id: "03",
    title: "Expert Dashboard",
    content: "Access comprehensive analytics and client management tools in one place.",
    image: "https://i.postimg.cc/59DVqGg5/img3.png"
  },
  {
    id: "04",
    title: "Instant Messaging for Pre-Session Questions",
    content: "Communicate efficiently with clients before sessions to ensure productive meetings.",
    image: "https://i.postimg.cc/Njkvt0cb/img4.png"
  },
  {
    id: "05",
    title: "Free Profile Promotion for Top Experts",
    content: "Get featured on our platform and increase your visibility to potential clients.",
    image: "https://i.postimg.cc/yYjLYCw7/Frame-1615.png"
  }
];

const testimonials = [
  {
    rating: 5,
    text: "Mentorix has transformed my consulting business. I now work with clients from different countries, and the platform is incredibly easy to use.",
    name: "Dr. Priya S.",
    title: "Career Consultant"
  },
  {
    rating: 5,
    text: "The dashboard makes managing sessions a breeze. Plus, payments are always on time!",
    name: "Alex T.",
    title: "Fitness Coach"
  },
  {
    rating: 5,
    text: "I love how Mentorix values both experts and clients. It's a win-win for everyone.",
    name: "Sarah M.",
    title: "Relationship Advisor"
  }
];


const steps = [
  {
    number: "1",
    title: "Create Your Profile",
    description: "Showcase your expertise, set your rates, and define your services. It only takes a few minutes to get started.",
  },
  {
    number: "2", 
    title: "Set Your Availability",
    description: "Choose when and how you want to work. Our flexible scheduling tools put you in control of your time.",
  },
  {
    number: "3",
    title: "Start Earning",
    description: "Focus on sharing your expertise while we handle everything else. Get paid for your valuable knowledge and time.",
  }
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
          className="w-full h-full object-contain"
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

const BecomeExpertPage = () => {
  const [activeFeature, setActiveFeature] = useState(keyFeatures[0]);
  const [autoScrollPaused, setAutoScrollPaused] = useState(false);
  const autoScrollIntervalRef = useRef(null);
  const [clonedTestimonials, setClonedTestimonials] = useState([]);
  const { scrollRef, handleMouseEnter, handleMouseLeave } = useAutoScroll(0.5);
  const imageControls = useAnimation();
  const navigate = useNavigate();

  useEffect(() => {
    setClonedTestimonials([...testimonials, ...testimonials, ...testimonials]);
  }, []);

  const startAutoScroll = (startIndex = 0) => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
    }

    let currentIndex = startIndex;

    autoScrollIntervalRef.current = setInterval(() => {
      if (!autoScrollPaused) {
        currentIndex = (currentIndex + 1) % keyFeatures.length;
        handleFeatureChange(keyFeatures[currentIndex]);
      }
    }, 3000);
  };

  const handleExpertOnboarding =() =>{
    navigate('/expert-onboarding');
  }

  useEffect(() => {
    startAutoScroll();
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [autoScrollPaused]);

  const handleFeatureHover = async (feature) => {
    if (feature.id !== activeFeature.id) {
      setAutoScrollPaused(true);
      await imageControls.start({ 
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 }
      });
      handleFeatureChange(feature);
      const currentIndex = keyFeatures.findIndex(f => f.id === feature.id);
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
      transition: { duration: 0.2 }
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block px-4 py-1.5 bg-green-50 text-primary rounded-full text-sm font-medium mb-8">
            Your Knowledge. Your Time. Your Earnings.
          </span>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8">
            Turn Your Expertise 
            <br />
            Into Opportunity
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Share your knowledge, set your schedule, and earn on your terms. Make an impact with your expertise on a global scale.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button className="btn-expert"
            onClick={handleExpertOnboarding}>
              Become an Expert
            </button>
          </div>
        </motion.div>
      </div>

      {/* Why Choose Mentorix */}
      <div className="py-16 bg-[#F9FDF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold">
              Why Experts Choose Us
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
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
                    mass: 1
                  }
                }}
                className="relative bg-white p-8 rounded-xl shadow-sm border-2 border-transparent transition-all duration-300 overflow-hidden"
              >
                <motion.div 
                  className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-primary mb-6"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 10
                    }
                  }}
                >
                  {feature.icon}
                </motion.div>
                <motion.h3 
                  className="text-xl font-bold mb-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="text-gray-600"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  {feature.description}
                </motion.p>

                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                  animate={{
                    x: ['100%', '-100%'],
                    opacity: [0, 0.3, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 3
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold">Key Features</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="lg:order-2 relative h-[600px] overflow-hidden rounded-2xl">
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
                    className="w-full h-full object-contain p-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                    animate={{
                      x: ['100%', '-100%'],
                      opacity: [0, 0.1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      ease: "easeInOut",
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="space-y-6 lg:order-1">
              {keyFeatures.map((feature, index) => (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onMouseEnter={() => handleFeatureHover(feature)}
                  onMouseLeave={handleFeatureLeave}
                  className={`border border-gray-100 rounded-lg p-6 cursor-pointer transition-all duration-300
                    ${activeFeature.id === feature.id 
                      ? 'border-primary bg-green-50 shadow-md transform -translate-x-2' 
                      : 'hover:border-gray-200 hover:shadow-sm hover:-translate-x-1'}`}
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-medium transition-colors duration-300
                      ${activeFeature.id === feature.id ? 'text-primary' : 'text-gray-400'}`}>
                      {feature.id}
                    </span>
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                  </div>
                  <p className="mt-2 text-gray-600">{feature.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-[#F9FDF9] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">What Our Experts Say</h2>
          </motion.div>

          <div 
            ref={scrollRef}
            className="flex gap-8 overflow-x-hidden pb-8"
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
                className="flex-shrink-0 w-[300px] sm:w-[400px] bg-white p-6 rounded-xl shadow-sm border border-transparent transform-gpu z-10"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold">{testimonial.name}</p>
                  <p className="text-gray-500">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Get Started Steps Section */}
      <div className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold">How It Works</h2>
          </motion.div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex items-start gap-6"
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-[#169544] text-white flex items-center justify-center text-lg font-medium">
                    {step.number}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center text-[#169544] font-medium mt-12"
            >
              You bring the knowledge. We take care of the rest.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <PricingSection />

      {/* FAQ Section */}
      <ExpertFAQ />

      {/* Ready to Share Section */}
      <div className="py-24 bg-[#F9FDF9]">
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
              className="text-4xl sm:text-5xl font-bold mb-6"
            >
              Ready to Share Your Expertise?
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl text-gray-600 mb-10"
            >
              Join Mentorix today and become part of a global community of
              professionals making an impact!
            </motion.p>

            <motion.button
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-expert inline-flex items-center gap-2"
              onClick={handleExpertOnboarding}
            >
              Become an Expert
              <svg 
                className="w-5 h-5" 
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
    </div>
  );
};

export default BecomeExpertPage;