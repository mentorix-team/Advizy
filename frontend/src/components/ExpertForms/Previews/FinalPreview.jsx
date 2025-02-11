import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const FinalPreview = () => {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const navigate = useNavigate();

  // Fetch expertData directly from the expert slice
  const expertData = useSelector((state) => state.expert.expertData); // Get expertData from expert slice
  const authData = useSelector((state) => state.auth.data); // Fetch user data from auth slice

  // Example of parsing and handling data from Redux if needed
  

  console.log("Expert portfolio photo:",  expertData.credentials.portfolio);
  console.log("Auth Data:", authData);

  // Default structure to handle missing data
  const userData = {
      profileImage: expertData.credentials.portfolio && expertData.credentials.portfolio.length > 0 
      ? expertData.credentials.portfolio[0].photo?.secure_url || "https://via.placeholder.com/100" 
      : "https://via.placeholder.com/100",

      bio: expertData.credentials.portfolio && expertData.credentials.portfolio.length > 0 
        ? expertData.credentials.portfolio[0].bio || "No bio provided" 
        : "No bio provided",
      basicInfo: {
      firstName: expertData.firstName || "N/A",
      lastName: expertData.lastName || "N/A",
      gender: expertData.gender || "N/A",
      dateOfBirth: expertData.dateOfBirth || "N/A",
      nationality: expertData.nationality || "N/A",
      city: expertData.city || "N/A",
      mobileNumber: expertData.mobileNumber || "N/A",
      email: expertData.email || "N/A",
      languages: expertData.languages || [],
    },
    expertiseAndSkills: {
      domain: expertData.credentials.domain || "N/A",
      niche: expertData.credentials.niche || "N/A",
      areasOfExpertise: expertData.credentials.expertise || [],
    },
    workExperience: expertData.credentials.work_experiences || [],
    education: expertData.credentials.education || [],
    certifications: expertData.credentials.certifications_courses || [],
    achievements: expertData.credentials.achievements || "No achievements added",
  };

  const handleSubmit = async () => {
    navigate('/dashboard/expert');
  };

  return (
    <div className="bg-gray-50 mx-auto rounded-lg shadow-lg p-8 max-w-6xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Expert Registration</h1>
      <p className="text-lg text-gray-800 font-medium mb-6">
        Almost there! Review your information before launching your expert profile.
      </p>

      {/* Profile Overview */}
      <div className="flex items-center mb-8 border p-4 rounded-md bg-white shadow-sm">
        <img
          src={userData.profileImage}
          alt="Profile"
          className="rounded-xl w-24 h-24 border-2 border-gray-300"
        />
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-800">
            {userData.basicInfo.firstName} {userData.basicInfo.lastName}
          </h3>
          <p className="text-gray-600 text-sm">Startup Advisor & Entrepreneur</p>
          <p className="text-gray-700 text-sm mt-2">{userData.bio}</p>
        </div>
      </div>

      {/* Other sections (Basic Information, Expertise, etc.) */}
      <div className="space-y-8">
        {/* Basic Information */}
        <div className="border p-4 rounded-md bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
          <div className="grid grid-cols-2 gap-2">
            <p><strong>First Name:</strong> {userData.basicInfo.firstName}</p>
            <p><strong>Last Name:</strong> {userData.basicInfo.lastName}</p>
            <p><strong>Gender:</strong> {userData.basicInfo.gender}</p>
            <p><strong>Date of Birth:</strong> {userData.basicInfo.dateOfBirth}</p>
            <p><strong>Nationality:</strong> {userData.basicInfo.nationality}</p>
            <p><strong>City:</strong> {userData.basicInfo.city}</p>
            <p><strong>Mobile Number:</strong> {userData.basicInfo.mobileNumber}</p>
            <p><strong>Email:</strong> {userData.basicInfo.email}</p>
            <p><strong>Languages:</strong> {userData.basicInfo.languages.join(", ")}</p>
          </div>
        </div>

        {/* Expertise and Skills */}
        <div className="border p-4 rounded-md bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Expertise and Skills</h3>
          <p><strong>Domain:</strong> {userData.expertiseAndSkills.domain}</p>
          <p><strong>Niche:</strong> {userData.expertiseAndSkills.niche}</p>
          <div className="mt-2">
            <p className="font-semibold">Areas of Expertise:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2">
              {userData.expertiseAndSkills.areasOfExpertise.map((area, index) => (
                <div
                  key={index}
                  className="inline-block rounded-full bg-gray-800 px-4 py-2 text-center text-white"
                >
                  {area}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Work Experience */}
        <div className="border p-4 rounded-md bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Work Experience</h3>
          {userData.workExperience.map((experience, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">{experience.title} at {experience.company}</p>
              <p className="text-gray-600 text-sm">{experience.duration}</p>
            </div>
          ))}
        </div>

        {/* Education */}
        <div className="border p-4 rounded-md bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Education</h3>
          {userData.education.map((edu, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">{edu.degree}</p>
              <p className="text-gray-600 text-sm">{edu.institution}, {edu.passingYear}</p>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <div className="border p-4 rounded-md bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Certifications</h3>
          {userData.certifications.map((cert, index) => (
            <div key={index} className="mb-4">
              <p className="font-semibold">{cert.title}</p>
              <p className="text-gray-600 text-sm">{cert.provider}, {cert.year}</p>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div className="border p-4 rounded-md bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Achievements</h3>
          <p>{userData.achievements}</p>
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="mt-8">
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="terms"
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={isTermsAccepted}
            onChange={() => setIsTermsAccepted(!isTermsAccepted)}
          />
          <span className="text-sm text-gray-700">
            I agree to the platform’s terms and commission policy
          </span>
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-6">
        <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
          Previous
        </button>
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-lg text-white ${isTermsAccepted ? "bg-green-500 hover:bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}
            disabled={!isTermsAccepted}
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinalPreview;
