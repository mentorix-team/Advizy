import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import BasicInfo from "./components/BasicInfo";
import { basicFormSubmit } from "@/Redux/Slices/expert.Slice";
import { ArrowLeft } from "lucide-react";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { expertData, data, loading, error } = useSelector(
    (state) => state.auth
  );

  let user = null;
  if (data) {
    user = typeof data === "string" ? JSON.parse(data) : data;
  }

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loadingState, setLoadingState] = useState(false);

  let expert = null;

  if (expertData) {
    if (typeof expertData === "string") {
      try {
        expert = JSON.parse(expertData);
      } catch (error) {
        console.error("Error parsing expertData:", error);
        expert = null;
      }
    } else if (
      typeof expertData === "object" &&
      Object.keys(expertData).length > 0
    ) {
      expert = expertData;
    }
  }

  const [formData, setFormData] = useState({
    basic: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      gender: expert?.gender || "",
      dateOfBirth: expert?.dateOfBirth || "",
      nationality: expert?.nationality || "",
      city: expert?.city || "",
      mobile: user?.number || "",
      countryCode: expert?.countryCode || "",
      email: user?.email || "",
      languages: [],
    },
  });

  const validateBasicInfo = () => {
    const newErrors = {};
    const { basic } = formData;

    // First Name validation
    if (!basic.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (basic.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last Name validation
    if (!basic.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (basic.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Gender validation
    if (!basic.gender) {
      newErrors.gender = "Gender is required";
    }

    // Date of Birth validation
    if (!basic.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required";
    } else {
      const dob = new Date(basic.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = "You must be at least 18 years old";
      }
    }

    // Nationality validation
    if (!basic.nationality) {
      newErrors.nationality = "Nationality is required";
    }

    // City validation
    if (!basic.city.trim()) {
      newErrors.city = "City is required";
    } else if (basic.city.length < 2) {
      newErrors.city = "City name must be at least 2 characters";
    }

    // Mobile validation
    if (!basic.mobile) {
      newErrors.mobile = "Mobile number is required";
    } else if (basic.mobile.length < 10) {
      newErrors.mobile = "Please enter a valid mobile number";
    }

    // Email validation
    if (!basic.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basic.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Languages validation (optional but recommended)
    if (basic.languages.length === 0) {
      newErrors.languages = "Please select at least one language";
    }

    return newErrors;
  };

  const handleUpdateFormData = (tab, data) => {
    setFormData((prev) => ({
      ...prev,
      [tab]: data,
    }));

    // Clear errors for fields that are now valid
    if (tab === "basic") {
      const updatedErrors = { ...errors };
      Object.keys(data).forEach((field) => {
        if (data[field] && updatedErrors[field]) {
          delete updatedErrors[field];
        }
      });
      setErrors(updatedErrors);
    }
  };

  const handleNext = async () => {
    // Validate all fields and show all errors
    const validationErrors = validateBasicInfo();
    setErrors(validationErrors);

    // Mark all fields as touched to show all errors
    const allFields = Object.keys(formData.basic);
    const allTouched = {};
    allFields.forEach((field) => {
      allTouched[field] = true;
    });
    setTouched(allTouched);

    // If there are validation errors, show a toast and return
    if (Object.keys(validationErrors).length > 0) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoadingState(true);

    try {
      const basicData = new FormData();
      Object.keys(formData.basic).forEach(key => {
        if (key === 'languages') {
          basicData.append(key, JSON.stringify(formData.basic[key]));
        } else {
          basicData.append(key, formData.basic[key]);
        }
      });

      const response = await dispatch(basicFormSubmit(basicData)).unwrap();
      
      if (response.success) {
        toast.success("Basic information submitted successfully!");
        navigate("/dashboard/expert");
      } else {
        toast.error(response.message || "Failed to submit basic information");
      }
    } catch (error) {
      console.error("Error submitting basic form:", error);
      toast.error(error.message || "An error occurred while submitting the form");
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-800 hover:underline mb-4"
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
          <span>Back</span>
        </button>
        
        <div className="bg-white shadow-sm rounded-lg p-6 sm:p-8 mb-6">
          <div className="flex flex-col items-start gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Join <span className="text-primary font-extrabold">Advizy</span>
            </h1>
            <p className="text-md font-semibold text-gray-600">
              Empower others with your knowledge while growing your influence and
              professional reach.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="px-4 sm:px-6 lg:px-8">
            <BasicInfo
              formData={formData.basic}
              onUpdate={(data) => handleUpdateFormData("basic", data)}
              errors={errors}
              touched={touched}
              onBlur={(field) => setTouched({ ...touched, [field]: true })}
            />
          </div>
        </div>

        <div className="flex justify-end text-end mt-6">
          <button
            onClick={handleNext}
            disabled={loadingState}
            className={`px-4 sm:px-6 py-2 text-white rounded-lg transition ${
              loadingState
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-green-600"
            }`}
          >
            {loadingState ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;