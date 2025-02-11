import { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import PhoneNumberValidation from "../../utils/PhoneNumberValidation/PhoneNumberValidation.util";
import ProgressBar from "./ProgressBar";
import { useDispatch } from "react-redux";
import { basicFormSubmit } from "@/Redux/Slices/expert.Slice";
import {genderOptions, languageOptions} from './../../utils/Options'


const ExpertBasicInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentStep = 1; // Define the current step
  const totalSteps = 7;

  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    gender: null,
    dateOfBirth: null,
    nationality: "",
    city: "",
    mobileNumber: "",
    email: "",
    languages: [],
  });

  const [errors, setErrors] = useState({});
  const [phoneResetTrigger, setPhoneResetTrigger] = useState(0);

  const validateForm = () => {
    const newErrors = {};

    if (!formValues.firstName) newErrors.firstName = "First name is required";
    if (!formValues.lastName) newErrors.lastName = "Last name is required";
    if (!formValues.gender) newErrors.gender = "Gender is required";
    if (!formValues.dateOfBirth)
      newErrors.dateOfBirth = "Date of birth is required";
    if (!formValues.nationality)
      newErrors.nationality = "Nationality is required";
    if (!formValues.city) newErrors.city = "City is required";
    if (!formValues.mobileNumber)
      newErrors.mobileNumber = "Mobile number is required";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formValues.email))
      newErrors.email = "Invalid email address";

    if (formValues.languages.length === 0)
      newErrors.languages = "Select at least one language";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submit button clicked"); // Debug log to check execution.

    if (validateForm()) {
        console.log("Validation passed"); // Debug log for validation success.

        const cleanedFormValues = {
            ...formValues,
            gender: formValues.gender?.value,
            languages: formValues.languages.map((lang) => lang.value),
        };

        console.log("Dispatching cleaned values:", cleanedFormValues); // Check dispatch values.

        const response = await dispatch(basicFormSubmit(cleanedFormValues));
        console.log("Response from dispatch:", response); // Log Redux response.

        if (response.payload?.success) {
            console.log("Navigation triggered"); // Confirm navigation step.
            navigate("/expert-registration/professional-skills");
        } else {
            console.error("Submission failed:", response.payload); // Handle dispatch failure.
        }
    } else {
        console.error("Validation failed", errors); // Log validation errors.
    }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSelectChange = (name, value) => {
    setFormValues({ ...formValues, [name]: value });
  };

  const handlePhoneNumberChange = (value, isValid) => {
    setFormValues({ ...formValues, mobileNumber: isValid ? value : "" });
    if (!isValid) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobileNumber: "Invalid phone number",
      }));
    } else {
      setErrors((prevErrors) => {
        const { mobileNumber, ...rest } = prevErrors;
        return rest;
      });
    }
  };
  const handleClear = () => {
    setFormValues({
        firstName: "",
        lastName: "",
        gender: null,
        dateOfBirth: null,
        nationality: "",
        city: "",
        mobileNumber: "",
        email: "",
        languages: [],
    });
    setErrors({});
    setPhoneResetTrigger((prev) => prev + 1);
};




  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Expert Registration
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Step 1 of 7 - Tell us about yourself
        </p>
        <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
        <p className="" align="left">
          Step {currentStep} of {totalSteps}
        </p>
        <br></br>
        <p className="step-description" align="left">
          Let's start with the basics. This information helps clients get to
          know you better.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formValues.firstName}
                onChange={handleChange}
                className={`block w-full border rounded-md px-3 py-2 ${
                  errors.firstName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formValues.lastName}
                onChange={handleChange}
                className={`block w-full border rounded-md px-3 py-2 ${
                  errors.lastName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <Select
                name="gender"
                options={genderOptions}
                value={formValues.gender}
                onChange={(value) => handleSelectChange("gender", value)}
                className={`block w-full rounded-md ${
                  errors.gender ? "border-red-500" : ""
                }`}
              />
              {errors.gender && (
                <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <DatePicker
                selected={formValues.dateOfBirth}
                onChange={(date) => handleSelectChange("dateOfBirth", date)}
                dateFormat="dd/MM/yyyy"
                className={`block w-full border rounded-md px-3 py-2 ${
                  errors.dateOfBirth ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.dateOfBirth}
                </p>
              )}
            </div>
          </div>

          {/* Row 3 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nationality
              </label>
              <input
                type="text"
                name="nationality"
                value={formValues.nationality}
                onChange={handleChange}
                className={`block w-full border rounded-md px-3 py-2 ${
                  errors.nationality ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.nationality && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.nationality}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formValues.city}
                onChange={handleChange}
                className={`block w-full border rounded-md px-3 py-2 ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>
          </div>

          {/* Row 4 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <PhoneNumberValidation
                onValidNumber={handlePhoneNumberChange}
                value={formValues.mobileNumber}
                resetTrigger={phoneResetTrigger}
              />
              {errors.number && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.mobileNumber}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formValues.email}
                onChange={handleChange}
                className={`block w-full border rounded-md px-3 py-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Row 5 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Languages Known
            </label>
            <Select
              name="languages"
              options={languageOptions}
              isMulti
              hideSelectedOptions={false}
              value={formValues.languages}
              onChange={(value) => handleSelectChange("languages", value)}
              className={`block w-full rounded-md ${
                errors.languages ? "border-red-500" : ""
              }`}
            />
            {errors.languages && (
              <p className="text-red-500 text-sm mt-1">{errors.languages}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
            >
              Clear
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpertBasicInfo;
