import { motion } from 'framer-motion';

const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    ),
    title: "Discover Experts",
    description: "Get matched with Experts who truly understand your journey."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "Book Your Session",
    description: "Schedule easily, at times that works you, Effortlessly"
  },
  {
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    title: "Connect 1:1",
    description: "Dive into live sessions and chats, personalized for you."
  },
  {
    icon: (
      <svg className="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Achieve Your Goals",
    description: "Grow, succeed, and rediscover Experts whenever you need them."
  }
];

const HowItWorksAlternate = () => {
  return (
    <div className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Your Journey with Mentorixx</h2>
          <p className="text-xl text-gray-600">Discover. Learn. Succeed</p>
        </motion.div>

        <div className="relative">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`flex items-center gap-8 mb-16 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Feature Content */}
              <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12' : 'pl-12'}`}>
                <motion.div 
                  className="bg-[#F2F2F2] rounded-2xl p-8 relative cursor-pointer"
                  whileHover={{ 
                    scale: 1.05,
                    y: -10,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
                    backgroundColor: "#F2F2F2",
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 20
                    }
                  }}
                >
                  {/* Decorative Circle */}
                  <motion.div 
                    className={`absolute w-48 h-48 rounded-full bg-[#169544] opacity-10 ${
                      index % 2 === 0 ? '-left-24' : '-right-24'
                    } -bottom-24`}
                    whileHover={{
                      scale: 1.2,
                      opacity: 0.15,
                      transition: {
                        duration: 0.3
                      }
                    }}
                  />
                  
                  <div className="relative z-10">
                    <motion.div 
                      className="w-12 h-12 bg-[#E8F5E9] rounded-lg flex items-center justify-center text-primary mb-6"
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: {
                          type: "spring",
                          stiffness: 400,
                          damping: 10
                        }
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                    <motion.h3 
                      className="text-xl font-bold mb-3"
                      whileHover={{
                        x: 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {feature.title}
                    </motion.h3>
                    <motion.p 
                      className="text-gray-600"
                      whileHover={{
                        x: 5,
                        transition: { duration: 0.2 }
                      }}
                    >
                      {feature.description}
                    </motion.p>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Space */}
              <div className="w-1/2">
                {/* Empty space for visual balance */}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksAlternate;