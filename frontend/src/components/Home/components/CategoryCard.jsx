import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CategoryCard = ({ icon, title }) => {
  const navigate = useNavigate();
  return (
    <motion.div
    onClick={() => navigate('/explore')}
      initial={{ scale: 1 }}
      whileHover={{ 
        scale: 1.1,
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
      className="bg-white p-2 sm:p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer flex flex-col items-center justify-center gap-1 sm:gap-2 h-[80px] sm:h-[100px] transition-colors duration-200"
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
        className="w-6 h-6 sm:w-8 sm:h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center"
      >
        {typeof icon === 'string' ? (
          <span className="text-base sm:text-lg">{icon}</span>
        ) : (
          icon
        )}
      </motion.div>
      <p className="text-xs sm:text-base font-medium text-center">{title}</p>
    </motion.div>
  );
};

export default CategoryCard;