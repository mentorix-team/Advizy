import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CustomDatePicker from '../CustomDatePicker';
import ImageUploadModal from '../ImageUploadModal';
import { FaEye, FaTrash } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { ExperienceFormSubmit } from '@/Redux/Slices/expert.Slice';
import DocumentUploadModal from '../services/DocumentUploadModal';

export default function ExperienceForm({ onSubmit, onCancel, initialData }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    _id: initialData?._id || '',
    companyName: initialData?.companyName || '',
    jobTitle: initialData?.jobTitle || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate) : null,
    endDate: initialData?.endDate ? new Date(initialData.endDate) : null,
    currentlyWork: initialData?.currentlyWork || false,
    documents: initialData?.documents || []
  });
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
      setFormData((prev) => ({
        ...prev,
        document: file,
      }));
    }
  };

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        // Ensure we create new Date objects from the initial data
        startDate: initialData.startDate ? new Date(initialData.startDate) : null,
        endDate: initialData.endDate ? new Date(initialData.endDate) : null
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formDataToSend = {
      _id: formData._id,
      companyName: formData.companyName,
      currentlyWork: formData.currentlyWork,
      endDate: formData.endDate,
      jobTitle: formData.jobTitle,
      startDate: formData.startDate,
      documents: formData.documents
    };
  
    console.log('submitting FormData', formDataToSend);
    onSubmit(formDataToSend);
  };  

  const handleDateChange = (field, date) => {
    // Ensure we're working with valid Date objects
    const validDate = date ? new Date(date) : null;
    setFormData(prev => ({
      ...prev,
      [field]: validDate
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }));
    setShowUploadModal(false);
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
  };

  const viewFile = (file) => {
    window.open(URL.createObjectURL(file), '_blank');
  };

  const handleCurrentlyWorkChange = (e) => {
    const isChecked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      currentlyWork: isChecked,
      endDate: isChecked ? null : prev.endDate // Clear end date when checked
    }));
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4 text-left">
        <h3 className="text-lg font-semibold">
          {initialData ? 'Edit Experience' : 'Add Experience'}
        </h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">×</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary"
            placeholder="Tech Innovators Inc."
            required
          />
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Job Title
          </label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary"
            placeholder="Senior Software Engineer"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <CustomDatePicker
              selectedDate={formData.startDate}
              onChange={(date) => handleDateChange('startDate', date)}
              type="experience"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <CustomDatePicker
              selectedDate={formData.endDate}
              onChange={(date) => handleDateChange('endDate', date)}
              type="experience"
              disabled={formData.currentlyWork}
              className={formData.currentlyWork ? 'opacity-50 cursor-not-allowed' : ''}
            />
          </div>
        </div>

        <div className="flex items-center text-left">
          <input
            type="checkbox"
            id="currentlyWork"
            checked={formData.currentlyWork}
            onChange={handleCurrentlyWorkChange}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="currentlyWork" className="ml-2 block text-sm text-gray-700">
            I currently work here
          </label>
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Supporting Documents (Optional)
          </label>
          
          {formData.documents?.length > 0 && (
            <div className="mb-4 space-y-2">
              {formData.documents.map((file, index) => (
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
              className="flex items-center gap-2 bg-[#34A853] text-white px-4 py-2 rounded-md hover:bg-[#2d924a] transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Upload Files
            </button>
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
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600"
          >
            {initialData ? 'Update' : 'Save'}
          </button>
        </div>
      </form>

      <DocumentUploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleFileUpload}
      /> 
    </div>
  );
}

ExperienceForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialData: PropTypes.object
};

