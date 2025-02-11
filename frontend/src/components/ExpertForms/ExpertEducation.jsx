import React, { useState } from "react";
import EducationPreview from "./Previews/EducationPreview";
import ProgressBar from "./ProgressBar";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { EducationFormSubmit, SingleEducationForm } from "@/Redux/Slices/expert.Slice";

function ExpertEducation({ onPrevious }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [eduData, seteduData] = useState({
    degree: "",
    institution: "",
    passingYear: "",
    certificate: "",
  });

  const [errors, setErrors] = useState({});
  const [educations, setEducations] = useState([]);

  const validate = () => {
    const newErrors = {};

    if (!eduData.degree.trim()) {
      newErrors.degree = "Degree/Qualification is required.";
    }

    if (!eduData.institution.trim()) {
      newErrors.institution = "Institution name is required.";
    }

    if (!eduData.passingYear.trim()) {
      newErrors.passingYear = "Passing year is required.";
    } else if (!/^(19|20)\d{2}$/.test(eduData.passingYear)) {
      newErrors.passingYear = "Please enter a valid year (e.g., 2000).";
    }

    if (!eduData.certificate) {
      newErrors.certificate = "Certificate is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    seteduData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    e.preventDefault()
    const file = e.target.files[0];
  
    if (file) {
      seteduData({
        ...eduData,
        certificate:file
      });
    }
    console.log("This is edudata certi",eduData)
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.addEventListener("load",function(){
      console.log(this.result)
    }) 
  };

  const handleAddEducation = async () => {
    if (!validate()) return;
  
    const { degree, institution, passingYear, certificate } = eduData;
  
    const newEducation = {
      degree,
      institution,
      passingYear,
      certificate,
    };
  
    try {
      // Attempt to create the education in the backend
      const formData = new FormData();
      formData.append("degree", degree);
      formData.append("institution", institution);
      formData.append("passingYear", passingYear);
      formData.append("certificate", certificate);
      console.log("THis is formdata to send",formData.certificate)

      const response = await dispatch(SingleEducationForm(formData));
      if (response?.payload?.success) {
        setEducations((prev) => [...prev, newEducation]); // Add to local state
        seteduData({
          degree: "",
          institution: "",
          passingYear: "",
          certificate: "",
        });
        setErrors({});
      } else {
        setErrors({ general: "Failed to add education. Please try again." });
      }
    } catch (error) {
      console.error("Error adding education:", error);
      setErrors({ general: "An unexpected error occurred. Please try again." });
    }
  };
  
  async function createEducation(e){
    e.preventDefault()
    if(validate()){
      const formData = new FormData()
      formData.append("degree", eduData.degree)
      formData.append("institution", eduData.institution)
      formData.append("passingYear",eduData.passingYear)
      formData.append("certificate",eduData.certificate)
  
      const response = await dispatch(SingleEducationForm(formData))
      if(response?.payload?.success){
        navigate("/expert-registration/certifications");
      }
    }

    seteduData({
      degree: "",
      institution: "",
      passingYear: "",
      certificate: "",
    });
  
    
  }

  const resetForm = () => {
    seteduData({
      degree: "",
      institution: "",
      passingYear: "",
      certificate: null,
    });
    document.querySelector('input[type="file"]').value = null;
    setErrors({});
  };

  const handleRemoveEducation = (index) => {
    const updatedEducations = educations.filter((_, i) => i !== index);
    setEducations(updatedEducations);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate if there is at least one education entry
    if (educations.length === 0) {
      setErrors({ general: "Please add at least one education before proceeding." });
      return;
    }
  
    // If validation passes, navigate to the next step
    navigate("/expert-registration/certifications");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Expert Registration</h1>
        <p className="text-gray-600 mb-4">Share your educational background and certifications.</p>

        <ProgressBar currentStep={4} totalSteps={6} />

        <div align="left">Step 4 of 7</div>

        <p className="font-medium text-base my-3" align="left">
          Your education and certifications add credibility to your profile.
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Degree/Qualification
            </label>
            <input
              type="text"
              name="degree"
              value={eduData.degree}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-4 py-2 ${
                errors.degree ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter degree/qualification"
            />
            {errors.degree && <p className="text-red-500 text-sm mt-1">{errors.degree}</p>}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Institution Name
            </label>
            <input
              type="text"
              name="institution"
              value={eduData.institution}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-4 py-2 ${
                errors.institution ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter institution name"
            />
            {errors.institution && (
              <p className="text-red-500 text-sm mt-1">{errors.institution}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Passing Year</label>
            <input
              type="text"
              name="passingYear"
              value={eduData.passingYear}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-4 py-2 ${
                errors.passingYear ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter passing year (e.g., 2020)"
            />
            {errors.passingYear && (
              <p className="text-red-500 text-sm mt-1">{errors.passingYear}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Certificate (PDF)</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border rounded-lg px-4 py-2"
            />
            {errors.certificate && (
              <p className="text-red-500 text-sm mt-1">{errors.certificate}</p>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddEducation}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              + Add Education
            </button>
          </div>
        </form>

        <div className="mt-6">
          <h3 className="text-lg font-bold text-gray-700 mb-2">Education Preview</h3>
          {educations.map((education, index) => (
            <EducationPreview
              key={index}
              education={education}
              onRemove={() => handleRemoveEducation(index)}
            />
          ))}
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={onPrevious}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Previous
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Clear Section
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Next
          </button>
        </div>

        {errors.general && <p className="text-red-500 text-center mt-4">{errors.general}</p>}
      </div>
    </div>
  );
}

export default ExpertEducation;
