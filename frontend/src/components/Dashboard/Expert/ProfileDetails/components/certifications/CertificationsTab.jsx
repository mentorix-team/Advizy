import React, { useState, useEffect } from "react";
import CertificationList from "./CertificationList";
import CertificationForm from "./CertificationForm";
import { toast, Toaster } from "react-hot-toast";
import { CertificateForm, deleteCerti, EditCertificate } from "@/Redux/Slices/expert.Slice";
import { useDispatch } from "react-redux";

const STORAGE_KEY = 'user_certifications';

export default function CertificationsTab({ formData = [], onUpdate }) {
  const [certificateToEdit,setCertificateToEdit] = useState(null)

  console.log('Thiis is formData',formData)
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
  console.log('THis is certificats',certifications)
  const dispatch = useDispatch()
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

  const handleAddCertification = async (formData) => {

    try {
      const certificateData = {
        name: formData.name,
        issuingOrganization: formData.issuingOrganization,
        issueDate: formData.issueDate,
        certificates: formData.certificates
      }

      const response = await dispatch(CertificateForm(certificateData))

      const newCertificate = {
        name: formData.get('name'),
        issuingOrganization: formData.get('issuingOrganization'),
        issueDate: formData.get('issueDate'),
        certificates: formData.get('certificates')
      }
      const updatedCertifications = [...certifications, newCertificate];
      setCertifications(updatedCertifications);
      onUpdate(updatedCertifications);
      setShowForm(false);
      toast.success("Certification added successfully!");

    } catch (error) {
      console.error('Error adding education:', error);
      toast.error('Failed to add education. Please try again.');
    }

    
  };

  const handleEditCertification = (index) => {

    const selectedCerti = certifications[index]

    if (!selectedCerti || !selectedCerti._id) {
      console.error("Selected certification entry is missing ID!", selectedCerti);
      return;
    }
  
    console.log("Editing education at index:", index);
    console.log("Selected education:", selectedEducation);

    setEducationToEdit(selectedEducation); // Ensure state is updated properly
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleUpdateCertification = async (updatedCertification) => {

    console.log("Before updating, educationToEdit:", certificateToEdit);

    if (!certificateToEdit || !certificateToEdit._id) {
      console.error("Certificate entry ID is missing. Setting it manually.");
      
      if (certificateToEdit._id) {
        setCertificateToEdit(updatedCertification);
      } else {
        toast.error("Error updating certificate. Please try again.");
        return;
      }
    }

    const dataToUpdate = {
      ...updatedCertification, // New values first
      _id: certificateToEdit._id, // Preserve the ID
      // Preserve certificate if not updated
      certificate: updatedCertification.certificate || certificateToEdit.certificate
    };

    console.log("Updating certificate with Data:", dataToUpdate);
  
    try {
      const response = await dispatch(EditCertificate(dataToUpdate)).unwrap();
      console.log('Response from server:', response);
  
      const updatedCertification = [...certifications];
      updatedCertification[editingIndex] = response;
  
      setCertifications(updatedCertification);
      onUpdate(updatedCertification);
      setShowForm(false);
      setEditingIndex(null);
      toast.success('Certificate updated successfully!');
    } catch (error) {
      console.error('Error updating certificate:', error);
      toast.error('Failed to update certificate. Please try again.');
    }
  };

  const handleDeleteCertification = async (index) => {
    if (index < 0 || index >= certifications.length) return;
  
    const certificationToDelete = certifications[index];
  
    try {
      // Dispatch deleteCerti action with the certification to be deleted
      const response = await dispatch(deleteCerti(certificationToDelete)).unwrap(); // Unwrap to handle success or failure
      console.log('Certification deleted successfully:', response);
  
      // Remove the certification from local state
      const updatedCertifications = certifications.filter((_, i) => i !== index);
      setCertifications(updatedCertifications);
  
      // Update the parent component
      if (onUpdate) {
        onUpdate(updatedCertifications);
      }
  
      // Show success toast notification
      toast.success('Certification deleted successfully!');
    } catch (error) {
      console.error('Error deleting certification:', error);
      toast.error('Failed to delete certification. Please try again.');
    }
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