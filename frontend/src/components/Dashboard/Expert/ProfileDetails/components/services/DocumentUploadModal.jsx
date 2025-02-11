import React, { useCallback, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaCloudUploadAlt, FaTrash, FaFileAlt } from 'react-icons/fa';
import Modal from './Modal';

const DOCUMENT_MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const DocumentUploadModal = ({ isOpen, onClose, onUpload, existingFiles = [] }) => {
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const initializedRef = React.useRef(false);

  useEffect(() => {
    if (!isOpen) {
      setFiles([]);
      setError('');
      initializedRef.current = false;
    } else if (existingFiles.length > 0 && !initializedRef.current) {
      setFiles(existingFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      })));
      initializedRef.current = true;
    }
  }, [isOpen, existingFiles]);

  const validateFile = (file) => {
    if (file.size > DOCUMENT_MAX_FILE_SIZE) {
      return 'File size must be less than 50MB';
    }

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return 'Only PDF, DOC, and DOCX files are allowed';
    }

    return null;
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setError('');
    try {
      for (const file of acceptedFiles) {
        const validationError = validateFile(file);
        if (validationError) {
          throw new Error(validationError);
        }
      }
      
      const newFiles = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
    } catch (err) {
      setError(err.toString());
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: DOCUMENT_MAX_FILE_SIZE,
    multiple: true
  });

  const removeFile = (index) => {
    setFiles(prevFiles => {
      const newFiles = [...prevFiles];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleUpload = () => {
    if (files.length > 0) {
      onUpload({ target: { files: files.map(f => f.file) } });
      onClose();
    }
  };

  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file.preview) URL.revokeObjectURL(file.preview);
      });
    };
  }, [files]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Upload Documents"
    >
      <div className="font-figtree">
        {/* Requirements Info */}
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium mb-2">File Requirements:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• File Format: PDF, DOC, DOCX</li>
            <li>• Max File Size: 50MB</li>
            <li>• Multiple files allowed</li>
          </ul>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="mb-6 space-y-3">
            {files.map((file, index) => (
              <div 
                key={index} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <FaFileAlt className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{file.file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="p-2 text-gray-600 hover:text-red-500"
                  title="Remove file"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer
            ${isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <FaCloudUploadAlt className="w-10 h-10 text-primary" />
            <div className="text-center">
              <p className="text-gray-700 font-medium">
                Drag & drop your documents here
              </p>
              <p className="text-gray-500 text-sm">
                or <span className="text-primary">browse files</span>
              </p>
            </div>
            <p className="text-xs text-gray-400">
              Supported formats: PDF, DOC, DOCX (max 50MB)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0}
            className="px-4 py-2 text-white bg-primary rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FaCloudUploadAlt className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DocumentUploadModal;
