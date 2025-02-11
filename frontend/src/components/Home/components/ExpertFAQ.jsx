import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const faqs = [
  {
    question: "How do I get started as an expert on Mentorix?",
    answer: "Getting started is simple: 1) Create your profile and verify your expertise, 2) Set up your availability and service offerings, 3) Complete our brief onboarding process, and 4) Start accepting client bookings. Our team will guide you through each step."
  },
  {
    question: "What types of experts does Mentorix accept?",
    answer: "We welcome experts from various fields including business, technology, health & wellness, career development, education, and creative arts. The key requirements are proven expertise in your field, professional experience, and a passion for mentoring others."
  },
  {
    question: "How does payment work?",
    answer: "Payments are handled securely through our platform. You set your own rates, and we handle all payment processing. Earnings are automatically transferred to your account every two weeks, with a small platform fee deducted for our services."
  },
  {
    question: "Do we need external tools for video consultations?",
    answer: "No, Mentorix provides a built-in video consultation platform. You don't need any external tools - just a reliable internet connection and a device with a camera and microphone."
  },
  {
    question: "How does Mentorix ensure client quality?",
    answer: "We maintain high standards through our client verification process, clear booking policies, and a robust review system. We also provide tools to help you manage your schedule and client relationships effectively."
  }
];

const FAQItem = ({ question, answer }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="border border-gray-100 rounded-lg overflow-hidden mb-4 cursor-pointer"
      initial={false}
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="w-full px-6 py-4 text-left flex justify-between items-center gap-4"
      >
        <span className={`text-lg font-medium pr-8 transition-colors duration-200 ${isHovered ? "text-primary" : "text-gray-900"}`}>
          {question}
        </span>
        <motion.div
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center"
          animate={{ rotate: isHovered ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <svg 
            className={`w-5 h-5 transition-colors duration-200 ${isHovered ? "text-primary" : "text-gray-400"}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </div>

      <AnimatePresence initial={false}>
        {isHovered && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <div className="px-6 py-4 border-t border-gray-100 bg-[#F9FDF9]">
              <motion.p 
                className="text-gray-600"
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

const ExpertFAQ = () => {
  return (
    <div className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="inline-block"
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full text-lg font-medium bg-green-50 text-primary">
              Got Questions?
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl font-bold mt-6 mb-4"
          >
            Frequently Asked Questions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-600"
          >
            Everything you need to know about becoming an expert
          </motion.p>
        </div>

        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">Still have questions?</p>
          <button className="btn-expert">
            Contact Support
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default ExpertFAQ;