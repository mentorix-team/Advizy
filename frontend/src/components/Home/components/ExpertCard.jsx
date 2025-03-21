import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ExpertCard = ({ expert }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [availability, setAvailability] = useState(null);
  const navigate = useNavigate();

  const calculateTotalExperience = (workExperiences) => {
    if (!Array.isArray(workExperiences) || workExperiences.length === 0) return "0 years";
  
    let totalMonths = 0;
  
    workExperiences.forEach((job) => {
      if (!job.startDate || !job.endDate) return;
  
      const start = new Date(job.startDate);
      const end = new Date(job.endDate);
  
      const yearsDiff = end.getFullYear() - start.getFullYear();
      const monthsDiff = end.getMonth() - start.getMonth();
  
      totalMonths += yearsDiff * 12 + monthsDiff;
    });
  
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
  
    return years > 0 ? `${years} years ${months} months` : `${months} months`;
  };

  const mentoringService = expert.credentials?.services?.find(
    (service) => service.title === "One-on-One Mentoring"
  );

  const firstEnabledSlot = mentoringService?.one_on_one?.find(
    (slot) => slot.enabled
  );

  const startingPrice = firstEnabledSlot?.price || 0;
  const duration = firstEnabledSlot?.duration || "N/A";

  const totalExperience = calculateTotalExperience(expert.credentials?.work_experiences);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await dispatch(getAvailabilitybyid(expert._id)).unwrap(); 
        setAvailability(response.availability);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [dispatch, expert._id]);

  const firstAvailableDay = availability?.daySpecific?.find(day => day.slots.length > 0);
  const firstAvailableTime = firstAvailableDay?.slots?.[0]?.startTime;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast.success(
      !isFavorite ? 'Added to favorites!' : 'Removed from favorites!',
      {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#169544',
          color: '#fff',
          borderRadius: '10px',
        },
      }
    );
  };

  return (
    <motion.div 
      ref={cardRef}
      whileHover={{ 
        scale: 1.02,
        y: -5,
        borderColor: '#169544',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 25,
          duration: 0.4
        }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0.3,
        y: 0,
        transition: { duration: 0.5 }
      }}
      className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border-2 border-transparent w-full max-w-[400px] mx-auto relative overflow-hidden z-0 transform-gpu"
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        animate={{
          x: ['100%', '-100%'],
          opacity: [0, 0.1, 0]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          repeatDelay: 5
        }}
      />

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
        <motion.div 
          className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden flex-shrink-0"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              src={expert?.profileImage?.secure_url || "https://via.placeholder.com/100"} 
              alt={`${expert.firstName} ${expert.lastName}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.h3 
              className="font-semibold text-base sm:text-lg truncate"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {`${expert.firstName} ${expert.lastName}`}
            </motion.h3>
            <motion.p 
              className="text-gray-600 text-sm mb-1 truncate"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {expert.credentials?.domain}
            </motion.p>
            <motion.div 
              className="flex flex-wrap items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                <span className="font-medium">{expert.reviews?.length > 0
                  ? (expert.reviews.reduce((acc, review) => acc + review.rating, 0) / expert.reviews.length).toFixed(1)
                  : "0.0"}</span>
              </div>
              <span
                className="text-[#1D1F1D] text-xs sm:text-sm whitespace-nowrap"
                style={{
                  borderRadius: '25px',
                  background: 'rgba(196, 243, 211, 0.30)',
                  display: 'inline-flex',
                  padding: '2px 8px',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <svg className="w-3 h-3 sm:w-4 sm:h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="none">
                  <path d="M8.84328 1.36304C9.06136 1.5458 9.25353 1.73121 9.42586 1.95835C9.44113 1.97828 9.4564 1.99821 9.47213 2.01874C9.76124 2.41291 9.92067 2.84259 10.0069 3.32244C10.0115 3.34829 10.0162 3.37415 10.0211 3.40079C10.1164 4.25062 9.9222 5.06552 9.40059 5.74748C9.32816 5.83518 9.25202 5.91807 9.17325 6.00009C9.15195 6.02298 9.13065 6.04587 9.10871 6.06946C8.94201 6.24365 8.76916 6.37594 8.56699 6.50531C8.54598 6.51931 8.52498 6.53331 8.50334 6.54774C8.03707 6.84621 7.46592 6.97063 6.91871 6.9679C6.88897 6.96777 6.85923 6.96765 6.82859 6.96752C6.5919 6.96436 6.37125 6.94213 6.14194 6.88422C6.11695 6.87792 6.11695 6.87792 6.09144 6.87149C5.63572 6.75278 5.20438 6.52731 4.86044 6.20504C4.81268 6.16056 4.76409 6.11968 4.71312 6.07903C4.5915 5.97544 4.49613 5.84822 4.39894 5.72222C4.38383 5.70275 4.36872 5.68328 4.35316 5.66321C3.95955 5.1293 3.7823 4.51396 3.78321 3.85449C3.78322 3.83744 3.78323 3.82039 3.78325 3.80281C3.7849 3.35354 3.85535 2.94787 4.04529 2.53935C4.05669 2.51356 4.06808 2.48777 4.07982 2.4612C4.32291 1.93933 4.75233 1.48531 5.23255 1.17526C5.25476 1.16074 5.27697 1.14622 5.29985 1.13125C6.36927 0.468387 7.86949 0.570909 8.84328 1.36304Z" fill="#1D1D1D"/>
                </svg>
                {expert.sessions?.length} Session{expert.sessions?.length !== 1 ? 's' : ''} done
              </span>
            </motion.div>
          </div>
        </motion.div>
        <motion.button 
          className={`text-gray-400 hover:text-red-500 transition-colors absolute top-4 right-4 ${isFavorite ? 'text-red-500' : ''}`}
          onClick={handleFavoriteClick}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          animate={isFavorite ? {
            scale: [1, 1.2, 1],
            transition: { duration: 0.3 }
          } : {}}
        >
          <svg 
            className="w-5 h-5 sm:w-6 sm:h-6" 
            fill={isFavorite ? "currentColor" : "none"} 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
            />
          </svg>
        </motion.button>
      </div>

      <motion.div 
        className="space-y-2 mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <p className="text-gray-600 text-xs sm:text-sm">Experience: {totalExperience}</p>
        <p className="text-xs sm:text-sm">
          Starts at <span className="text-primary font-medium">Rs. {startingPrice}</span> for {duration}mins
        </p>
      </motion.div>

      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-wrap gap-2">
          <p className="text-xs sm:text-sm text-gray-600 w-full sm:w-auto">Expertise:</p>
          <div className="flex flex-wrap gap-2">
            {expert.credentials?.skills?.slice(0, 3).map((skill, index) => (
              <motion.span 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
                whileHover={{ scale: 1.1 }}
                className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-gray-700"
              >
                {skill}
              </motion.span>
            ))}
            {expert.credentials?.skills?.length > 3 && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 }}
                className="text-xs sm:text-sm px-2 sm:px-3 py-1 bg-gray-100 rounded-full text-gray-700"
              >
                +{expert.credentials.skills.length - 3} more
              </motion.span>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div 
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div>
          <p className="text-xs sm:text-sm text-gray-600">Next Available Slot:</p>
          <p className="text-xs sm:text-sm text-primary">{firstAvailableDay ? `${firstAvailableDay.day}, ${firstAvailableTime}` : "No slots available"}</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <motion.button 
            className="flex-1 sm:flex-none px-3 sm:px-4 py-2 text-gray-700 text-xs sm:text-sm font-medium hover:bg-gray-50 rounded-lg border border-gray-200"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(`/expert/${expert.redirect_url}`)}
            whileTap={{ scale: 0.95 }}
          >
            View Profile
          </motion.button>
          <motion.button 
            className="flex-1 sm:flex-none btn-expert text-xs sm:text-sm"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(`/expert/${expert.redirect_url}`)}
            whileTap={{ scale: 0.95 }}
          >
            Book
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ExpertCard;