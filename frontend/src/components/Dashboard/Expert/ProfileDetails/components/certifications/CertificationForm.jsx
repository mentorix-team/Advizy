import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CustomDatePicker from '../CustomDatePicker';
import { FaEye, FaTrash, FaLightbulb } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { CertificateForm } from '@/Redux/Slices/expert.Slice';
import DocumentUploadModal from '../services/DocumentUploadModal';

export default function CertificationForm({ onSubmit, onCancel, initialData }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    _id: initialData?._id || '',
    title: initialData?.title || '',
    issue_organization: initialData?.issue_organization || '',
    year: initialData?.year ? new Date(initialData.year) : null,
    certificates: initialData?.certificates || []
  });
  const [showUploadModal, setShowUploadModal] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        year: initialData.year ? new Date(initialData.year) : null,
        certificates: initialData.certificates || []
      });
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = {
      _id: formData._id,
      title: formData.title,
      issue_organization: formData.issue_organization,
      year: formData.year instanceof Date ? formData.year.toISOString().split("T")[0] : null,
      certificates: formData.certificates
    };

    onSubmit(formDataToSend);
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData(prev => ({
      ...prev,
      certificates: [...prev.certificates, ...files]
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

  const handleDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      year: date // Store the full Date object
    }));
  };

  return (
    <div className="bg-white rounded-lg p-6 mb-6">
      <div className="flex justify-between items-center mb-4 text-left">
        <h3 className="text-lg font-semibold">
          {initialData ? 'Edit Certification' : 'Add Certification'}
        </h3>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">×</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Certification Name
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary"
            placeholder="AWS Certified Solutions Architect"
            required
          />
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issuing Organization
          </label>
          <input
            type="text"
            value={formData.issue_organization}
            onChange={(e) => setFormData({ ...formData, issue_organization: e.target.value })}
            className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary"
            placeholder="Amazon Web Services (AWS)"
            required
          />
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issue Date
          </label>
          <CustomDatePicker
            selectedDate={formData.year}
            onChange={handleDateChange}
            type="certification"
          />
        </div>

        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-1">
          Certificate (Optional) – Upload for faster verification and added credibility
          </label>
          
          {formData.certificates?.length > 0 && (
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
              className="flex items-center gap-2 bg-[#34A853] text-white px-4 py-2 rounded-md hover:bg-[#2d924a] transition-colors"
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
                                        Note: Uploading your certificate is optional, but it helps us verify your profile faster. Your documents are 100% safe and NOT shared or displayed on your profile or anywhere.
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

CertificationForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  initialData: PropTypes.object
};