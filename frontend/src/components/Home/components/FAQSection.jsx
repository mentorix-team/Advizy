import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How does Advizyx work?",
    answer: "Advizyx connects you with verified experts in your field of interest. Simply browse our expert profiles, schedule a session at your preferred time, and connect virtually for personalized guidance."
  },
  {
    question: "How much does it cost?",
    answer: "Our pricing varies based on the expert's experience and session duration. Sessions typically range from $50-$200 per hour. You can view each expert's specific rates on their profile."
  },
  {
    question: "Can I become a mentor?",
    answer: "Yes! If you have expertise in your field and want to help others grow, you can apply to become a mentor. We carefully review each application to maintain our high-quality standards."
  },
  {
    question: "What if I'm not satisfied with my session?",
    answer: "Your satisfaction is our priority. If you're not completely satisfied with your session, we offer a money-back guarantee. Contact our support team within 24 hours of your session to discuss your concerns."
  }
];

const FAQItem = ({ question, answer }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="border border-[#E8F5E9] rounded-lg overflow-hidden mb-4 cursor-pointer bg-white"
      initial={false}
      animate={{ 
        backgroundColor: isHovered ? "rgba(249, 253, 249, 0.5)" : "white",
        scale: isHovered ? 1.02 : 1
      }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full px-6 py-4 text-left flex justify-between items-center">
        <span className={`text-base sm:text-lg font-medium transition-colors duration-200 ${isHovered ? "text-primary" : "text-[#1D1F1D]"}`}>
          {question}
        </span>
        <motion.span
          animate={{ rotate: isHovered ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`transition-colors duration-200 ${isHovered ? "text-primary" : "text-gray-400"}`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.span>
      </div>
      
      <AnimatePresence initial={false}>
        {isHovered && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="px-6 py-4 text-gray-600 text-sm sm:text-base border-t border-[#E8F5E9] bg-[#F9FDF9]">
              <motion.p
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FAQSection = () => {
  return (
    <div className="py-16 sm:py-20 lg:py-24" style={{ background: 'linear-gradient(180deg, rgba(231, 245, 236, 0.60) 50%, #FAFAFA 100%)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg sm:text-xl text-gray-600">
              " Everything you need to know about Advizyx "
            </p>
          </motion.div>

          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <FAQItem
                question={faq.question}
                answer={faq.answer}
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-12"
          >
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <button className="relative bg-[#169544] text-white px-8 py-3 rounded-xl font-medium 
         transition-all duration-200 overflow-hidden isolate
         hover:shadow-[5px_5px_0px_0px_#169544] hover:bg-white hover:border-2 border-[#169544]
         hover:text-[#374151]
         active:translate-x-[5px] active:translate-y-[5px] active:shadow-none;
}">
              Contact Support
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default FAQSection;