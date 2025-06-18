import React, { useState, useEffect } from "react";
import { X, Phone } from "lucide-react";
import axios from "axios";
import SmallSpinner from "@/components/LoadingSkeleton/SmallSpinner";
import { useDispatch } from "react-redux";
import { fetchSupportQueries } from "@/Redux/Slices/supportQueriesSlice";

function RequestCallModal({ isOpen, onClose, expertName, expertPhone }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    issue: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormData({
          fullName: expertName || "",
          phoneNumber: expertPhone || "",
          issue: "",
        });
        setErrors({});
        setSubmitted(false);
      }, 300);
    }
  }, [isOpen, expertName, expertPhone]);

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[0-9\s\-()]{8,}$/.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        name: formData.fullName,
        mobile: formData.phoneNumber,
        problem: formData.issue,
      };

      await axios.post(
        "https://advizy.onrender.com/api/v1/expert/help-center",
        payload,
        { withCredentials: true }
      );

      setSubmitted(true);
      setTimeout(() => {
        onClose();
      }, 2000);

      dispatch(fetchSupportQueries());
    } catch (error) {
      console.error(
        "Submission failed:",
        error.response?.data?.error || error.message
      );
      alert("Failed to submit request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-50 z-40" : "opacity-0 -z-10"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 bottom-0 w-full md:w-[480px] bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="border-b p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">Request a Call</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        <div
          className="p-6 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 70px)" }}
        >
          {!submitted ? (
            <>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                <h3 className="text-lg font-medium text-green-700">
                  Need Assistance?
                </h3>
                <p className="text-green-600">
                  Our team will get back to you shortly.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label htmlFor="fullName" className="block mb-2 font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.fullName ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder="Enter your full name"
                    readOnly
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="mb-5">
                  <label
                    htmlFor="phoneNumber"
                    className="block mb-2 font-medium"
                  >
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full p-3 border ${
                      errors.phoneNumber ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder="Enter your phone number"
                    readOnly
                  />
                  {errors.phoneNumber && (
                    <p className="mt-1 text-red-500 text-sm">
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                <div className="mb-8">
                  <label htmlFor="issue" className="block mb-2 font-medium">
                    Describe Your Issue (Optional)
                  </label>
                  <textarea
                    id="issue"
                    name="issue"
                    value={formData.issue}
                    onChange={handleChange}
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Please provide details about your issue"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center justify-center transition-colors duration-300"
                >
                  {loading ? (
                    <SmallSpinner />
                  ) : (
                    <>
                      <Phone className="w-5 h-5 mr-2" />
                      Request Call Back
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-10">
              <div className="bg-green-100 rounded-full p-3 inline-flex mb-4">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Request Submitted!</h3>
              <p className="text-gray-600">
                Thank you for your request. Our team will call you back shortly
                at {formData.phoneNumber}.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default RequestCallModal;
