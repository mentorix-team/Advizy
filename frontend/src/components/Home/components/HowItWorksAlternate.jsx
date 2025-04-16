import { motion } from "framer-motion";

const features = [
  {
    icon: (
      <svg
        className="w-8 h-8 text-[#169544]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    ),
    title: "Discover Mentors",
    description: "Get matched with Mentors who truly understand your journey.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-[#169544]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Book Your Session",
    description: "Schedule easily, at times that works you, Effortlessly",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-[#169544]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
        />
      </svg>
    ),
    title: "Connect 1:1",
    description: "Dive into live sessions and chats, personalized for you.",
  },
  {
    icon: (
      <svg
        className="w-8 h-8 text-[#169544]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
    title: "Achieve Your Goals",
    description:
      "Grow, succeed, and rediscover Mentors whenever you need them.",
  },
];

const HowItWorksAlternate = () => {
  return (
    <div className="py-16 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="text-4xl text-[#169544] font-serif">"</span>
          <h2 className="text-4xl font-bold inline">
            Your Journey with Advizy
          </h2>
          <span className="text-4xl text-[#169544] font-serif">"</span>
          <p className="text-xl text-gray-600 mt-2">Discover. Learn. Succeed</p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#169544]/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#169544]/10 rounded-full translate-y-1/2 -translate-x-1/2" />

        {/* Features Grid */}
        <div className="grid grid-cols-1 gap-2 relative">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex items-center ${
                index % 2 === 0 ? "justify-start" : "flex-row-reverse"
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                className={`bg-gray-50 rounded-2xl shadow-sm border border-gray-100 max-w-lg h-[160px] flex items-center ${
                  index % 2 === 0 ? "ml-0 mr-auto" : "ml-auto mr-0"
                }`}
              >
                <div className="flex items-center gap-2 p-6 w-full">
                  <div className="p-2 bg-white rounded-lg shadow-sm flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksAlternate;
