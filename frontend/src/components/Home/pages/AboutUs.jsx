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

const RevolutionizingSection = () => {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-[#169544]">
            Revolutionizing Expert Consultations
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Experts Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-lg p-8 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[#169544] text-2xl">⭐</span>
              <h3 className="text-2xl font-bold text-[#169544]">For Experts</h3>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#169544] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <p className="text-lg text-gray-700">Streamlined client and schedule management</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#169544] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <p className="text-lg text-gray-700">Expand your client base without upfront costs</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#169544] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <p className="text-lg text-gray-700">Enhance client retention with smart tools</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-[#169544] text-white rounded-lg font-medium hover:bg-[#138339] transition-colors"
            >
              Show Your Expertise
            </motion.button>
          </motion.div>

          {/* For Users Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-lg p-8 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[#169544] text-2xl">👥</span>
              <h3 className="text-2xl font-bold text-[#169544]">For Users</h3>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#169544] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <p className="text-lg text-gray-700">Access to a network of verified professionals</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#169544] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <p className="text-lg text-gray-700">Hassle-free booking and secure transactions</p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-[#169544] mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
                <p className="text-lg text-gray-700">High-quality video consultations</p>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-[#169544] text-white rounded-lg font-medium hover:bg-[#138339] transition-colors"
            >
              Search Experts
            </motion.button>
          </motion.div>
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
           Ready to Accelerate Your Growth?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-gray-600 mb-10"
          >
           Connect with world-class experts who can help you achieve your professional goals faster.
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
              Empowering Experts.<br></br>
              Connecting People.
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-600 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              "We're revolutionizing the way expertise is shared and accessed. Join us in creating a world where quality guidance is just a click away."
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

        {/* Mission Section */}
      <MissionSection />

        {/* New Revolutionizing Section */}
      <RevolutionizingSection />

      {/* Who We Are Section */}
      <div className="bg-[#F3F3F3] py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16" >
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            {/* <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are a team of passionate individuals dedicated to transforming the way people learn and grow professionally.
            </p> */}
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <VisionCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              }
              title="Trust & Quality"
              description="We rigorously vet our experts to ensure you receive top-tier guidance. Your growth and security are our priorities."
            />
            <VisionCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              }
              title="Global Accessibility"
              description="We're breaking down geographical barriers, making world-class expertise available to everyone, everywhere."
            />
            <VisionCard
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor"  viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              }
              title="Continuous Innovation"
              description="We're constantly evolving our platform to provide cutting-edge tools for both experts and learners."
            />
          </div>
        </div>
      </div>

    

    

      {/* Journey CTA Section */}
      <JourneyCTASection />
    </div>
  );
};

export default AboutPage;