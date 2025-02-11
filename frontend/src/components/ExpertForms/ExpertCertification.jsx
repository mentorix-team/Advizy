import React, { useState } from "react";
import AchievementPreview from "./Previews/AchievementPreview";
import ProgressBar from "./ProgressBar";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CertificateForm } from "@/Redux/Slices/expert.Slice";

function ExpertCertification({ onNext, onPrevious }) {

  const dispatch  = useDispatch()
  const navigate = useNavigate()
  const [certiData, setcertiData] = useState({
    title: "",
    issue_organization: "",
    year: "",
    certificate: "",
  });

  const [achievements, setAchievements] = useState([]);
  const [errors, setErrors] = useState({});

  // Validate form inputs
  const validate = () => {
    const newErrors = {};

    if (!certiData.title.trim()) {
      newErrors.title = "Achievement title is required.";
    }

    if (!certiData.issue_organization.trim()) {
      newErrors.issue_organization = "Issuing organization is required.";
    }

    if (!certiData.year.trim()) {
      newErrors.year = "Year is required.";
    } else if (!/^(19|20)\d{2}$/.test(certiData.year)) {
      newErrors.year = "Please enter a valid year (e.g., 2020).";
    }

    if (!certiData.certificate) {
      newErrors.certificate = "Certificate is required.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle adding an achievement
  const handleAddAchievement = async () => {
    if (validate()) {
      const formData = new FormData();
      formData.append("title", certiData.title);
      formData.append("issue_organization", certiData.issue_organization);
      formData.append("year", certiData.year);
      formData.append("certificate", certiData.certificate);

      try {
        const response = await dispatch(CertificateForm(formData));
        if (response?.payload?.success) {
          setcertiData({ title: "", issue_organization: "", year: "", certificate: "" });
          setAchievements([...achievements, { ...certiData, certificate: "Uploaded Successfully" }]);
          setErrors({});
        } else {
          setErrors({ general: "Failed to add Certificate. Please try again." });
        }
      } catch (error) {
        console.error("Error adding achievement:", error);
        setErrors({ general: "An unexpected error occurred. Please try again." });
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setcertiData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    e.preventDefault()
    const file = e.target.files[0];
  
    if (file) {
      setcertiData({
        ...certiData,
        certificate:file
      });
    }
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.addEventListener("load",function(){
      console.log(this.result)
    }) 
  };

  const resetForm = () => {
    setcertiData({
      title: "",
      issue_organization: "",
      year: "",
      certificate: "",
    });
    setErrors({});
  };

  // Handle removing an achievement
  const handleRemoveAchievement = (index) => {
    const updatedAchievements = achievements.filter((_, i) => i !== index);
    setAchievements(updatedAchievements);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (achievements.length === 0) {
      setErrors({ general: "Please add at least one education before proceeding." });
      return;
    }
  
    navigate("/expert-registration/profile-photo");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-3xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Expert Registration
        </h1>
        <p className="text-gray-600 mb-4">Celebrate your achievements.</p>

        <ProgressBar currentStep={5} totalSteps={6} />

        <div align="left">Step 5 of 7</div>

        <p className="step-description" align="left">
          Highlight your proudest professional moments. Add credibility to your
          profile.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Achievement Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Certificate Name
            </label>
            <input
              type="text"
              name="title"
              value={certiData.title}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-4 py-2 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter Certificate Name"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Issuing Organization */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Issuing Organization
            </label>
            <input
              name="issue_organization"
              value={certiData.issue_organization}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-4 py-2 ${
                errors.issue_organization ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter issuing organization"
            />
            {errors.issue_organization && (
              <p className="text-red-500 text-sm mt-1">
                {errors.issue_organization}
              </p>
            )}
          </div>

          {/* Year */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Year</label>
            <input
              type="text"
              name="year"
              value={certiData.year}
              onChange={handleInputChange}
              className={`w-full border rounded-lg px-4 py-2 ${
                errors.year ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter year (e.g., 2020)"
            />
            {errors.year && (
              <p className="text-red-500 text-sm mt-1">{errors.year}</p>
            )}
          </div>

          {/* Certificate */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Certificate (Required)
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border rounded-lg px-4 py-2"
            />
            {errors.certificate && (
              <p className="text-red-500 text-sm mt-1">{errors.certificate}</p>
            )}
          </div>

          {/* Add Achievement Button */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleAddAchievement}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              + Add Achievement
            </button>
          </div>
        </form>

        {/* Preview Section */}
        {achievements.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              Achievement Preview
            </h3>
            {achievements.map((achievement, index) => (
              <AchievementPreview
                key={index}
                achievement={achievement}
                onRemove={() => handleRemoveAchievement(index)}
              />
            ))}
          </div>
        )}

        {/* Form Actions */}
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
      </div>
    </div>
  );
}

export default ExpertCertification;
