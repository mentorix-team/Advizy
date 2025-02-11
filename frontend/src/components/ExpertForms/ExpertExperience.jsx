import React, { useState } from "react";
import DatePicker from "react-datepicker";
import ExperiencePreview from "./previews/ExperiencePreview";
import "react-datepicker/dist/react-datepicker.css";
import ProgressBar from "./ProgressBar";
import { useDispatch } from "react-redux";
import { ExperienceFormSubmit } from "@/Redux/Slices/expert.Slice";
import { useNavigate } from "react-router-dom";

function ExpertExperience({ onNext, onPrevious }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [experiences, setExperiencess] = useState([]);
  const [expData, setexpData] = useState({
    companyName: "",
    jobTitle: "",
    startDate: null,
    endDate: null,
    document: null,
    experiences: [],
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const { companyName, jobTitle, startDate, endDate } = expData;

    if (!companyName || companyName.trim() === "")
      newErrors.companyName = "Company name is required";
    if (!jobTitle || jobTitle.trim() === "")
      newErrors.jobTitle = "Job title is required";
    if (!startDate) newErrors.startDate = "Start date is required";
    if (endDate && startDate && new Date(endDate) < new Date(startDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    const totalMonths = years * 12 + months;
    return `${Math.floor(totalMonths / 12)} years, ${totalMonths % 12} months`;
  };

  const handleAddExperience = async (event) =>{
    event.preventDefault()

    if(validateForm()){
      const formData = new FormData()
      formData.append("companyName",expData.companyName)
      formData.append("jobTitle",expData.jobTitle)
      formData.append("startDate",expData.startDate)
      formData.append("endDate",expData.endDate)
      formData.append("document",expData.document)
      
          try {
            const response = await dispatch(ExperienceFormSubmit(formData))
            if(response?.payload?.success){
              // navigate('/expert-registration/education')
              setexpData({
                companyName: "",
                jobTitle: "",
                startDate: null,
                endDate: null,
                document: null,
                experiences: [],
              })
              setExperiencess([...experiences, { ...expData, document: "Uploaded Successfully" }]);
            }
          } catch (error) {
            console.error("Error adding Experience:", error);
            setErrors({ general: "An unexpected error occurred. Please try again." });
          }
    }
    
  }

  const handleRemoveExperience = (index) => {
    setexpData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveDocument = () => {
    setexpData((prev) => ({ ...prev, document: null }));
  };



  const handleFileUpload = (event) => {
    event.preventDefault();
    const uploadedFile = event.target.files[0];
    
    if(uploadedFile){
      setexpData({
        ...expData,
        document:uploadedFile
      });
      const fileReader = new FileReader()
      fileReader.readAsDataURL(uploadedFile);
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (experiences.length === 0) {
      setErrors({ general: "Please add at least one experience before proceeding." });
      return;
    }
  
    navigate("/expert-registration/education");
  };


  return (
    <div
      className="mx-auto my-8 p-6 border border-gray-300 rounded-lg shadow-lg bg-gray-50"
      style={{ width: "1100px", height: "890px" }}
    >
      <h1 className="text-2xl font-bold text-gray-700 mb-4">
        Expert Registration
      </h1>
      <p className="text-gray-600 mb-6">Highlight your experience</p>
      <ProgressBar currentStep={3} totalSteps={6} />
      <p className="text-gray-500 mt-4 mb-8">
        Step 3 of 7: Highlight your professional skills and areas of expertise.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-gray-700">Company Name</label>
            <input
              type="text"
              name="companyName"
              placeholder="Enter company name"
              value={expData.companyName}
              onChange={(e) =>
                setexpData((prev) => ({
                  ...prev,
                  companyName: e.target.value,
                }))
              }
              className={`w-full p-2 border rounded ${
                errors.companyName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.companyName && (
              <div className="text-red-500 text-sm">{errors.companyName}</div>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700">Job Title</label>
            <input
              type="text"
              name="jobTitle"
              placeholder="Enter job title"
              value={expData.jobTitle}
              onChange={(e) =>
                setexpData((prev) => ({ ...prev, jobTitle: e.target.value }))
              }
              className={`w-full p-2 border rounded ${
                errors.jobTitle ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.jobTitle && (
              <div className="text-red-500 text-sm">{errors.jobTitle}</div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-gray-700">Start Date</label>
            <DatePicker
              selected={expData.startDate}
              onChange={(date) =>
                setexpData((prev) => ({ ...prev, startDate: date }))
              }
              placeholderText="Select start date"
              className={`w-full p-2 border rounded ${
                errors.startDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.startDate && (
              <div className="text-red-500 text-sm">{errors.startDate}</div>
            )}
          </div>
          <div className="space-y-2">
            <label className="block text-gray-700">End Date</label>
            <DatePicker
              selected={expData.endDate}
              onChange={(date) =>
                setexpData((prev) => ({ ...prev, endDate: date }))
              }
              placeholderText="Select end date"
              className={`w-full p-2 border rounded ${
                errors.endDate ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.endDate && (
              <div className="text-red-500 text-sm">{errors.endDate}</div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-gray-700">
            Upload Document (Optional)
          </label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="w-full p-2 border rounded border-gray-300"
          />
          {expData.document && (
            <div className="flex items-center mt-2">
              <span className="text-gray-700 mr-4">
                {expData.document.name}
              </span>
              <button
                type="button"
                onClick={handleRemoveDocument}
                className="text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>

        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={handleAddExperience}
        >
          + Add Experience
        </button>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Preview</h3>
          <div
            className={`gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400`}
            style={{
              maxWidth: "100%",
              display: "flex",
              overflowX: "auto",
              paddingBottom: "10px", // Adding some spacing for better UX
            }}
          >
            {expData.experiences.map((exp, index) => (
              <ExperiencePreview
                key={index}
                experience={exp}
                onRemove={() => handleRemoveExperience(index)}
                className="flex-shrink-0 w-[300px] border border-gray-300 rounded-lg shadow-md bg-white p-4"
              />
            ))}
          </div>
        </div>


        <div className="flex justify-between mt-8">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            onClick={onPrevious}
          >
            Previous
          </button>
          <div className="flex space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() =>
                setexpData({
                  companyName: "",
                  jobTitle: "",
                  startDate: null,
                  endDate: null,
                  document: null,
                  experiences: [],
                })
              }
            >
              Clear Section
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              NEXT
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ExpertExperience;
