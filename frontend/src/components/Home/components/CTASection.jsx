import { motion } from 'framer-motion';

const CTASection = ({ onOpenSearchModal }) => {
  return (
    <div className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-block mb-8">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-lg font-medium bg-gradient-to-br from-green-200 to-green-300 border-transparent border-2 border-green-600 text-primary shadow-lg">
              Still scrolling?
            </span>
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 tracking-tight"
          >
            Let's Find Your Perfect Mentor Match
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-gray-600 mb-10"
          >
            Our AI-powered matching system will connect you with the ideal mentor for your needs
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05, height: 48 }}
            whileTap={{ scale: 0.95, height: 48 }}
            onClick={onOpenSearchModal}
            className="btn-expert"
          >
            Find Your Mentor Now
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default CTASection;