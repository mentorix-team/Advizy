import React from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

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
  
    return `${years}+ yrs in industry`;
  };

  const mentoringService = expert.credentials?.services?.find(
    (service) => service.title === "One-on-One Mentoring"
  );

  const firstEnabledSlot = mentoringService?.one_on_one?.find(
    (slot) => slot.enabled
  );

  const startingPrice = firstEnabledSlot?.price || 1400;
  const duration = firstEnabledSlot?.duration || 50;

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
        boxShadow: '0 10px 30px -12px rgba(0, 0, 0, 0.1)',
        transition: {
          type: "spring",
          stiffness: 200,
          damping: 25
        }
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0.3,
        y: 0,
        transition: { duration: 0.5 }
      }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 w-full max-w-[500px] mx-auto overflow-hidden"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden">
              <img 
                src={expert?.profileImage?.secure_url || "https://images.unsplash.com/photo-1494790108377-be9c29b29330"} 
                alt={`${expert.firstName} ${expert.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {expert.firstName} {expert.lastName}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    {expert.credentials?.domain || "Startup Advisor & Entrepreneur"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  <span className="text-yellow-400 mr-1">★</span>
                  <span className="font-medium">{expert.rating || "4.5"}</span>
                  <span className="text-gray-500 text-sm">/5</span>
                  <span className="text-gray-400 text-sm ml-1">({expert.reviews?.length || "756"})</span>
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={handleFavoriteClick}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <Heart 
              className={`w-6 h-6 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
            />
          </button>
        </div>

        <div className="space-y-3">
          <p className="text-gray-700">
            Experience: {totalExperience}
          </p>
          <p className="text-gray-900">
            Starts at <span className="text-blue-600 font-semibold">${startingPrice}</span> for {duration}mins
          </p>
        </div>

        <div className="mt-4">
          <p className="text-gray-700 mb-2">Expertise:</p>
          <div className="flex flex-wrap gap-2">
            {(expert.credentials?.skills || ["Relationship skills", "Mental Health", "Stress Management", "Stress"]).map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gray-50 text-gray-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-gray-600 text-sm">Next Available Slot:</p>
            <p className="text-blue-600">Tomorrow, 10:00 AM</p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={() => navigate(`/expert/${expert.redirect_url}`)}
              className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-full hover:bg-gray-50 transition-colors"
            >
              View Profile
            </button>
            <button 
              onClick={() => navigate(`/expert/${expert.redirect_url}`)}
              className="flex-1 px-4 py-2 bg-green-500 text-white font-medium rounded-full hover:bg-green-600 transition-colors"
            >
              Book
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ExpertCard;