import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAutoScroll } from '../hooks/useAutoScroll';

const testimonials = [
  {
    rating: 4,
    text: "Advizy helped me level up my skills and land a promotion. My mentor's guidance was invaluable.",
    name: "Alex Thompson",
    title: "Marketing Manager",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop"
  },
  {
    rating: 5,
    text: "The personalized mentoring sessions transformed my career trajectory. I gained invaluable insights and practical skills.",
    name: "Sarah Chen",
    title: "Product Designer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
  },
  {
    rating: 4,
    text: "Found the perfect mentor who helped me transition into tech. The structured approach and feedback were exceptional.",
    name: "Michael Foster",
    title: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop"
  },
  {
    rating: 5,
    text: "The mentorship program exceeded my expectations. My mentor's industry experience and network were invaluable.",
    name: "Emily Rodriguez",
    title: "Business Analyst",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop"
  }
];

const TestimonialsSection = () => {
  const [clonedTestimonials, setClonedTestimonials] = useState([]);
  const { scrollRef, handleMouseEnter, handleMouseLeave } = useAutoScroll(0.5);

  useEffect(() => {
    setClonedTestimonials([...testimonials, ...testimonials, ...testimonials]);
  }, []);

  return (
    <div className="max-w-[1920px] py-16 sm:py-20 lg:py-24 bg-gray-50 w-full">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center items-center gap-2 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="35" viewBox="0 0 34 35" fill="none">
              <path d="M6.49258 24.6045C5.03342 23.0547 4.25 21.3164 4.25 18.4987C4.25 13.5403 7.73075 9.09624 12.7925 6.89899L14.0576 8.85115C9.333 11.4068 8.40933 14.7232 8.041 16.8142C8.80175 16.4204 9.79767 16.283 10.7737 16.3737C13.3294 16.6102 15.3439 18.7083 15.3439 21.3164C15.3439 22.6314 14.8215 23.8926 13.8917 24.8225C12.9618 25.7523 11.7006 26.2747 10.3856 26.2747C9.65834 26.2685 8.9396 26.1176 8.27125 25.8308C7.60289 25.5441 6.99827 25.1272 6.49258 24.6045ZM20.6592 24.6045C19.2001 23.0547 18.4167 21.3164 18.4167 18.4987C18.4167 13.5403 21.8974 9.09624 26.9592 6.89899L28.2242 8.85115C23.4997 11.4068 22.576 14.7232 22.2077 16.8142C22.9684 16.4204 23.9643 16.283 24.9404 16.3737C27.4961 16.6102 29.5106 18.7083 29.5106 21.3164C29.5106 22.6314 28.9882 23.8926 28.0583 24.8225C27.1285 25.7523 25.8673 26.2747 24.5522 26.2747C23.825 26.2685 23.1063 26.1176 22.4379 25.8308C21.7696 25.5441 21.1649 25.1272 20.6592 24.6045Z" fill="#16A348"/>
            </svg>
            <h2 className="text-3xl sm:text-4xl font-bold">Success Stories</h2>
            <svg xmlns="http://www.w3.org/2000/svg" width="34" height="35" viewBox="0 0 34 35" fill="none">
              <path d="M27.5068 9.52831C28.966 11.0781 29.7494 12.8164 29.7494 15.6341C29.7494 20.5925 26.2701 25.0366 21.2069 27.2338L19.9418 25.2816C24.6664 22.726 25.5901 19.4096 25.9598 17.3186C25.1991 17.7124 24.2031 17.8498 23.2256 17.7591C20.67 17.5226 18.6555 15.4245 18.6555 12.8164C18.6555 11.5014 19.1779 10.2402 20.1077 9.31033C21.0376 8.38046 22.2988 7.85806 23.6138 7.85806C25.1339 7.85806 26.5888 8.55223 27.5068 9.52831ZM13.3401 9.52831C14.7993 11.0781 15.5827 12.8164 15.5827 15.6341C15.5827 20.5925 12.1034 25.0366 7.04023 27.2338L5.77515 25.2816C10.4997 22.726 11.4234 19.4096 11.7917 17.3186C11.031 17.7124 10.0351 17.8498 9.05898 17.7591C6.50332 17.524 4.49023 15.4259 4.49023 12.8164C4.49023 11.5014 5.01263 10.2402 5.9425 9.31033C6.87236 8.38046 8.13354 7.85806 9.44857 7.85806C10.9686 7.85806 12.4236 8.55223 13.3416 9.52831" fill="#16A348"/>
            </svg>
          </div>
          <p className="text-lg text-gray-600">
            Transforming careers, one session at a time
          </p>
        </motion.div>

        <div className="relative">
          <div 
            ref={scrollRef}
            className="flex gap-6 overflow-x-hidden pb-8 hide-scrollbar"
            style={{ 
              scrollBehavior: 'auto', 
              WebkitOverflowScrolling: 'touch',
              cursor: 'grab',
              paddingTop: '20px',
              marginTop: '-20px'
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {clonedTestimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0 }}
                whileHover={{ 
                  scale: 1.08,
                  y: -10,
                  borderColor: '#169544',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                  transition: {
                    duration: 0.5
                  }
                }}
                className="flex-shrink-0 w-[300px] sm:w-[350px] bg-white p-6 rounded-2xl shadow-sm border border-transparent transform-gpu z-10"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 mb-6">"{testimonial.text}"</p>

                <div className="flex items-center gap-4">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;