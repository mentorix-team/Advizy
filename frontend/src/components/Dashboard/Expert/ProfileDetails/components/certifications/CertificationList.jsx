import React from 'react';
import { format, parseISO } from 'date-fns';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const CertificationList = ({ certifications = [], onEdit, onDelete, onAddClick }) => {
  const formatDate = (dateInput) => {
    if (!dateInput) return ''; // Handle null/undefined

    try {
      // Check if dateInput is already a Date object
      if (dateInput instanceof Date) {
        return format(dateInput, 'MMM yyyy');
      }

      // Try to parse a valid ISO string
      if (typeof dateInput === 'string') {
        const parsedDate = new Date(dateInput);
        if (!isNaN(parsedDate)) {
          return format(parsedDate, 'MMM yyyy');
        }
      }

      throw new Error('Invalid date format');
    } catch (error) {
      console.error('Date parsing error:', error);
      return String(dateInput); // Return raw value as fallback
    }
  };

  const normalizeCertificates = (certificates) => {
    if (!certificates) return [];
    if (Array.isArray(certificates)) return certificates;
    if (typeof certificates === 'string') {
      try {
        const parsed = JSON.parse(certificates);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch (error) {
        console.error('Error parsing certificates JSON:', error);
        return [];
      }
    }
    return [certificates];
  };

  const getDisplayName = (file) => {
    if (!file) return '';

    // Handle File objects (newly uploaded)
    if (file instanceof File) return file.name;

    // Handle server response objects with secure_url (Cloudinary)
    if (typeof file === 'object' && file.secure_url) {
      // Extract filename from URL, removing query parameters
      const urlParts = file.secure_url.split('/');
      const filename = urlParts[urlParts.length - 1];
      const cleanFilename = filename.split('?')[0]; // Remove query params

      // If it's a generic ID, try to get original filename
      if (file.original_filename) {
        return file.original_filename;
      }

      // Create a user-friendly name from the clean filename
      if (cleanFilename && cleanFilename.length > 10) {
        return cleanFilename.length > 30 ?
          cleanFilename.substring(0, 30) + '...' :
          cleanFilename;
      }

      return 'Certificate.pdf';
    }

    // Handle simple URL strings
    if (typeof file === 'string' && file.startsWith('http')) {
      const urlParts = file.split('/');
      const filename = urlParts[urlParts.length - 1];
      return filename.split('?')[0] || 'Certificate.pdf';
    }

    return String(file);
  };

  const openDocument = (file) => {
    if (!file) return;

    try {
      // Handle File objects (newly uploaded files)
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
        // Clean up the URL after opening to prevent memory leaks
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        return;
      }

      // Handle server response objects with secure_url
      if (typeof file === 'object' && file.secure_url) {
        window.open(file.secure_url, '_blank');
        return;
      }

      // Handle direct URL strings
      if (typeof file === 'string' && file.startsWith('http')) {
        window.open(file, '_blank');
        return;
      }

      console.warn('Unable to open document - unsupported format:', file);
      alert('Unable to open document. Please try again.');
    } catch (error) {
      console.error('Error opening document:', error);
      alert('Unable to open document. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="20"
            viewBox="0 0 24 20"
            fill="none"
          >
            <path
              d="M12 0.181641L0 6.7271L4.36364 9.10528V15.6507L12 19.818L19.6364 15.6507V9.10528L21.8182 7.91619V15.4544H24V6.7271L12 0.181641ZM19.44 6.7271L12 10.7853L4.56 6.7271L12 2.66891L19.44 6.7271ZM17.4545 14.3635L12 17.3307L6.54545 14.3635V10.2944L12 13.2726L17.4545 10.2944V14.3635Z"
              fill="#16A348"
            />
          </svg>
          <h2 className="text-xl font-semibold">Certifications</h2>
        </div>
        <button
          onClick={onAddClick}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2"
        >
          <span>+</span> Add Certification
        </button>
      </div>

      {certifications && certifications.length > 0 ? (
        certifications.map((cert, index) => (
          <div key={cert._id || index} className="flex justify-between items-start mb-4 p-4 border rounded-lg hover:shadow-md transition-all duration-200">
            <div>
              <h3 className="text-black text-base font-medium">{cert.title}</h3>
              <p className="text-[#475467] text-sm">{cert.issue_organization}</p>
              <p className="text-[#475467] text-sm">Issued: {formatDate(cert.year)}</p>

              {/* Certificates Section */}
              {cert.certificates && cert.certificates.length > 0 && (
                <div className="mt-2 space-y-1">
                  {normalizeCertificates(cert.certificates).map((file, fileIndex) => (
                    <div key={fileIndex} className="flex items-center gap-2">
                      <button
                        onClick={() => openDocument(file)}
                        className="flex items-center gap-2 text-primary hover:text-green-600 transition-colors duration-200"
                      >
                        <FaEye className="w-4 h-4" />
                        <span className="text-sm">{getDisplayName(file)}</span>
                        {file instanceof File && file.size && (
                          <span className="text-xs text-gray-400">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onEdit(index)}
                className="p-2 text-gray-500 hover:text-primary transform hover:scale-110 transition-all duration-200"
              >
                <FaEdit className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(index)}
                className="p-2 text-gray-500 hover:text-red-500 transform hover:scale-110 transition-all duration-200"
              >
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">Add Your Certification</p>
          <button
            onClick={onAddClick}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            Add Your First Certification
          </button>
        </div>
      )}
    </div>
  );
};

export default CertificationList;