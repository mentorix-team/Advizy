import React from 'react';
import FAQItem from './FAQItem';

function FAQSection() {
  const faqItems = [
    {
      id: 1,
      question: "How do I schedule a meeting with a client?",
      answer: "You can schedule a meeting with a client through our calendar tool in your dashboard. Simply select the available time slots and send an invitation to your client's email address."
    },
    {
      id: 2,
      question: "What payment methods do you support?",
      answer: "We support various payment methods including credit/debit cards, PayPal, bank transfers, and digital wallets like Apple Pay and Google Pay."
    },
    {
      id: 3,
      question: "How can I update my availability?",
      answer: "You can update your availability by going to your profile settings and selecting the 'Availability' tab. From there, you can set your working hours and block out any time you're unavailable."
    },
    {
      id: 4,
      question: "What should I do if a client doesn't show up for a meeting?",
      answer: "If a client doesn't show up, wait for 15 minutes, then mark the meeting as 'No Show' in your calendar. You can send a follow-up message to reschedule or use our automated reminder system for future meetings."
    },
    {
      id: 5,
      question: "How do I receive my earnings?",
      answer: "Earnings are processed every two weeks and deposited directly to your connected bank account. You can view your payment history and pending transfers in the 'Earnings' section of your dashboard."
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-gray-100">
      <h2 className="text-2xl font-semibold text-center mb-2">Frequently Asked Questions</h2>
      <p className="text-gray-600 text-center mb-8">Quick answers to common questions</p>
      
      <div className="space-y-3">
        {faqItems.map(item => (
          <FAQItem 
            key={item.id}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </div>
  );
}

export default FAQSection;