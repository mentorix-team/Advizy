import { motion } from 'framer-motion';

const PricingSection = () => {
  const plans = [
    {
      title: "Standard Commission",
      subtitle: "Perfect for most experts",
      features: [
        "10% commission on earnings",
        "No upfront costs or monthly fees",
        "Access to all platform features",
        "Maximize your earnings potential"
      ],
      buttonText: "Start Earning Now",
      buttonStyle: "primary"
    },
    {
      title: "Need More Flexibility?",
      subtitle: "For experts handling large client bases or high session volumes",
      features: [
        "Flexible commission rates based on your needs",
        "Simple and scalable for growing requirements",
        "Rates tailored to platform usage",
        "Designed to adapt as you grow"
      ],
      buttonText: "Contact for Custom Pricing",
      buttonStyle: "outline"
    }
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ 
              scale: 1.05,
              y: -10,
              borderColor: '#169544',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
              }
            }}
            className="bg-white rounded-lg p-8 border border-[#E8F5E9] relative group"
          >
            {/* Green line at the top */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#169544] rounded-t-lg" />

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-[#1D2939] mb-2">
                {plan.title}
              </h3>
              <p className="text-gray-600 text-sm">
                {plan.subtitle}
              </p>
            </div>

            <ul className="space-y-4 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-[#169544] flex-shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path
                      d="M8 12L11 15L16 9"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-gray-600 text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                plan.buttonStyle === 'primary'
                  ? 'bg-[#169544] text-white hover:bg-[#138339]'
                  : 'border border-[#169544] text-[#169544] hover:bg-[#E8F5E9]'
              } flex items-center justify-center gap-2`}
            >
              {plan.buttonStyle === 'outline' && (
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V6C22 4.89543 21.1046 4 20 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              )}
              {plan.buttonText}
            </motion.button>

            {/* Add shadow on hover */}
            <div className="absolute inset-0 rounded-lg transition-shadow group-hover:shadow-xl" />
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="text-center text-2xl sm:text-3xl font-bold text-[#169544] mt-12 sm:mt-16"
      >
        Simple, affordable, and designed to help you grow.
      </motion.p>
    </>
  );
};

export default PricingSection;