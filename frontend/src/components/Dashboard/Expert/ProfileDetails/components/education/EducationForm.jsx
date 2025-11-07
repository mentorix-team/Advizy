import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaEye, FaTrash, FaLightbulb } from 'react-icons/fa';
import DocumentUploadModal from '../services/DocumentUploadModal';
import toast from 'react-hot-toast';
const normalizeCertificate = (certificate) => {
  if (!certificate) return [];
  if (Array.isArray(certificate)) return certificate;

  if (typeof certificate === 'string') {
    try {
      const parsed = JSON.parse(certificate);
      if (Array.isArray(parsed)) return parsed;
      return parsed ? [parsed] : [];
    } catch (error) {
      return [];
    }
  }

  return [certificate];
};

const getFileDisplayName = (file) => {
  if (!file) return '';
  if (file instanceof File) return file.name;
  if (typeof file === 'object' && file.secure_url) {
    const parts = file.secure_url.split('/');
    return parts[parts.length - 1] || 'certificate';
  }
  return String(file);
};

const isPdfDocument = (file) => {
  if (!file) return false;
  if (file instanceof File) return file.type?.toLowerCase().includes('pdf');
  if (typeof file === 'object' && file.secure_url) {
    return file.secure_url.toLowerCase().includes('.pdf');
  }
  return false;
};

const openDocument = (file) => {
  if (!file) return;
  if (file instanceof File) {
    const url = URL.createObjectURL(file);
    window.open(url, '_blank');
    return;
  }

  if (typeof file === 'object' && file.secure_url) {
    window.open(file.secure_url, '_blank');
  }
};

export default function EducationForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    _id: initialData?._id || '',
    degree: initialData?.degree || '',
    institution: initialData?.institution || '',
    passingYear: initialData?.passingYear || '',
    certificate: normalizeCertificate(initialData?.certificate)
  });

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [errors, setErrors] = useState({});
  const initialCertificateRef = useRef(normalizeCertificate(initialData?.certificate));

  useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData._id || '',
        degree: initialData.degree || '',
        institution: initialData.institution || '',
        passingYear: initialData.passingYear || '',
        certificate: normalizeCertificate(initialData.certificate)
      });
      initialCertificateRef.current = normalizeCertificate(initialData.certificate);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const normalizedCertificate = normalizeCertificate(formData.certificate);

    const formDataToSend = {
      _id: formData._id,
      degree: formData.degree.trim(),
      institution: formData.institution.trim(),
      passingYear: formData.passingYear,
      certificate: normalizedCertificate,
      removeCertificate:
        initialCertificateRef.current.length > 0 && normalizedCertificate.length === 0,
    };

    onSubmit(formDataToSend);
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
    const file = e.target.files?.[0];

    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a PDF, JPEG, or PNG file', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      // Validate file size (e.g., 5MB max)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 5MB', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      setFormData(prev => ({
        ...prev,
        certificate: file ? [file] : []
      }));
      setShowUploadModal(false);
      toast.success('File uploaded successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      certificate: (prev.certificate || []).filter((_, i) => i !== index)
    }));
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
            Degree/Qualification<span className="text-red-500">*</span>
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
            Institution Name<span className="text-red-500">*</span>
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
            Passing Year<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.passingYear}
            onChange={handlePassingYearChange}
            onBlur={validatePassingYear}
            className={`w-full p-2 border rounded-lg focus:ring-primary focus:border-primary ${errors.passingYear ? 'border-red-500' : ''
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
          {formData.certificate?.length > 0 && (
            <div className="mb-4 space-y-2">
              {formData.certificate.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      {isPdfDocument(file) ? (
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-600" title={getFileDisplayName(file)}>{getFileDisplayName(file)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openDocument(file)}
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
        onClose={() => setShowUploadModal(false)}
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