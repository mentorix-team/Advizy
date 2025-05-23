import React, { useState, useEffect } from "react";
import EducationList from "./EducationList";
import EducationForm from "./EducationForm";
import { toast } from "react-hot-toast";
import {
  deleteEducation,
  EditEducationForm,
  SingleEducationForm,
} from "@/Redux/Slices/expert.Slice";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "@/components/LoadingSkeleton/Spinner";

export default function EducationTab({ formData, onUpdate }) {
  console.log("This is formdata", formData);
  // const [educations, setEducations] = useState(formData);
  const { loading } = useSelector((state) => state.expert);
  const [educations, setEducations] = useState(() => {
    const savedEducation = localStorage.getItem("educations");
    return savedEducation ? JSON.parse(savedEducation) : formData;
  });

  console.log("Educations being passed to EducationList:", educations);
  const [showForm, setShowForm] = useState(formData.length === 0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [educationToEdit, setEducationToEdit] = useState(null);
  // const {loading,}
  const dispatch = useDispatch();
  // Update local state when props change
  useEffect(() => {
    console.log("Updated formData:", formData);
    if (formData && Array.isArray(formData)) {
      setEducations([...formData]); // Force state update with a new array reference
    }
  }, [formData]);

  const handleAddEducation = async (formData) => {
    try {
      const educationData = {
        degree: formData.degree,
        institution: formData.institution,
        passingYear: formData.passingYear,
        certificate: formData.certificate,
      };

      // Dispatch the action to add education
      const response = await dispatch(
        SingleEducationForm(educationData)
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
      // If successful, update local state
      const newEducation = {
        degree: formData.degree,
        institution: formData.institution,
        passingYear: formData.passingYear,
        certificate: formData.certificate || null,
      };

      const updatedEducations = [...educations, newEducation];
      setEducations(updatedEducations);
      onUpdate(updatedEducations);
      setShowForm(false);

      toast.success("Education added successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error adding education:", error);
      toast.error("Failed to add education. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  // let educationToEdit = null; // Store the full education entry

  const handleEditEducation = (index) => {
    const selectedEducation = educations[index];

    if (!selectedEducation || !selectedEducation._id) {
      console.error(
        "Selected education entry is missing ID!",
        selectedEducation
      );
      return;
    }

    console.log("Editing education at index:", index);
    console.log("Selected education:", selectedEducation);

    setEducationToEdit(selectedEducation); // Ensure state is updated properly
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleUpdateEducation = async (updatedEducation) => {
    console.log("Before updating, educationToEdit:", educationToEdit);

    if (!educationToEdit || !educationToEdit._id) {
      console.error("Education entry ID is missing. Setting it manually.");

      if (updatedEducation._id) {
        setEducationToEdit(updatedEducation);
      } else {
        toast.error("Error updating education. Please try again.", {
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

    // Create the data to update - new values should overwrite old ones
    const dataToUpdate = {
      ...updatedEducation, // New values first
      _id: educationToEdit._id, // Preserve the ID
      // Preserve certificate if not updated
      certificate: updatedEducation.certificate || educationToEdit.certificate,
    };

    console.log("Updating Education with Data:", dataToUpdate);

    try {
      const response = await dispatch(EditEducationForm(dataToUpdate)).unwrap();
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

      const updatedEducations = [...educations];
      updatedEducations[editingIndex] = response;

      setEducations(updatedEducations);
      onUpdate(updatedEducations);
      setShowForm(false);
      setEditingIndex(null);
      toast.success("Education updated successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error("Error updating education:", error);
      toast.error("Failed to update education. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleDeleteEducation = async (index) => {
    const educationToDelete = educations[index];

    // Dispatch deleteEducation action
    try {
      const response = await dispatch(
        deleteEducation(educationToDelete)
      ).unwrap(); // Unwrap to handle success or failure
      console.log("Education deleted successfully:", response);

      // Remove the education from local state
      const updatedEducations = educations.filter((_, i) => i !== index);
      setEducations(updatedEducations);
      onUpdate(updatedEducations);

      toast.success("Education deleted successfully!");
    } catch (error) {
      console.error("Error deleting education:", error);
      toast.error("Failed to delete education. Please try again.");
    }
  };

  if (loading) {
    <Spinner />;
  }

  return (
    <div className="py-6">
      <div className="bg-green-50 p-4 rounded-lg mb-6 text-left">
        <h3 className="text-xl font-semibold text-green-800 mb-2">
        Boost Your Credibility with Your Education
        </h3>
        <p className="text-green-700">
        Adding your education helps build trust and can set you apart. We recommend adding it for verification and better visibility.
        </p>
      </div>

      {showForm ? (
        <EducationForm
          onSubmit={
            editingIndex !== null ? handleUpdateEducation : handleAddEducation
          }
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
