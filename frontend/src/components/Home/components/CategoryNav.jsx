import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const CategoryNav = ({ categories }) => {
  const navigate = useNavigate();

  // console.log("Rendering CategoryNav with categories:", categories);
  return (
    <motion.div

      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-16 left-0 right-0 z-40 bg-white border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-8 overflow-x-auto hide-scrollbar py-3">
          {categories.map((category) => (
            <motion.button
              key={category.title}
              onClick={() => navigate(`/explore?category=${category.value}`)}
              initial={{ scale: 1 }}
              whileHover={{
                scale: 1.1,
                color: "#169544",
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                  mass: 0.8,
                  duration: 0.2
                }
              }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-gray-600 hover:text-primary font-medium whitespace-nowrap transition-colors duration-200"
            >
              <motion.span
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 15,
                  mass: 0.8,
                  duration: 0.2
                }}
                className="flex items-center justify-center"
              >
                {typeof category.icon === 'string' ? (
                  <span className="text-lg">{category.icon}</span>
                ) : (
                  category.icon
                )}
              </motion.span>
              {category.title}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default CategoryNav;