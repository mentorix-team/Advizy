import { motion } from 'framer-motion';

const CategoryCard = ({ icon, title }) => {
  return (
    <motion.div
      initial={{ scale: 1 }}
      whileHover={{ 
        scale: 1.1,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        borderColor: "#169544"
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        type: "spring",
        stiffness: 500, // Increased from 400
        damping: 15,    // Reduced from 17
        mass: 0.8,      // Added mass for quicker response
        duration: 0.2   // Added duration constraint
      }}
      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 cursor-pointer flex flex-col items-center justify-center gap-2 h-[100px] transition-colors duration-200"
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
        className="w-8 h-8 bg-[#E8F5E9] text-primary rounded-full flex items-center justify-center"
      >
        {typeof icon === 'string' ? (
          <span className="text-lg">{icon}</span>
        ) : (
          icon
        )}
      </motion.div>
      <p className="text-base font-medium text-center">{title}</p>
    </motion.div>
  );
};

export default CategoryCard;