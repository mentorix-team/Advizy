import React, { useState, useEffect } from "react";
import ExperienceList from "./ExperienceList";
import ExperienceForm from "./ExperienceForm";
import { toast } from "react-hot-toast";
import {
  ExperienceFormSubmit,
  deleteExpertExperience,
  editExperience,
} from "@/Redux/Slices/expert.Slice";
import { useDispatch } from "react-redux";

export default function ExperienceTab({ formData, onUpdate }) {
  const dispatch = useDispatch();
  const [experienceToEdit, setExperienceToEdit] = useState(null);

  console.log("This is formData:", formData);

  // Initialize state from localStorage or formData
  const [experiences, setExperiences] = useState(() => {
    const savedExperiences = localStorage.getItem("experiences");
    const parsedExperiences = savedExperiences
      ? JSON.parse(savedExperiences)
      : formData;

    // Ensure experiences is always an array
    return Array.isArray(parsedExperiences) ? parsedExperiences : [];
  });

  console.log("Experiences being passed to ExperienceList:", experiences);

  const [showForm, setShowForm] = useState(experiences.length === 0);
  const [editingIndex, setEditingIndex] = useState(null);

  // Ensure experiences state is always in sync with formData
  useEffect(() => {
    console.log("Updating experiences from formData:", formData);

    if (Array.isArray(formData)) {
      setExperiences(formData);
      setShowForm(formData.length === 0);
    }
  }, [formData]);

  // Update localStorage whenever experiences change
  useEffect(() => {
    localStorage.setItem("experiences", JSON.stringify(experiences));
  }, [experiences]);

  const handleAddExperience = async (formData) => {
    try {
      // Convert the formData to a format your API expects
      const experienceData = {
        companyName: formData.companyName,
        currentlyWork: formData.currentlyWork,
        endDate: formData.endDate,
        jobTitle: formData.jobTitle,
        startDate: formData.startDate,
        documents: formData.documents || null,
      };

      const response = await dispatch(
        ExperienceFormSubmit(experienceData)
      ).unwrap();
      toast.success("Education added successfully!", {
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
      const newExperience = {
        ...response, // Use the response from the API which includes the _id
        companyName: formData.companyName,
        currentlyWork: formData.currentlyWork,
        endDate: formData.endDate,
        jobTitle: formData.jobTitle,
        startDate: formData.startDate,
        documents: formData.documents || null,
      };

      const updatedExperiences = [...experiences, newExperience];
      setExperiences(updatedExperiences);
      onUpdate(updatedExperiences);
      setShowForm(false);
      toast.success("Experience added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error adding experience:", error);
      toast.error("Failed to add Experience. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleEditExperience = (index) => {
    const selectedExperience = experiences[index];

    if (!selectedExperience || !selectedExperience._id) {
      console.error(
        "Selected experience entry is missing ID!",
        selectedExperience
      );
      return;
    }

    console.log("Editing experience at index:", index);
    console.log("Selected experience:", selectedExperience);

    setExperienceToEdit(selectedExperience);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleUpdateExperience = async (updatedExperience) => {
    console.log("Before updating, experienceToEdit:", experienceToEdit);

    if (!experienceToEdit || !experienceToEdit._id) {
      console.error("Experience entry ID is missing. Setting it manually.");

      if (updatedExperience._id) {
        setExperienceToEdit(updatedExperience);
      } else {
        toast.error("Error updating experience. Please try again.", {
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

    // Ensure `_id` is present in the update payload
    const dataToUpdate = {
      ...updatedExperience,
      _id: experienceToEdit._id,

      documents: updatedExperience.documents || experienceToEdit.documents,
    };

    console.log("Updating Experience with Data:", dataToUpdate);

    try {
      const response = await dispatch(editExperience(dataToUpdate)).unwrap();
      toast.success("Education added successfully!", {
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
      console.log("Response from server:", response);

      const updatedExperiences = [...experiences];
      updatedExperiences[editingIndex] = response;

      setExperiences(updatedExperiences);
      onUpdate(updatedExperiences);
      setShowForm(false);
      setEditingIndex(null);
      toast.success("Experience updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error updating experience:", error);
      toast.error("Failed to update experience. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleDeleteExperience = async (index) => {
    if (index < 0 || index >= experiences.length) return;

    const experienceToDelete = experiences[index];
    console.log("THis is the experience", experienceToDelete);
    try {
      const response = await dispatch(
        deleteExpertExperience({ _id: experienceToDelete._id })
      ).unwrap();
      console.log("Experience deleted successfully:", response);

      const updatedExperiences = experiences.filter((_, i) => i !== index);
      setExperiences(updatedExperiences);
      onUpdate(updatedExperiences);
      toast.success("Experience deleted successfully!");
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast.error("Failed to delete experience. Please try again.");
    }
  };

  return (
    <div className="py-6">
      <div className="bg-green-50 p-4 rounded-lg mb-6 text-left">
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Showcase Your Professional Journey
        </h3>
        <p className="text-green-700">
          Your work experience demonstrates your expertise and can help you
          stand out to potential clients.
        </p>
      </div>

      {showForm ? (
        <ExperienceForm
          onSubmit={
            editingIndex !== null ? handleUpdateExperience : handleAddExperience
          }
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
