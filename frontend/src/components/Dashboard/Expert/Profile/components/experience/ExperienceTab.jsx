import React, { useState, useEffect } from 'react';
import ExperienceList from './ExperienceList';
import ExperienceForm from './ExperienceForm';
import { toast, Toaster } from 'react-hot-toast';

export default function ExperienceTab({ formData, onUpdate }) {
  const [experiences, setExperiences] = useState(formData);
  const [showForm, setShowForm] = useState(formData.length === 0);
  const [editingIndex, setEditingIndex] = useState(null);

  // Update local state when props change
  useEffect(() => {
    setExperiences(formData);
    setShowForm(formData.length === 0);
  }, [formData]);

  const handleAddExperience = (newExperience) => {
    const updatedExperiences = [...experiences, newExperience];
    setExperiences(updatedExperiences);
    onUpdate(updatedExperiences);
    setShowForm(false);
    toast.success('Experience added successfully!');
  };

  const handleEditExperience = (index) => {
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleUpdateExperience = (updatedExperience) => {
    const updatedExperiences = [...experiences];
    updatedExperiences[editingIndex] = updatedExperience;
    setExperiences(updatedExperiences);
    onUpdate(updatedExperiences);
    setShowForm(false);
    setEditingIndex(null);
    toast.success('Experience updated successfully!');
  };

  const handleDeleteExperience = (index) => {
    const updatedExperiences = experiences.filter((_, i) => i !== index);
    setExperiences(updatedExperiences);
    onUpdate(updatedExperiences);
    toast.success('Experience deleted successfully!');
  };

  return (
    <div className="py-6">
      <Toaster position="top-right" />
      <div className="bg-green-50 p-4 rounded-lg mb-6 text-left">
        <h3 className="text-xl font-semibold text-green-800 mb-2">Showcase Your Professional Journey</h3>
        <p className="text-green-700">
          Your work experience demonstrates your expertise and can help you stand out to potential clients.
        </p>
      </div>

      {showForm ? (
        <ExperienceForm
          onSubmit={editingIndex !== null ? handleUpdateExperience : handleAddExperience}
          onCancel={() => {
            setShowForm(false);
            setEditingIndex(null);
          }}
          initialData={editingIndex !== null ? experiences[editingIndex] : null}
        />
      ) : (
        <ExperienceList 
          experiences={experiences} 
          onAddClick={() => setShowForm(true)}
          onEdit={handleEditExperience}
          onDelete={handleDeleteExperience}
        />
      )}
    </div>
  );
}