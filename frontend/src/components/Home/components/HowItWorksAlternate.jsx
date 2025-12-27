import { motion } from "framer-motion";
import { IoSearch, IoCalendarClearOutline  } from "react-icons/io5";
import { FaVideo, FaCalendar  } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";

const features = [
  {
    icon: (
      <IoSearch className="w-6 h-6 font-black text-[#169544]"/>
    ),
    title: "Discover Mentors",
    description: "Get matched with Mentors who truly understand your journey.",
  },
  {
    icon: (
      <FaCalendar  className="w-6 h-6 font-bold text-[#169544]"/>
    ),
    title: "Book Your Session",
    description: "Schedule easily, at times that works you, Effortlessly",
  },
  {
    icon: (
      <FaVideo className="w-6 h-6 font-bold text-[#169544]"/>
    ),
    title: "Connect 1:1",
    description: "Dive into live sessions and chats, personalized for you.",
  },
  {
    icon: (
      <svg
        className="w-6 h-6 text-[#169544]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={3}
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
        <div className="grid grid-cols-1 gap-2 md:gap-4  relative">
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
                whileHover={{ scale: 1.02, y: -4 }}
                className={`bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-200 max-w-lg overflow-hidden ${
                  index % 2 === 0 ? "ml-0 mr-auto" : "ml-auto mr-0"
                }`}
              >
                <div className="p-8">
                  {/* Icon and Title Row */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-gradient-to-br from-green-200 to-green-300 border-2 border-transparent rounded-xl shadow-lg">
                      <div className="text-white">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 leading-tight">
                      {feature.title}
                    </h3>
                  </div>
                  
                  {/* Description */}
                  <div className="pl-1">
                    <p className="text-gray-600 leading-relaxed text-base">
                      {feature.description}
                    </p>
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
