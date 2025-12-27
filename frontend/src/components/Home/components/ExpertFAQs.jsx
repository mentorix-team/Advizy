import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const faqs = [
    {
      question: "How do I get started as an mentor on Advizy?",
      answer:
        "Getting started is simple: 1) Create your profile and verify your expertise, 2) Set up your availability and service offerings, 3) Complete our brief onboarding process, and 4) Start accepting client bookings. Our team will guide you through each step.",
    },
    {
      question: "What types of mentors does Advizy accept?",
      answer:
        "We welcome mentors from various fields including business, technology, career development, education, and creative arts. The key requirements are proven expertise in your field, professional experience, and a passion for mentoring others.",
    },
    {
      question: "How does payment work?",
      answer:
        "Payments are handled securely through our platform. You set your own rates, and we handle all payment processing. Earnings are automatically transferred to your account after session completion, with a small platform fee deducted for our services.",
    },
    {
      question: "Do we need external tools for video consultations?",
      answer:
        "No, Advizy provides a built-in video consultation platform. You don't need any external tools - just a reliable internet connection and a device with a camera and microphone.",
    },
    {
      question: "How does Advizy ensure client quality?",
      answer:
        "We maintain high standards through our client verification process, clear booking policies, and a robust review system. We also provide tools to help you manage your schedule and client relationships effectively.",
    },
  ];

const FAQItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <motion.div
      className="border border-[#E8F5E9] rounded-lg overflow-hidden mb-4 cursor-pointer bg-white"
      initial={false}
      animate={{
        backgroundColor: isOpen ? "rgba(249, 253, 249, 0.5)" : "white",
        scale: isOpen ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
    >
      <div className="w-full line-clamp-2 px-6 py-4 text-left flex justify-between items-center">
        <span
          className={`text-base sm:text-lg font-medium  transition-colors duration-200 ${
            isOpen ? "text-primary" : "text-[#1D1F1D]"
          }`}
        >
          {question}
        </span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={`transition-colors duration-200 ${
            isOpen ? "text-primary" : "text-gray-400"
          }`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </motion.span>
      </div>

      <AnimatePresence initial={false}>
        {isOpen && (
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

const ExpertFAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  return (
    <div
      className="py-16 sm:py-20 lg:py-24"
      style={{
        background:
          "linear-gradient(180deg, rgba(231, 245, 236, 0.60) 50%, #FAFAFA 100%)",
      }}
    >
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
              Everything you need to know about Advizy
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
                isOpen={activeIndex === index}
                onClick={() =>
                  setActiveIndex(activeIndex === index ? null : index)
                }
              />
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-center mt-10"
          >
            <p className="text-gray-600 mb-4">Still have questions?</p>
            <motion.button 
              onClick={() => navigate("/contact")} 
              className="btn-expert"
              whileHover={{ scale: 1.05, height: 48 }}
              whileTap={{ scale: 0.95, height: 48 }}
            >
              Contact Support
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExpertFAQs;
