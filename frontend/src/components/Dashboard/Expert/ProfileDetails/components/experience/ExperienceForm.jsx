import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import CustomDatePicker from '../CustomDatePicker';
import { FaEye, FaTrash, FaLightbulb } from 'react-icons/fa';
import DocumentUploadModal from '../services/DocumentUploadModal';

const normalizeDocuments = (documents) => {
  if (!documents) return [];
  if (Array.isArray(documents)) return documents;
  if (typeof documents === 'string') {
    try {
      const parsed = JSON.parse(documents);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      console.error('Error parsing documents JSON:', error);
      return [];
    }
  }
  return [documents];
};

const getDocumentDisplayName = (doc) => {
  if (!doc) return '';

  // Handle File objects (newly uploaded)
  if (doc instanceof File) return doc.name;

  // Handle server response objects with secure_url (Cloudinary)
  if (typeof doc === 'object' && doc.secure_url) {
    // Extract filename from URL, removing query parameters
    const urlParts = doc.secure_url.split('/');
    const filename = urlParts[urlParts.length - 1];
    const cleanFilename = filename.split('?')[0]; // Remove query params

    // If it's a generic ID, try to get original filename
    if (doc.original_filename) {
      return doc.original_filename;
    }

    // Create a user-friendly name from the clean filename
    if (cleanFilename && cleanFilename.length > 10) {
      return cleanFilename.length > 30 ?
        cleanFilename.substring(0, 30) + '...' :
        cleanFilename;
    }

    return 'Document.pdf';
  }

  // Handle simple URL strings
  if (typeof doc === 'string' && doc.startsWith('http')) {
    const urlParts = doc.split('/');
    const filename = urlParts[urlParts.length - 1];
    return filename.split('?')[0] || 'Document.pdf';
  }

  return String(doc);
};

const isPdfDoc = (doc) => {
  if (!doc) return false;

  // Check File objects
  if (doc instanceof File) {
    return doc.type?.toLowerCase().includes('pdf');
  }

  // Check server response objects
  if (typeof doc === 'object' && doc.secure_url) {
    return doc.secure_url.toLowerCase().includes('.pdf') ||
      doc.format?.toLowerCase() === 'pdf' ||
      doc.resource_type === 'raw'; // Cloudinary uses 'raw' for PDFs
  }

  // Check URL strings
  if (typeof doc === 'string') {
    return doc.toLowerCase().includes('.pdf');
  }

  return false;
};

const openDocument = (doc) => {
  if (!doc) return;

  try {
    // Handle File objects (newly uploaded files)
    if (doc instanceof File) {
      const url = URL.createObjectURL(doc);
      window.open(url, '_blank');
      // Clean up the URL after opening to prevent memory leaks
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }

    // Handle server response objects with secure_url
    if (typeof doc === 'object' && doc.secure_url) {
      window.open(doc.secure_url, '_blank');
      return;
    }

    // Handle direct URL strings
    if (typeof doc === 'string' && doc.startsWith('http')) {
      window.open(doc, '_blank');
      return;
    }

    console.warn('Unable to open document - unsupported format:', doc);
    alert('Unable to open document. Please try again.');
  } catch (error) {
    console.error('Error opening document:', error);
    alert('Unable to open document. Please try again.');
  }
};

export default function ExperienceForm({ onSubmit, onCancel, initialData }) {
  const [formData, setFormData] = useState({
    _id: initialData?._id || '',
    companyName: initialData?.companyName || '',
    jobTitle: initialData?.jobTitle || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate) : null,
    endDate: initialData?.endDate ? new Date(initialData.endDate) : null,
    currentlyWork: initialData?.currentlyWork || false,
    documents: normalizeDocuments(initialData?.documents || initialData?.document)
  });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const initialDocumentsRef = useRef(normalizeDocuments(initialData?.documents || initialData?.document));

  useEffect(() => {
    if (initialData) {
      setFormData({
        _id: initialData._id || '',
        companyName: initialData.companyName || '',
        jobTitle: initialData.jobTitle || '',
        startDate: initialData.startDate ? new Date(initialData.startDate) : null,
        endDate: initialData.endDate ? new Date(initialData.endDate) : null,
        currentlyWork: initialData.currentlyWork || false,
        documents: normalizeDocuments(initialData.documents || initialData.document)
      });
      initialDocumentsRef.current = normalizeDocuments(initialData.documents || initialData.document);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const normalizedDocuments = normalizeDocuments(formData.documents);
    const submissionPayload = {
      _id: formData._id,
      companyName: formData.companyName.trim(),
      currentlyWork: formData.currentlyWork,
      endDate: formData.currentlyWork ? null : formData.endDate,
      jobTitle: formData.jobTitle.trim(),
      startDate: formData.startDate,
      documents: normalizedDocuments,
      removeDocument:
        initialDocumentsRef.current.length > 0 && normalizedDocuments.length === 0,
    };

    onSubmit(submissionPayload);
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
    const incomingFiles = Array.from(e.target?.files || []);
    if (incomingFiles.length === 0) return;

    // Store all uploaded files, not just the first one
    setFormData(prev => ({
      ...prev,
      documents: [...(prev.documents || []), ...incomingFiles],
    }));
    setShowUploadModal(false);
  };

  const removeFile = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: (prev.documents || []).filter((_, i) => i !== index)
    }));
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
            Company Name<span className="text-red-500">*</span>
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
            Job Title<span className="text-red-500">*</span>
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
              Start Date<span className="text-red-500">*</span>
            </label>
            <CustomDatePicker
              selectedDate={formData.startDate}
              onChange={(date) => handleDateChange('startDate', date)}
              type="experience"
            />
          </div>

          <div className="text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date<span className="text-red-500">*</span>
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
                      {isPdfDoc(file) ? (
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm text-gray-600" title={getDocumentDisplayName(file)}>{getDocumentDisplayName(file)}</span>
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

