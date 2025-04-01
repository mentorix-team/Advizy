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
  
  

  const viewFile = (file) => {
    window.open(URL.createObjectURL(file), '_blank');
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 13.125C12 13.4234 11.8815 13.7095 11.6705 13.9205C11.4595 14.1315 11.1734 14.25 10.875 14.25H6.75C6.45163 14.25 6.16548 14.1315 5.95451 13.9205C5.74353 13.7095 5.625 13.4234 5.625 13.125C5.625 12.8266 5.74353 12.5405 5.95451 12.3295C6.16548 12.1185 6.45163 12 6.75 12H10.875C11.1734 12 11.4595 12.1185 11.6705 12.3295C11.8815 12.5405 12 12.8266 12 13.125Z" fill="black"/>
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
          <div key={index} className="flex justify-between items-start mb-4 p-4 border rounded-lg hover:shadow-md transition-all duration-200">
            <div>
              <h3 className="text-black text-base font-medium">{cert.title}</h3>
              <p className="text-[#475467] text-sm">{cert.issue_organization}</p>
              <p className="text-[#475467] text-sm">Issued: {formatDate(cert.year)}</p>
              
              {/* Certificates Section */}
              {cert.certificates && cert.certificates.length > 0 && (
                <div className="mt-2 space-y-1">
                  {cert.certificates.map((file, fileIndex) => (
                    file?.name ? (
                      <div key={fileIndex} className="flex items-center gap-2">
                        <button
                          onClick={() => viewFile(file)}
                          className="flex items-center gap-2 text-primary hover:text-green-600 transition-colors duration-200"
                        >
                          <FaEye className="w-4 h-4" />
                          <span className="text-sm">{file.name}</span>
                        </button>
                      </div>
                    ) : (
                      <p key={fileIndex} className="text-sm text-gray-500">Invalid file</p>
                    )
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
        <p className="text-gray-500 text-center">No certifications added yet</p>
      )}
    </div>
  );
};

export default CertificationList;