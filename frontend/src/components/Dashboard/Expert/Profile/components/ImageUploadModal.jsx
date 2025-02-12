import React from 'react';
import Modal from './Modal';

const ImageUploadModal = ({ isOpen, onClose, type, onUpload }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'cover' ? 'Change Cover Image' : 'Change Profile Picture'}
      subtitle={`Upload a new ${type === 'cover' ? 'cover image' : 'profile picture'} for your profile`}
    >
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Upload Image</label>
        <div className="mtd-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
          <div className="space-y-1 text-center">
            <input
              type="file"
              className="hidden"
              id="file-upload"
              accept="image/*"
              onChange={onUpload}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer bg-white rounded-md font-medium text-primary hover:text-green-600"
            >
              Choose File
            </label>
            <p className="text-xs text-gray-500">No file chosen</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ImageUploadModal;