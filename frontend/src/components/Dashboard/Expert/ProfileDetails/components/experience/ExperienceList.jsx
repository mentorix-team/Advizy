import React from 'react';
import { format, parseISO } from 'date-fns';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const ExperienceList = ({ experiences = [], onEdit, onDelete, onAddClick }) => {
  const formatDate = (dateInput) => {
    if (!dateInput) return '';

    try {
      const date = dateInput instanceof Date ? dateInput : parseISO(dateInput);
      return format(date, 'MMM yyyy');
    } catch (error) {
      console.error('Date parsing error:', error);
      return String(dateInput);
    }
  };

  const normalizeDocuments = (documents) => {
    if (!documents) return [];
    if (Array.isArray(documents)) return documents;
    return [documents];
  };

  const getDisplayName = (file) => {
    if (!file) return '';
    if (file instanceof File) return file.name;
    if (typeof file === 'object' && file.secure_url) {
      const parts = file.secure_url.split('/');
      return parts[parts.length - 1] || 'document';
    }
    return String(file);
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

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
        {/* Title Section */}
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
          <h2 className="text-lg sm:text-xl font-semibold">Experience</h2>
        </div>

        {/* Add Experience Button */}
        <button
          onClick={onAddClick}
          className="w-full sm:w-auto px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center gap-2 justify-center sm:justify-start text-sm sm:text-base"
        >
          <span className="text-lg sm:text-xl">+</span>
          <span>Add Experience</span>
        </button>
      </div>

      {experiences && experiences.length > 0 ? (
        experiences.map((experience, index) => {
          const documents = normalizeDocuments(
            experience.documents ?? experience.document
          );

          return (
            <div key={index} className="flex justify-between items-start mb-4 p-4 border rounded-lg hover:shadow-md transition-all duration-200">
              <div>
                <h3 className="text-black font-medium">{experience.companyName}</h3>
                <p className="text-gray-600">{experience.jobTitle}</p>
                <p className="text-gray-500">
                  {formatDate(experience.startDate)} - {experience.currentlyWork ? 'Present' : formatDate(experience.endDate)}
                </p>

                {/* Documents Section */}
                {documents.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {documents.map((file, fileIndex) => (
                      <div key={fileIndex} className="flex items-center gap-2">
                        <button
                          onClick={() => openDocument(file)}
                          className="flex items-center gap-2 text-primary hover:text-green-600 transition-colors duration-200"
                        >
                          <FaEye className="w-4 h-4" />
                          <span className="text-sm" title={getDisplayName(file)}>{getDisplayName(file)}</span>
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
          );
        })
      ) : (
        <p className="text-gray-500 text-center">Add Your Work Experience</p>
      )}
    </div>
  );
};

export default ExperienceList;