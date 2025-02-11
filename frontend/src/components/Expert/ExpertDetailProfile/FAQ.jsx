import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b last:border-b-0">
      <button
        className="w-full py-4 flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium">{question}</span>
        {isOpen ? <FaChevronUp /> : <FaChevronDown />}
      </button>
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out transform ${
          isOpen ? 'max-h-[500px] opacity-100 scale-100' : 'max-h-0 opacity-0 scale-95'
        }`}
      >
        {isOpen && (
          <div className="pb-4 text-gray-600">
            {answer}
          </div>
        )}
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    {
      question: "What can I expect from a coaching session?",
      answer: "In our coaching sessions, you can expect personalized guidance tailored to your career goals. We'll work together to identify challenges, develop strategies, and create actionable plans for your professional growth."
    },
    {
      question: "How long are the coaching sessions?",
      answer: "Sessions are available in different durations: 50 minutes, 100 minutes, or 150 minutes. You can choose the length that best suits your needs and schedule."
    },
    {
      question: "What is your cancellation policy?",
      answer: "Cancellations made 24 hours before the scheduled session will receive a full refund. Late cancellations or no-shows may be subject to a cancellation fee."
    },
    {
      question: "Do you offer refunds?",
      answer: "Yes, we offer full refunds for cancellations made 24 hours in advance. Partial refunds may be available in certain circumstances. Please contact us for more details."
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 mt-6">
      <h2 className="text-black text-center font-Figtree text-2xl font-semibold leading-6 mb-5">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </div>
  );
};

export default FAQ;
