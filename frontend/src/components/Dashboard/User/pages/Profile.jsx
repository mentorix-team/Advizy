import { useState, useEffect } from "react";
import { AiOutlineUser } from "react-icons/ai";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/Redux/Slices/authSlice";
import { generateOtpforValidating } from "@/Redux/Slices/expert.Slice";
import VerifyThedetails from "@/components/Auth/VerifyThedetails";
import { CircleCheckBig } from 'lucide-react';

export default function Profile() {
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.auth);
  const [showOtpPopup, setShowOtpPopup] = useState(false);
  const [contactInfo, setContactInfo] = useState("");
  const [verificationType, setVerificationType] = useState(""); // 'email' or 'mobile'

  const userData = JSON.parse(data);
  
  // Store the original values for comparison
  const originalEmail = userData.email;
  const originalPhone = userData.number || "";

  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    phone: userData.number || "",
    dateOfBirth: userData.dob || "",
    gender: userData.gender || "",
    interests: userData.interests || [],
  });

  // Initialize verification status - auto-verify if matches original data
  const [verificationStatus, setVerificationStatus] = useState({
    email: true, // Auto-verify if using original email
    phone: Boolean(userData.number), // Auto-verify if original number exists
  });

  const [errors, setErrors] = useState({});
  
  // Store previous values for comparison to prevent unnecessary verification resets
  const [prevValues, setPrevValues] = useState({
    email: userData.email,
    phone: userData.number || "",
  });

  useEffect(() => {
    const savedData = localStorage.getItem("profileData");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setFormData(parsedData);
      
      // Update previous values for comparison
      setPrevValues({
        email: parsedData.email,
        phone: parsedData.phone
      });
    }
    
    // Load verification status from localStorage, but maintain auto-verification
    const savedVerification = localStorage.getItem("verificationStatus");
    if (savedVerification) {
      const parsedVerification = JSON.parse(savedVerification);
      
      // If email matches original, keep it verified regardless of saved status
      const emailVerified = formData.email === originalEmail ? true : parsedVerification.email;
      
      // If phone matches original, keep it verified regardless of saved status
      const phoneVerified = formData.phone === originalPhone && originalPhone !== "" ? true : parsedVerification.phone;
      
      setVerificationStatus({
        email: emailVerified,
        phone: phoneVerified
      });
    }
  }, []);

  // Check if both email and phone are verified
  const isBothVerified = verificationStatus.email && verificationStatus.phone;

  const interests = [
    { id: "technology", label: "Technology", category: "col1" },
    { id: "health", label: "Health", category: "col1" },
    { id: "arts", label: "Arts", category: "col1" },
    { id: "business", label: "Business", category: "col2" },
    { id: "education", label: "Education", category: "col2" },
    { id: "science", label: "Science", category: "col2" },
  ];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    const phoneRegex = /^\d{10}$/;
    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (formData.dateOfBirth) {
      const selectedDate = new Date(formData.dateOfBirth);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Only reset verification status if value actually changed from original data
    if ((name === "email" && value !== originalEmail && value !== prevValues.email) ||
        (name === "phone" && value !== originalPhone && value !== prevValues.phone)) {
      setVerificationStatus((prev) => ({
        ...prev,
        [name]: false,
      }));
      
      // Update previous values for comparison
      setPrevValues(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Auto-verify if value matches original from user data
    if ((name === "email" && value === originalEmail) || 
        (name === "phone" && value === originalPhone && originalPhone !== "")) {
      setVerificationStatus(prev => ({
        ...prev,
        [name]: true
      }));
    }
    
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    const numbers = value.replace(/\D/g, "");
    const truncated = numbers.slice(0, 10);
    
    // Store previous phone value before updating
    const previousPhone = formData.phone;
    
    setFormData((prev) => ({
      ...prev,
      phone: truncated,
    }));
    
    // Only reset verification if the value actually changes AND doesn't match original
    if (truncated !== previousPhone && truncated !== originalPhone) {
      setVerificationStatus((prev) => ({
        ...prev,
        phone: false,
      }));
      
      // Update previous value for future comparison
      setPrevValues(prev => ({
        ...prev,
        phone: truncated
      }));
    }
    
    // Auto-verify if matches original phone
    if (truncated === originalPhone && originalPhone !== "") {
      setVerificationStatus(prev => ({
        ...prev,
        phone: true
      }));
    }
    
    if (errors.phone) {
      setErrors((prev) => ({
        ...prev,
        phone: "",
      }));
    }
  };

  const handleVerify = async (type) => {
    setVerificationType(type);
    setContactInfo(type === "email" ? formData.email : formData.phone);
    setShowOtpPopup(true);
    
    try {
      if (type === "email") {
        await dispatch(generateOtpforValidating(formData.email));
      }
      if (type === "phone") {
        await dispatch(generateOtpforValidating(formData.phone));
      }
    } catch (error) {
      toast.error(`Failed to send verification code to your ${type}`);
    }
  };

  const handleOtpVerificationSuccess = () => {
    setShowOtpPopup(false);
    
    // Update verification status
    const newVerificationStatus = {
      ...verificationStatus,
      [verificationType]: true
    };
    
    // Update state
    setVerificationStatus(newVerificationStatus);
    
    // Save to localStorage immediately
    localStorage.setItem('verificationStatus', JSON.stringify(newVerificationStatus));
    
    // Update previous values to maintain verification if value changes back
    setPrevValues(prev => ({
      ...prev,
      [verificationType === "email" ? "email" : "phone"]: formData[verificationType === "email" ? "email" : "phone"]
    }));
    
    toast.success(`${verificationType === 'email' ? 'Email' : 'Phone'} verified successfully!`);
  };

  const handleInterestChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      interests: checked
        ? [...prev.interests, value]
        : prev.interests.filter((interest) => interest !== value),
    }));
  };

  const handleSave = async () => {
    if (validateForm()) {
      console.log("this is formData", formData);
      const response = await dispatch(updateUser(formData));
      localStorage.setItem("profileData", JSON.stringify(formData));
      localStorage.setItem(
        "verificationStatus",
        JSON.stringify(verificationStatus)
      );
      toast.success("Changes saved successfully");
      
      // Update previous values after saving
      setPrevValues({
        email: formData.email,
        phone: formData.phone
      });
    } else {
      toast.error("Please fix the errors before saving");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Toaster position="top-right" />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Your Profile</h1>
          <p className="text-gray-600 mt-1">
            Keep your profile updated to get the most out of your mentorship
            experience.
          </p>
          {!isBothVerified && (
            <p className="text-amber-600 mt-1 font-medium">
              Please verify both your email and phone number to save changes.
            </p>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={!isBothVerified}
          className={`w-full sm:w-auto px-4 py-2 rounded-lg transition-colors ${
            isBothVerified 
              ? "bg-green-600 text-white hover:bg-green-700" 
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Save Changes
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
        <div className="flex items-center gap-2 text-green-600 font-medium mb-6">
          <AiOutlineUser className="text-xl" />
          <span>Basic Information</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.firstName ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border ${
                errors.lastName ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address * {verificationStatus.email && (
                <span className="text-green-600 text-xs ml-1">(Verified)</span>
              )}
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="Enter your email address"
                />
              </div>
              <div className="flex items-center">
                {verificationStatus.email ? (
                  <div className="flex items-center px-4 py-2 text-sm font-semibold bg-green-100 text-green-800 rounded-full">
                    <CircleCheckBig className="w-4 h-4 mr-1 text-primary" />
                    Verified
                  </div>
                ) : (
                  <button
                    onClick={() => handleVerify("email")}
                    disabled={!formData.email || (errors.email ? true : false)}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
                      !formData.email || errors.email
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    Verify Email
                  </button>
                )}
              </div>
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
            {formData.email === originalEmail && (
              <p className="mt-1 text-xs text-green-600">
                Using your original email (auto-verified)
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number * {verificationStatus.phone && (
                <span className="text-green-600 text-xs ml-1">(Verified)</span>
              )}
            </label>
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={`w-full px-3 py-2 border ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  placeholder="Enter 10-digit phone number"
                  maxLength="10"
                />
              </div>
              <div className="flex items-center">
                {verificationStatus.phone ? (
                  <div className="flex items-center px-4 py-2 text-sm font-semibold bg-green-100 text-green-800 rounded-full">
                    <CircleCheckBig className="w-4 h-4 mr-1 text-primary" />
                    Verified
                  </div>
                ) : (
                  <button
                    onClick={() => handleVerify("phone")}
                    disabled={formData.phone.length !== 10}
                    className={`px-3 py-2 text-sm rounded-lg transition-colors whitespace-nowrap ${
                      formData.phone.length !== 10
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    Verify Phone
                  </button>
                )}
              </div>
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
            {formData.phone === originalPhone && originalPhone !== "" && (
              <p className="mt-1 text-xs text-green-600">
                Using your original phone number (auto-verified)
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="dateOfBirth"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              max={today}
              className={`w-full px-3 py-2 border ${
                errors.dateOfBirth ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-500">{errors.dateOfBirth}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <h2 className="text-lg font-medium mb-4">Areas of Interest</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-3">
          <div className="space-y-3">
            {interests
              .filter((interest) => interest.category === "col1")
              .map((interest) => (
                <label
                  key={interest.id}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    value={interest.id}
                    checked={formData.interests.includes(interest.id)}
                    onChange={handleInterestChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-gray-700">{interest.label}</span>
                </label>
              ))}
          </div>
          <div className="space-y-3">
            {interests
              .filter((interest) => interest.category === "col2")
              .map((interest) => (
                <label
                  key={interest.id}
                  className="flex items-center space-x-3"
                >
                  <input
                    type="checkbox"
                    value={interest.id}
                    checked={formData.interests.includes(interest.id)}
                    onChange={handleInterestChange}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-gray-700">{interest.label}</span>
                </label>
              ))}
          </div>
        </div>
      </div>
      {showOtpPopup && (
        <VerifyThedetails
          onClose={() => setShowOtpPopup(false)}
          onSwitchView={handleOtpVerificationSuccess}
          contactInfo={contactInfo}
        />
      )}
    </div>
  );
}