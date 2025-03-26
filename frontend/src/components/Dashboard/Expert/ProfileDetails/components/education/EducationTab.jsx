import React, { useState, useEffect } from 'react';
import EducationList from './EducationList';
import EducationForm from './EducationForm';
import { toast } from 'react-hot-toast';
import { deleteEducation, EditEducationForm } from '@/Redux/Slices/expert.Slice';

export default function EducationTab({ formData, onUpdate }) {
  console.log('This is formdata',formData)
  // const [educations, setEducations] = useState(formData);

  const [educations,setEducations] = useState(()=>{
    const savedEducation = localStorage.getItem('educations');
    return savedEducation ? JSON.parse(savedEducation) : formData
  })
  const [showForm, setShowForm] = useState(formData.length === 0);
  const [editingIndex, setEditingIndex] = useState(null);

  // Update local state when formData.education changes
  useEffect(() => {
    if (formData.education) {
      setEducations(formData.education);
      setShowForm(formData.education.length === 0);
    }
  }, [formData.education]);

  const handleAddEducation = (formData) => {
    const newEducation = {
      degree: formData.get("degree") || "",
      institution: formData.get("institution") || "",
      passingYear: formData.get("passingYear") || "",
      certificate: formData.get("certificate") || null,
    };

    const updatedEducations = [...educations, newEducation];
    
    // Update both local state and parent form data
    setEducations(updatedEducations);
    onUpdate({ 
      ...formData,
      education: updatedEducations 
    });
    setShowForm(false);
    toast.success('Education added successfully!');
  };

  const handleEditEducation = (index) => {
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleUpdateEducation = async (updatedEducation) => {
    const updatedEducations = [...educations];
    updatedEducations[editingIndex] = updatedEducation;

    try {
      // Dispatch the EditEducationForm action
      const response = await dispatch(
        EditEducationForm(updatedEducation)
      ).unwrap(); // Unwrap to handle success or failure
      console.log('Response from server:', response);

      setEducations(updatedEducations);
      onUpdate(updatedEducations);
      setShowForm(false);
      setEditingIndex(null);
      toast.success('Education updated successfully!');
    } catch (error) {
      console.error('Error updating education:', error);
      toast.error('Failed to update education. Please try again.');
    }
  };

  const handleDeleteEducation = async (index) => {
    const educationToDelete = educations[index];
  
    // Dispatch deleteEducation action
    try {
      const response = await dispatch(deleteEducation(educationToDelete)).unwrap(); // Unwrap to handle success or failure
      console.log('Education deleted successfully:', response);
  
      // Remove the education from local state
      const updatedEducations = educations.filter((_, i) => i !== index);
      setEducations(updatedEducations);
      onUpdate(updatedEducations);
  
      toast.success('Education deleted successfully!');
    } catch (error) {
      console.error('Error deleting education:', error);
      toast.error('Failed to delete education. Please try again.');
    }
  };

  return (
    <div className="py-6">
      <div className="bg-green-50 p-4 rounded-lg mb-6 text-left">
        <h3 className="text-xl font-semibold text-green-800 mb-2">Highlight Your Educational Background</h3>
        <p className="text-green-700">
          Your education credentials add credibility to your profile and can attract clients looking for specific qualifications.
        </p>
      </div>

      {showForm ? (
        <EducationForm
          onSubmit={editingIndex !== null ? handleUpdateEducation : handleAddEducation}
          onCancel={() => {
            setShowForm(false);
            setEditingIndex(null);
          }}
          initialData={editingIndex !== null ? educations[editingIndex] : null}
        />
      ) : (
        <EducationList 
          education={educations} 
          onAddClick={() => setShowForm(true)}
          onEdit={handleEditEducation}
          onDelete={handleDeleteEducation}
        />
      )}
    </div>
  );
}