import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ExpertCard from './ExpertCard';
import { useAutoScroll } from '../hooks/useAutoScroll';

const ExpertSection = ({ title, subtitle, experts, link }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsPerView = 3;
  const { scrollRef, handleMouseEnter, handleMouseLeave } = useAutoScroll(0.5);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex + cardsPerView;
      if (nextIndex >= experts.length) {
        return 0;
      }
      return nextIndex;
    });
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex - cardsPerView;
      if (nextIndex < 0) {
        return Math.max(0, experts.length - cardsPerView);
      }
      return nextIndex;
    });
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <motion.div 
      ref={sectionRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="mb-12 relative"
    >
      <motion.div 
        variants={headerVariants}
        className="flex justify-between items-center mb-6 pt-20"
      >
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-2xl font-bold mb-1"
          >
            {title}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-gray-600"
          >
            {subtitle}
          </motion.p>
        </div>
        <motion.a 
          href={link}
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          whileHover={{ scale: 1.05, x: 5 }}
          className="text-primary hover:text-green-600 font-medium flex items-center gap-1"
        >
          See All {title}
          <motion.svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            initial={{ x: 0 }}
            animate={isInView ? { x: [0, 5, 0] } : { x: 0 }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </motion.svg>
        </motion.a>
      </motion.div>

      <div className="relative">
        {/* Navigation Buttons */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10"
          style={{ transform: 'translate(-24px, -50%)' }}
        >
          <motion.button
            onClick={handlePrev}
            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentIndex === 0}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </motion.button>
        </div>

        <div 
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10"
          style={{ transform: 'translate(24px, -50%)' }}
        >
          <motion.button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            disabled={currentIndex >= experts.length - cardsPerView}
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>

        <div 
          ref={scrollRef}
          className="overflow-hidden pb-20 pt-10 -mx-2 px-2"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            className="flex gap-4"
            animate={{
              x: -(currentIndex * (100 / cardsPerView)) + '%'
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              mass: 0.5
            }}
          >
            {experts.map((expert, index) => (
              <motion.div
                key={`${expert.name}-${index}`}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
                transition={{ 
                  duration: 0.8,
                  delay: (index % cardsPerView) * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
                className="relative flex-shrink-0"
                style={{ width: `calc(${100 / cardsPerView}% - ${(16 * (cardsPerView - 1)) / cardsPerView}px)` }}
              >
                <ExpertCard expert={expert} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpertSection;