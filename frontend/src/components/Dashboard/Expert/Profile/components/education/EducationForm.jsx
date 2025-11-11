import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ImageUploadModal from '../ImageUploadModal';
import { FaEye, FaTrash } from 'react-icons/fa';
import { SingleEducationForm } from '@/Redux/Slices/expert.Slice';
import { useDispatch } from 'react-redux';
import DocumentUploadModal from '../services/DocumentUploadModal';

export default function EducationForm({ onSubmit, onCancel, initialData }) {
  const dispatch = useDispatch()
  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    passingYear: '',
    certificates: ''
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("degree", formData.degree);
    formDataToSend.append("institution", formData.institution);
    formDataToSend.append("passingYear", formData.passingYear);
    formDataToSend.append("certificates", formData.certificates);

    if (formData.certificates) {
      // console.log("Appending certificate:", formData.certificate);
    } else {
      // console.log("No certificate selected");
    }

    dispatch(SingleEducationForm(formDataToSend)); // Dispatching the action
    onSubmit(formDataToSend);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      // console.log("Selected file:", file);
      setFormData((prev) => ({
        ...prev,
        certificates: file,
      }));
      setShowUploadModal(false);
    }
  };

  const handlePassingYearChange = (e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setFormData({ ...formData, passingYear: value });
      setErrors({ ...errors, passingYear: '' });
    }
  };

  const validatePassingYear = () => {
    const year = parseInt(formData.passingYear);
    const currentYear = new Date().getFullYear();
    
    if (!formData.passingYear) {
      setErrors({ ...errors, passingYear: 'Passing year is required' });
      return false;
    }
    
    if (year < 1900 || year > currentYear + 10) {
      setErrors({ ...errors, passingYear: 'Please enter a valid year between 1900 and ' + (currentYear + 10) });
      return false;
    }
    
    setErrors({ ...errors, passingYear: '' });
    return true;
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      certificates: [...prev.certificates, ...newFiles]
    }));
    setShowUploadModal(false);
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }));
  };

  const viewFile = (file) => {
    window.open(URL.createObjectURL(file), '_blank');
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4 text-left">
        <h3 className="text-lg font-semibold">
          {initialData ? 'Edit Education' : 'Add Education'}
        </h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">×</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Degree/Qualification
          </label>
          <input
            type="text"
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary"
            placeholder="Master of Science in Computer Science"
            required
          />
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Institution Name
          </label>
          <input
            type="text"
            value={formData.institution}
            onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary"
            placeholder="Stanford University"
            required
          />
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Passing Year
          </label>
          <input
            type="text"
            value={formData.passingYear}
            onChange={handlePassingYearChange}
            onBlur={validatePassingYear}
            className={`w-full p-2 border rounded-lg focus:ring-primary focus:border-primary ${
              errors.passingYear ? 'border-red-500' : ''
            }`}
            placeholder="2020"
            required
          />
          {errors.passingYear && (
            <p className="text-red-500 text-sm mt-1">{errors.passingYear}</p>
          )}
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
          Certificates (Optional) - for verification purpose only
          </label>
          
          {/* File List */}
          {formData.certificates.length > 0 && (
            <div className="mb-4 space-y-2">
              {formData.certificates.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      {file.type.includes('pdf') ? (
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{file.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => viewFile(file)}
                      className="p-1.5 text-gray-600 hover:text-primary transition-colors"
                    >
                      <FaEye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="p-1.5 text-gray-600 hover:text-red-500 transition-colors"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowUploadModal(true)}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Upload Files
            </button>
          </div>
          <div className="mt-6 flex items-start gap-3 p-4 bg-blue-50 rounded-lg text-blue-700">
                    <FaLightbulb className="mt-1 flex-shrink-0" />
                    <p className="text-sm">
                    Note: While documents are optional, adding them can help us verify your profile faster! ✅ Your documents are completely safe with us. We DON’T share them anywhere, not even on your profile – they’re only for verification.
                    </p>
                  </div>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            {initialData ? 'Update' : 'Save'}
          </button>
        </div>
      </form>
      <DocumentUploadModal 
        isOpen={showUploadModal}
        onClose={()=>setShowUploadModal(false)}
        onUpload={handleFileUpload}
      />    
      {/* <ImageUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        type="certificate"
        onUpload={handleFileUpload}
      /> */}
    </div>
  );
}