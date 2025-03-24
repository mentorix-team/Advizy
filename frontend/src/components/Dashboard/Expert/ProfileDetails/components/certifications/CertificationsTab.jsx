import React, { useState, useEffect } from "react";
import CertificationList from "./CertificationList";
import CertificationForm from "./CertificationForm";
import { toast, Toaster } from "react-hot-toast";

const STORAGE_KEY = 'user_certifications';

export default function CertificationsTab({ formData = [], onUpdate }) {
  const [certifications, setCertifications] = useState(() => {
    // Initialize from localStorage or props
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      try {
        return JSON.parse(storedData);
      } catch (e) {
        console.error('Error parsing stored certifications:', e);
      }
    }
    return formData;
  });
  
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Sync with localStorage whenever certifications change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(certifications));
    } catch (e) {
      console.error('Error storing certifications:', e);
    }
  }, [certifications]);

  // Update local state when props change and no local storage exists
  useEffect(() => {
    if (Array.isArray(formData) && !localStorage.getItem(STORAGE_KEY)) {
      setCertifications(formData);
      setShowForm(formData.length === 0);
    }
  }, [formData]);

  const handleAddCertification = (newCertification) => {
    if (!newCertification) return;

    const updatedCertifications = [...certifications, newCertification];
    setCertifications(updatedCertifications);
    if (onUpdate) {
      onUpdate(updatedCertifications);
    }
    setShowForm(false);
    toast.success("Certification added successfully!");
  };

  const handleEditCertification = (index) => {
    if (index >= 0 && index < certifications.length) {
      setEditingIndex(index);
      setShowForm(true);
    }
  };

  const handleUpdateCertification = (updatedCertification) => {
    if (!updatedCertification || editingIndex === null) return;

    const updatedCertifications = [...certifications];
    updatedCertifications[editingIndex] = updatedCertification;
    setCertifications(updatedCertifications);
    if (onUpdate) {
      onUpdate(updatedCertifications);
    }
    setShowForm(false);
    setEditingIndex(null);
    toast.success("Certification updated successfully!");
  };

  const handleDeleteCertification = (index) => {
    if (index < 0 || index >= certifications.length) return;

    const updatedCertifications = certifications.filter((_, i) => i !== index);
    setCertifications(updatedCertifications);
    if (onUpdate) {
      onUpdate(updatedCertifications);
    }
    toast.success("Certification deleted successfully!");
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingIndex(null);
  };

  return (
    <div className="py-6">
      <Toaster position="top-right" />
      <div className="bg-green-50 p-4 rounded-lg mb-6 text-left">
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Showcase Your Certifications
        </h3>
        <p className="text-green-700">
          Your certifications demonstrate your expertise and commitment to
          professional development.
        </p>
      </div>

      {showForm ? (
        <CertificationForm
          onSubmit={
            editingIndex !== null
              ? handleUpdateCertification
              : handleAddCertification
          }
          onCancel={handleCancel}
          initialData={
            editingIndex !== null ? certifications[editingIndex] : null
          }
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