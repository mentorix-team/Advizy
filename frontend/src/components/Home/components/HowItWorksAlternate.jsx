import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

const features = [
  {
    icon: '🔍',
    title: 'Discover Experts',
    description: 'Get matched with Experts who truly understand your journey.',
    image: 'https://i.postimg.cc/yYjLYCw7/Frame-1615.png'
  },
  {
    icon: '📅',
    title: 'Book Your Session',
    description: 'Schedule easily, at times that works you. Effortlessly',
    image: 'https://i.postimg.cc/CKsGJGSS/img2.png'
  },
  {
    icon: '🎥',
    title: 'Connect 1:1',
    description: 'Dive into live sessions and chats, personalized for you.',
    image: 'https://i.postimg.cc/59DVqGg5/img3.png'
  },
  {
    icon: '🎯',
    title: 'Achieve Your Goals',
    description: 'Grow, succeed, and rediscover mentors whenever you need them.',
    image: 'https://i.postimg.cc/Njkvt0cb/img4.png'
  }
];

const HowItWorksAlternate = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const subtitleOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const subtitleScale = useTransform(scrollYProgress, [0, 0.05], [1, 0.8]);
  const headerPadding = useTransform(scrollYProgress, [0, 0.05], [48, 24]);

  return (
    <div ref={containerRef} className="py-16 sm:py-20 lg:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div 
          className="sticky top-32 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center py-8"
          style={{ paddingTop: headerPadding }}
        >
          <h2 className="text-5xl sm:text-6xl font-bold text-center whitespace-nowrap">
            <span className="text-primary">"</span>
            Your Journey with Mentorixx
            <span className="text-primary">"</span>
          </h2>
          <motion.p 
            style={{ 
              opacity: subtitleOpacity,
              scale: subtitleScale,
              transformOrigin: 'center',
              margin: 0,
              height: useTransform(scrollYProgress, [0, 0.05], ["auto", "0"]),
              overflow: "hidden"
            }}
            className="text-2xl text-gray-600 text-center mt-2"
          >
            " Discover. Learn. Succeed "
          </motion.p>
        </motion.div>

        <div className="space-y-32 mt-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } items-center gap-16 lg:gap-24`}
            >
              <div className="flex-1 w-full lg:w-1/2">
                <motion.div 
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className={`bg-gray-50 rounded-3xl p-10 ${
                    index % 2 === 0 ? 'lg:mr-12' : 'lg:ml-12'
                  }`}
                >
                  <motion.div 
                    className="flex items-center gap-4 mb-6"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.span 
                      className="text-primary text-3xl"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                      transition={{ duration: 0.3 }}
                    >
                      {index === 0 && (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      )}
                      {index === 1 && (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                      {index === 2 && (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      )}
                      {index === 3 && (
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </motion.span>
                    <motion.h3 
                      className="text-3xl font-bold"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      {feature.title}
                    </motion.h3>
                  </motion.div>
                  <motion.p 
                    className="text-gray-600 text-xl"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                  >
                    "{feature.description}"
                  </motion.p>
                </motion.div>
              </div>

              <div className="flex-1 w-full lg:w-1/2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.02 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative aspect-[4/3]"
                >
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
                    animate={{
                      x: ['100%', '-100%'],
                      opacity: [0, 0.1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 3
                    }}
                  />
                  
                  {/* Floating animation for the image */}
                  <motion.img 
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-contain"
                    loading="lazy"
                    animate={{
                      y: [0, -10, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorksAlternate;