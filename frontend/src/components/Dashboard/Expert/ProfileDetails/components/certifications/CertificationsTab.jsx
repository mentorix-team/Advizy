import React, { useState, useEffect } from "react";
import CertificationList from "./CertificationList";
import CertificationForm from "./CertificationForm";
import { toast, Toaster } from "react-hot-toast";
import { CertificateForm, deleteCerti, EditCertificate } from "@/Redux/Slices/expert.Slice";
import { useDispatch } from "react-redux";

export default function CertificationsTab({ formData = [], onUpdate }) {
  const [certificateToEdit,setCertificateToEdit] = useState(null)
  console.log('this is formdata',formData)
  const [certifications, setCertifications] = useState(() => {
    const storedData = localStorage.getItem('certifications');
  
    if (!storedData) {
      console.log("LocalStorage is empty, using formData:", formData);
      return Array.isArray(formData) ? formData : [formData]; // Ensure formData is an array
    }
  
    try {
      const parsedCertification = JSON.parse(storedData);
      console.log("Parsed data from localStorage:", parsedCertification);
      return Array.isArray(parsedCertification) ? parsedCertification : formData;
    } catch (error) {
      console.error("Error parsing certifications from localStorage:", error);
      return formData; // Fallback to formData if JSON parsing fails
    }
  });
  
  
  
  console.log('THis is certificats',certifications)
  const dispatch = useDispatch()
  const [showForm, setShowForm] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  // Sync with localStorage whenever certifications change
  useEffect(() => {
    try {
      localStorage.setItem('certifications', JSON.stringify(certifications));
    } catch (e) {
      console.error('Error storing certifications:', e);
    }
  }, [certifications]);

  // Update local state when props change and no local storage exists
  useEffect(() => {
    if (Array.isArray(formData)) {
      setCertifications(formData);
      setShowForm(formData.length === 0);
      localStorage.setItem('certifications', JSON.stringify(formData)); // Sync localStorage with latest formData
    }
  }, [formData]); // Runs whenever formData updates
  

  const handleAddCertification = async (formData) => {

    try {
      const certificateData = {
        title: formData.title,
        issue_organization: formData.issue_organization,
        year: formData.year,
        certificates: formData.certificates
      }

      const response = await dispatch(CertificateForm(certificateData))

      toast.success('Education added successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);

      const newCertificate = {
        title: formData.title,
        issue_organization: formData.issue_organization,
        year: formData.year,
        certificates: formData.certificates
      }
      const updatedCertifications = [...certifications, newCertificate];
      setCertifications(updatedCertifications);
      onUpdate(updatedCertifications);
      setShowForm(false);
      toast.success("Certification added successfully!",{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

    } catch (error) {
      console.error('Error adding education:', error);
      toast.error('Failed to add education. Please try again.',{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }

    
  };

  const handleEditCertification = (index) => {

    const selectedCerti = certifications[index]

    if (!selectedCerti || !selectedCerti._id) {
      console.error("Selected certification entry is missing ID!", selectedCerti);
      return;
    }
  
    console.log("Editing education at index:", index);
    console.log("Selected education:", selectedCerti);

    setCertificateToEdit(selectedCerti); // Ensure state is updated properly
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
        toast.error("Error updating certificate. Please try again.",{
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
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
      toast.success('Education added successfully!',{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
        window.location.reload();
      }, 500);
      console.log('Response from server:', response);
  
      const updatedCertification = [...certifications];
      updatedCertification[editingIndex] = response;
  
      setCertifications(updatedCertification);
      onUpdate(updatedCertification);
      setShowForm(false);
      setEditingIndex(null);
      toast.success('Certificate updated successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error updating certificate:', error);
      toast.error('Failed to update certificate. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
      toast.success('Certification deleted successfully!',{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error deleting certification:', error);
      toast.error('Failed to delete certification. Please try again.',{
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
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
        Boost Your Credibility with Certifications
        </h3>
        <p className="text-green-700">
        Certifications showcase your expertise, commitment, and skills, helping you stand out to potential clients.
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