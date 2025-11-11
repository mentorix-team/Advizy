import { useState } from "react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Navbar from "./components/Home/components/Navbar";
import SearchModal from "./components/Home/components/SearchModal";
import Footer from "./components/Home/components/Footer";
import axios from "axios";
import {
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MapPinned,
  Youtube,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ContactUs = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);
      // console.log("📤 Submitting contact form:", formData);

      try {
        const response = await axios.post(
          "https://advizy.onrender.com/api/v1/contact/create",
          formData
        );

        // console.log("✅ Contact form response:", response.data);

        if (response.data.success) {
          // console.log("📋 Form data sent successfully:", {
          //   name: formData.name,
          //   email: formData.email,
          //   message: formData.message
          // });

          toast.success(response.data.message || "Message sent successfully!", {
            duration: 3000,
            position: "top-right",
            style: {
              background: "#169544",
              color: "#fff",
              padding: "16px",
              borderRadius: "10px",
            },
          });

          // Reset form
          setFormData({
            name: "",
            email: "",
            message: "",
          });

          // console.log("🎉 Form reset successfully");
        }
      } catch (error) {
        console.error("❌ Error submitting contact form:", error);
        console.error("Error details:", error.response?.data || error.message);

        const errorMessage = error.response?.data?.message ||
          "Failed to send message. Please try again later.";

        toast.error(errorMessage, {
          duration: 4000,
          position: "top-right",
          style: {
            background: "#ef4444",
            color: "#fff",
            padding: "16px",
            borderRadius: "10px",
          },
        });
      } finally {
        setIsSubmitting(false);
        // console.log("🏁 Form submission complete");
      }
    } else {
      console.log("⚠️ Form validation failed:", errors);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleModalCategorySelect = (category) => {
    if (category.value) {
      navigate(`/explore?category=${category.value}`);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar
        onSearch={() => setIsModalOpen(true)}
        isExpertMode={isExpertMode}
      />
      <div className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full"
            >
              <div className="relative w-full h-full aspect-square sm:aspect-[4/3] lg:aspect-square">
                <div className="bg-gray-900 text-white rounded-lg p-8 h-full flex flex-col gap-7">
                  <div>
                    <h2 className="text-2xl font-semibold mb-8">
                      Contact Information
                    </h2>

                    <div className="mb-6 flex items-start">
                      <div className="mr-4 mt-1 text-green-500">
                        <MapPinned className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium mb-1">Visit our office</div>
                        <div className="text-gray-300 text-sm">
                          Mankhurd, Mumbai, Maharashtra, 400088
                        </div>
                      </div>
                    </div>

                    <div className="mb flex items-start">
                      <div className="mr-4 mt-1 text-green-500">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-medium mb-1">Email</div>
                        <div className="text-gray-300 text-sm">
                          contact@advizy.in
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="font-medium mb-3 ">Follow Us</div>
                    <div className="flex space-x-6">
                      <a
                        href="https://www.instagram.com/advizy.in?igsh=MnpxODl2N3duMXNx"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        <Instagram className="w-6 h-6" />
                      </a>
                      <a
                        href="https://www.linkedin.com/company/advizy-in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        <Linkedin className="w-6 h-6" />
                      </a>
                      <a
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.facebook.com/profile.php?id=61572851715307"
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        <Facebook className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="lg:pl-4"
            >
              <h2 className="text-4xl sm:text-5xl font-bold mb-4">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Have questions? We're here to help you on your journey.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your Name"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${errors.name ? "border-red-500" : "border-gray-200"
                      } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your Email"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${errors.email ? "border-red-500" : "border-gray-200"
                      } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Your Message"
                    rows="4"
                    className={`w-full px-4 py-3 rounded-lg bg-gray-50 border ${errors.message ? "border-red-500" : "border-gray-200"
                      } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors resize-none`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.message}
                    </p>
                  )}
                </div>

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                  className={`btn-expert w-full px-8 py-4 text-lg font-medium rounded-lg transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
        <SearchModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCategorySelect={handleModalCategorySelect}
        />
      </div>
      <Footer />
    </div>
  );
};

export default ContactUs;
