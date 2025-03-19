import { getAvailabilitybyid } from '@/Redux/Slices/availability.slice';
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
  const navigate = useNavigate()
  const dispatch = useDispatch()
  console.log('EXpert',expert);
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

  const firstService = expert.credentials?.services?.[0];
  const startingPrice = firstService?.price || 0;
  const duration = firstService?.duration || "N/A";

  const totalExperience = calculateTotalExperience(expert.credentials?.work_experiences);


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsVisible(entry.isIntersecting);
        });
      },
ExpertCard = ({ expert }) => {
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await dispatch(getAvailabilitybyid(expert._id)).unwrap(); 
                setAvailability(response.availability);
      } catch (error) {
        console.error("Error fetching availability:", error);
 const ExpertCard = ({ expert }) => {
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
        scale: 1.08,
        y: -10,
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
      className="bg-white p-6 rounded-lg shadow-sm border-2 border-transparent w-[280px] sm:w-[340px] md:w-[400px] mx-2 relative overflow-hidden z-0 transform-gpu"
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

      <div className="flex justify-between items-start mb-4">
        <motion.div 
          className="flex items-start gap-4"
          whileHover={{ x: 5 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="relative w-20 h-20 rounded-full overflow-hidden"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <img 
              src={expert?.profileImage?.secure_url ||
                "https://via.placeholder.com/100"} 
              alt={`${expert.firstName} ${expert.lastName}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </motion.div>
          <div>
            <motion.h3 
              className="font-semibold text-lg"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {`${expert.firstName} ${expert.lastName}`}
            </motion.h3>
            <motion.p 
              className="text-gray-600 text-sm mb-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {expert.credentials?.domain}
            </motion.p>
            <motion.div 
              className="flex items-center gap-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="text-yellow-400">★</span>
            <span className="font-medium">{expert.reviews?.length > 0
                      ? expert.reviews.reduce(
                          (acc, review) => acc + review.rating,
                          0
                        ) / expert.reviews.length
                      : 0}</span>
              <span
                className="text-[#1D1F1D] text-sm"
                style={{
                  borderRadius: '25px',
                  background: 'rgba(196, 243, 211, 0.30)',
                  display: 'inline-flex',
                  padding: '2px 10px 2px 9px',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <g clipPath="url(#clip0_3038_1847)">
                    <path d="M8.84328 1.36304C9.06136 1.5458 9.25353 1.73121 9.42586 1.95835C9.44113 1.97828 9.4564 1.99821 9.47213 2.01874C9.76124 2.41291 9.92067 2.84259 10.0069 3.32244C10.0115 3.34829 10.0162 3.37415 10.0211 3.40079C10.1164 4.25062 9.9222 5.06552 9.40059 5.74748C9.32816 5.83518 9.25202 5.91807 9.17325 6.00009C9.15195 6.02298 9.13065 6.04587 9.10871 6.06946C8.94201 6.24365 8.76916 6.37594 8.56699 6.50531C8.54598 6.51931 8.52498 6.53331 8.50334 6.54774C8.03707 6.84621 7.46592 6.97063 6.91871 6.9679C6.88897 6.96777 6.85923 6.96765 6.82859 6.96752C6.5919 6.96436 6.37125 6.94213 6.14194 6.88422C6.11695 6.87792 6.11695 6.87792 6.09144 6.87149C5.63572 6.75278 5.20438 6.52731 4.86044 6.20504C4.81268 6.16056 4.76409 6.11968 4.71312 6.07903C4.5915 5.97544 4.49613 5.84822 4.39894 5.72222C4.38383 5.70275 4.36872 5.68328 4.35316 5.66321C3.95955 5.1293 3.7823 4.51396 3.78321 3.85449C3.78322 3.83744 3.78323 3.82039 3.78325 3.80281C3.7849 3.35354 3.85535 2.94787 4.04529 2.53935C4.05669 2.51356 4.06808 2.48777 4.07982 2.4612C4.32291 1.93933 4.75233 1.48531 5.23255 1.17526C5.25476 1.16074 5.27697 1.14622 5.29985 1.13125C6.36927 0.468387 7.86949 0.570909 8.84328 1.36304ZM5.12219 2.30175C4.65209 2.84397 4.54506 3.45437 4.57577 4.15605C4.59706 4.39841 4.6722 4.62017 4.77785 4.83809C4.78932 4.86173 4.80078 4.88537 4.81259 4.90973C5.09435 5.4564 5.59643 5.88818 6.18013 6.07972C6.76305 6.25379 7.41319 6.22647 7.96072 5.94957C8.18663 5.82652 8.3823 5.67388 8.56699 5.49487C8.58213 5.48159 8.59727 5.4683 8.61287 5.45461C8.99453 5.10749 9.22652 4.55102 9.25216 4.04353C9.27214 3.38381 9.12542 2.82402 8.69329 2.312C8.67401 2.28647 8.65474 2.26094 8.63487 2.23464C8.26405 1.82932 7.73168 1.53264 7.17832 1.4991C6.36252 1.46555 5.68095 1.68633 5.12219 2.30175Z" fill="#1D1D1D"/>
                    <path d="M5.20646 7.40193C5.41442 7.53865 5.62385 7.65283 5.85514 7.74458C5.871 7.75088 5.88686 7.75718 5.9032 7.76366C6.67662 8.06214 7.41857 7.96827 8.16829 7.65657C8.39147 7.55223 8.59385 7.41522 8.79752 7.27741C9.27398 6.95775 9.27398 6.95775 9.53692 6.97255C9.55616 6.97315 9.5754 6.97374 9.59522 6.97436C10.2336 7.00254 10.8369 7.26219 11.2738 7.73535C12.0941 8.67755 12.2996 10.0245 12.3219 11.2306C12.3229 11.2612 12.3239 11.2917 12.325 11.3232C12.3366 11.8753 12.2295 12.4869 11.8514 12.912C11.815 12.9498 11.7782 12.9872 11.7409 13.0241C11.719 13.047 11.6972 13.07 11.6746 13.0936C11.6548 13.1123 11.635 13.1311 11.6146 13.1504C11.5967 13.1677 11.5967 13.1677 11.5784 13.1853C11.0579 13.6622 10.3886 13.6924 9.72397 13.6911C9.65572 13.6912 9.58746 13.6914 9.51921 13.6916C9.35382 13.6921 9.18843 13.6921 9.02304 13.6919C8.88845 13.6918 8.75386 13.6919 8.61927 13.692C8.60003 13.692 8.5808 13.6921 8.56098 13.6921C8.52188 13.6921 8.48279 13.6921 8.44369 13.6922C8.07797 13.6925 7.71226 13.6924 7.34654 13.6921C7.0129 13.6919 6.67926 13.6922 6.34562 13.6928C6.00198 13.6934 5.65835 13.6936 5.3147 13.6935C5.1222 13.6934 4.9297 13.6934 4.7372 13.6939C4.57331 13.6943 4.40944 13.6943 4.24555 13.6938C4.16215 13.6936 4.07876 13.6936 3.99536 13.694C3.26319 13.6967 2.63275 13.5812 2.09127 13.0494C2.07174 13.0304 2.0522 13.0115 2.03207 12.992C1.67306 12.6213 1.5077 12.1045 1.50514 11.5956C1.50496 11.5723 1.50479 11.549 1.50461 11.5249C1.50416 11.4495 1.504 11.374 1.50396 11.2985C1.50394 11.2727 1.50392 11.247 1.50391 11.2205C1.50432 10.8308 1.51818 10.4531 1.58606 10.0686C1.59066 10.0414 1.59526 10.0142 1.60001 9.98613C1.7368 9.18766 1.97418 8.42858 2.49545 7.79511C2.50893 7.77775 2.52241 7.76039 2.5363 7.74251C2.88465 7.30658 3.46517 7.05551 4.00881 6.99222C4.51078 6.94034 4.7967 7.1298 5.20646 7.40193ZM3.91637 7.81089C3.89016 7.81767 3.89016 7.81767 3.86342 7.82459C3.39804 7.95198 3.08403 8.26226 2.84594 8.67292C2.42038 9.43471 2.29027 10.3296 2.28452 11.1919C2.2841 11.2375 2.28341 11.283 2.28244 11.3286C2.27376 11.7426 2.31533 12.1158 2.59649 12.4431C2.61026 12.4594 2.62404 12.4756 2.63823 12.4923C2.95493 12.8359 3.40747 12.9076 3.85263 12.9259C4.03537 12.9305 4.21813 12.93 4.40092 12.9296C4.46172 12.9297 4.52252 12.9298 4.58332 12.9299C4.73021 12.9301 4.8771 12.93 5.02399 12.9299C5.14355 12.9298 5.2631 12.9298 5.38266 12.9298C5.40835 12.9298 5.40835 12.9298 5.43455 12.9298C5.46936 12.9299 5.50416 12.9299 5.53896 12.9299C5.86406 12.93 6.18916 12.9299 6.51426 12.9296C6.7922 12.9294 7.07014 12.9294 7.34809 12.9296C7.67215 12.9299 7.99622 12.93 8.32029 12.9299C8.35495 12.9299 8.38961 12.9298 8.42428 12.9298C8.44133 12.9298 8.45838 12.9298 8.47594 12.9298C8.59513 12.9298 8.71431 12.9298 8.83349 12.9299C8.99439 12.9301 9.15529 12.93 9.31619 12.9297C9.3749 12.9296 9.43361 12.9297 9.49233 12.9298C10.3981 12.9349 10.3981 12.9349 11.1678 12.4984C11.5263 12.1157 11.5484 11.6467 11.5325 11.1501C11.5319 11.1311 11.5314 11.1121 11.5308 11.0926C11.498 10.0732 11.3257 8.87559 10.5515 8.13554C10.2812 7.90581 9.9085 7.75333 9.54908 7.75879C9.42596 7.78293 9.32608 7.86424 9.22431 7.93404C9.17475 7.96675 9.12515 7.99942 9.07551 8.03202C9.05166 8.04785 9.02781 8.06368 9.00323 8.07999C8.19754 8.60897 7.21312 8.86672 6.25596 8.6816C5.59973 8.54027 5.0511 8.26163 4.49979 7.885C4.29551 7.74925 4.15144 7.75007 3.91637 7.81089Z" fill="#1D1D1D"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_3038_1847">
                      <rect width="13" height="13" fill="white" transform="translate(0.414062 0.694336)"/>
                    </clipPath>
                  </defs>
                </svg>
                {expert.reviews} Session done
              </span>
            </motion.div>
          </div>
        </motion.div>
        <motion.button 
          className={`text-gray-400 hover:text-red-500 transition-colors ${isFavorite ? 'text-red-500' : ''}`}




























          onClick={handleFavoriteClick}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          animate={isFavorite ? {
            scale: [1, 1.2, 1],
            transition: { duration: 0.3 }
          } : {}}




        >
          <svg 
            className="w-6 h-6" 
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
        <p className="text-gray-600 text-sm">Experience: {totalExperience}</p>
        <p className="text-sm">
          Starts at <span className="text-primary font-medium">Rs{startingPrice}</span> for {duration}mins
        </p>
      </motion.div>

      {/* <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex flex-wrap gap-2">
          <p className="text-sm text-gray-600">Expertise:</p>
          {expert.credentials.expertise.map((skill, index) => (
            <motion.span 
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
@@ -266,41 +214,38 @@ const ExpertCard = ({ expert }) => {
              className="text-sm px-3 py-1 bg-gray-100 rounded-full text-gray-700"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </motion.div> */}

      <motion.div 
        className="flex items-center justify-between mt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div>
          <p className="text-sm text-gray-600">Next Available Slot:</p>
          <p className="text-sm text-primary">{firstAvailableDay ? `${firstAvailableDay.day}, ${firstAvailableTime}` : "No slots available"}</p>
        </div>
        <div className="flex gap-2">
          <motion.button 
            className="px-4 py-2 text-gray-700 text-sm font-medium hover:bg-gray-50 rounded-lg border border-gray-200"
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate(`/expert/${expert.redirect_url}`)}
            whileTap={{ scale: 0.95 }}
          >
            View Profile
          </motion.button>
          <motion.button 
            className="btn-expert text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Book
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};