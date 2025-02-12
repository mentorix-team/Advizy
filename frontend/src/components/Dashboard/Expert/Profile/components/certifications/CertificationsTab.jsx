import React, { useState, useEffect } from 'react';
import CertificationList from './CertificationList';
import CertificationForm from './CertificationForm';
import { toast } from 'react-hot-toast';

export default function CertificationsTab({ formData, onUpdate }) {
  const [certifications, setCertifications] = useState(formData);
  const [showForm, setShowForm] = useState(formData.length === 0);
  const [editingIndex, setEditingIndex] = useState(null);

  // Update local state when props change
  useEffect(() => {
    setCertifications(formData);
    setShowForm(formData.length === 0);
  }, [formData]);


  const handleAddCertification = (newCertification) => {
    const updatedCertifications = [...certifications, newCertification];
    setCertifications(updatedCertifications);
    onUpdate(updatedCertifications);
    setShowForm(false);
    toast.success('Certification added successfully!');
  };

  const handleEditCertification = (index) => {
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleUpdateCertification = (updatedCertification) => {
    const updatedCertifications = [...certifications];
    updatedCertifications[editingIndex] = updatedCertification;
    setCertifications(updatedCertifications);
    onUpdate(updatedCertifications);
    setShowForm(false);
    setEditingIndex(null);
    toast.success('Certification updated successfully!');
  };

  const handleDeleteCertification = (index) => {
    const updatedCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCertifications);
    onUpdate(updatedCertifications);
    toast.success('Certification deleted successfully!');
  };

  return (
    <div className="py-6">
      <div className="bg-green-50 p-4 rounded-lg mb-6 text-left">
        <h3 className="text-xl font-semibold text-green-800 mb-2">Showcase Your Certifications</h3>
        <p className="text-green-700">
          Your certifications demonstrate your expertise and commitment to professional development.
        </p>
      </div>

      {showForm ? (
        <CertificationForm
          onSubmit={editingIndex !== null ? handleUpdateCertification : handleAddCertification}
          onCancel={() => {
            setShowForm(false);
            setEditingIndex(null);
          }}
          initialData={editingIndex !== null ? certifications[editingIndex] : null}
        />
      ) : (
        <CertificationList 
          certifications={certifications} 
          onAddClick={() => setShowForm(true)}
          onEdit={handleEditCertification}
          onDelete={handleDeleteCertification}
        />
      )}
    </div>
  );
}