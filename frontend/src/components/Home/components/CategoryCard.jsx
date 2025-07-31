import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ icon, title, value }) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/explore?category=${encodeURIComponent(value)}`);
  };
  return (
    <motion.div
      onClick={handleClick}
      initial={{ scale: 1 }}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        borderColor: "#169544"
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        type: "spring",
        stiffness: 500,
        damping: 15,
        mass: 0.8,
        duration: 0.2
      }}
      className="bg-white p-1.5 sm:p-3 rounded-lg shadow-sm border border-gray-100 cursor-pointer flex flex-col items-center justify-center gap-0.5 sm:gap-1.5 h-[60px] sm:h-[80px] transition-colors duration-200"
    >
      <motion.div 
        whileHover={{ scale: 1.1 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 15,
          mass: 0.8,
          duration: 0.2
        }}
        className="w-5 h-5 sm:w-7 sm:h-7 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center"
      >
        {typeof icon === 'string' ? (
          <span className="text-sm sm:text-base">{icon}</span>
        ) : (
          icon
        )}
      </motion.div>
      <p className="text-xs sm:text-sm font-medium text-center">{title}</p>
    </motion.div>
  );
};

export default CategoryCard;