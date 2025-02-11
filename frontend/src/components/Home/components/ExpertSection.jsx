import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ExpertCard from './ExpertCard';
import { useAutoScroll } from '../hooks/useAutoScroll';

const ExpertSection = ({ title, subtitle, experts, link }) => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [clonedExperts, setClonedExperts] = useState([]);
  const { scrollRef, handleMouseEnter, handleMouseLeave } = useAutoScroll(0.5);

  useEffect(() => {
    setClonedExperts([...experts, ...experts, ...experts]);
  }, [experts]);

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
      className="mb-12"
    >
      <motion.div 
        variants={headerVariants}
        className="flex justify-between items-center mb-6"
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

      <div 
        ref={scrollRef}
        className="flex overflow-x-hidden gap-4 pb-20 pt-10 -mx-2 px-2"
        style={{ 
          scrollBehavior: 'auto', 
          WebkitOverflowScrolling: 'touch',
          marginTop: '-10px',
          marginBottom: '-20px'
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {clonedExperts.map((expert, index) => (
          <motion.div
            key={`${expert.name}-${index}`}
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ 
              duration: 0.8,
              delay: (index % experts.length) * 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="relative"
            style={{ padding: '10px 0' }}
          >
            <ExpertCard expert={expert} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ExpertSection;