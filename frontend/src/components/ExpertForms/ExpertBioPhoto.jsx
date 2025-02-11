import React, { useState } from 'react';
import ProgressBar from './ProgressBar';
import { Form, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { PortfolioForm } from '@/Redux/Slices/expert.Slice';

function ExpertBioPhoto({ onNext, onPrevious }) {

  const navigate  = useNavigate()
  const dispatch = useDispatch()

  const [photo, setPhoto] = useState("");
  const [bio, setBio] = useState('');
  const [errors, setErrors] = useState({});

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setPhoto(file);
      setErrors((prevErrors) => ({ ...prevErrors, photo: '' }));
    }
    const fileReader = new FileReader()
    fileReader.readAsDataURL(file)
    fileReader.addEventListener("load",function(){
      console.log(this.result)
    }) 
  };

  const handleBioChange = (event) => {
    setBio(event.target.value);
    if (event.target.value.length >= 50) {
      setErrors((prevErrors) => ({ ...prevErrors, bio: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!photo) {
      newErrors.photo = 'Profile photo is required';
    }
    if (!bio) {
      newErrors.bio = 'Bio description is required';
    } else if (bio.length < 50) {
      newErrors.bio = 'Bio must be at least 50 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    if (validateForm()) {
      
      const formData = new FormData()
      formData.append("bio",bio)  
      formData.append("photo",photo)
      
      const response = await dispatch(PortfolioForm(formData))
      if(response?.payload?.success){
        navigate('/expert-registration/preview')

        setBio('')
        setPhoto("")
      }
    }
  };

  const handleClear = () => {
    setPhoto("");
    setBio('');
    setErrors({});
    document.getElementById('photoInput').value = ''; // Reset file input
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-3xl">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
          Expert Registration
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Step 6 of 7 - Upload your profile photo and bio
        </p>
        <ProgressBar currentStep={6} totalSteps={6} />
        <p className="text-base text-gray-800 font-medium mt-4">
          Add a professional photo and bio to make a great first impression.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Profile Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Profile Photo (Required)
            </label>
            <input
              id="photoInput"
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-black focus:border-black"
            />
            {errors.photo && (
              <p className="text-red-500 text-sm mt-1">{errors.photo}</p>
            )}
          </div>

          {/* Bio Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio Description
            </label>
            <textarea
              name="bio"
              placeholder="Write a short description about yourself"
              value={bio}
              onChange={handleBioChange}
              className={`block w-full h-24 text-sm border px-3 py-2 rounded-md focus:outline-none focus:ring-black focus:border-black ${
                errors.bio ? 'border-red-500' : 'border-gray-300'
              }`}
            ></textarea>
            {errors.bio && (
              <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-6">
            <div>
              <button
                type="button"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={onPrevious}
              >
                Previous
              </button>
              <button
                type="button"
                className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                onClick={handleClear}
              >
                Clear Section
              </button>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              SUBMIT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpertBioPhoto;
