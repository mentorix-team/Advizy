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

const parseDocumentPayload = (value) => {
  if (!value) return null;
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }
  return value;
};

const normalizeDocuments = (documents) => {
  const parsed = parseDocumentPayload(documents);
  if (!parsed) return [];
  return Array.isArray(parsed) ? parsed : [parsed];
};

const getPrimaryDocument = (documents) => {
  const normalized = normalizeDocuments(documents);
  return normalized.length > 0 ? normalized[0] : null;
};

const sanitizeExperience = (experience) => {
  if (!experience) return null;
  const documents =
    experience.documents ?? experience.document ?? experience.existingDocument;

  return {
    ...experience,
    documents: parseDocumentPayload(documents),
    currentlyWork:
      experience.currentlyWork === true ||
      experience.currentlyWork === "true",
  };
};

const mapExperiences = (incoming) => {
  if (!Array.isArray(incoming)) return [];
  return incoming.map(sanitizeExperience).filter(Boolean);
};

const formatDateValue = (value) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return date.toISOString();
};

const buildExperienceFormData = (experience, options = {}) => {
  const formData = new FormData();

  const trimmedCompany = experience.companyName?.trim() ?? "";
  const trimmedJobTitle = experience.jobTitle?.trim() ?? "";
  const currentlyWorking =
    experience.currentlyWork === true || experience.currentlyWork === "true";

  formData.append("companyName", trimmedCompany);
  formData.append("jobTitle", trimmedJobTitle);
  formData.append("startDate", formatDateValue(experience.startDate));
  formData.append("currentlyWork", currentlyWorking ? "true" : "false");

  if (experience._id) {
    formData.append("_id", experience._id);
  }

  if (currentlyWorking) {
    formData.append("endDate", "");
  } else {
    formData.append("endDate", formatDateValue(experience.endDate));
  }

  // Handle all documents
  const documents = normalizeDocuments(experience.documents);
  const existingDocuments = [];
  
  if (documents.length > 0) {
    documents.forEach((doc) => {
      if (doc instanceof File) {
        // New file uploads - use field name "documents" to match server route
        formData.append("documents", doc);
      } else if (doc) {
        // Existing documents from server - collect them for batch processing
        existingDocuments.push(doc);
      }
    });
  }

  // Send existing documents as a JSON array if any exist
  if (existingDocuments.length > 0) {
    formData.append("existingDocuments", JSON.stringify(existingDocuments));
  }

  if (options.removeDocument) {
    formData.append("removeDocument", "true");
  }

  return formData;
};

export default function ExperienceTab({ formData = [], onUpdate }) {
  const dispatch = useDispatch();
  const [experiences, setExperiences] = useState(mapExperiences(formData));
  const [showForm, setShowForm] = useState(formData?.length === 0);
  const [experienceToEdit, setExperienceToEdit] = useState(null);

  useEffect(() => {
    const normalizedExperiences = mapExperiences(formData);
    setExperiences(normalizedExperiences);
    setShowForm(normalizedExperiences.length === 0);
  }, [formData]);

  const syncExperiencesFromResponse = (payload) => {
    const updatedExperiences = mapExperiences(
      payload?.expert?.credentials?.work_experiences
    );

    setExperiences(updatedExperiences);
    setShowForm(updatedExperiences.length === 0);

    if (typeof onUpdate === "function") {
      onUpdate(updatedExperiences);
    }
  };

  const handleAddExperience = async (draftExperience) => {
    try {
      const response = await dispatch(
        ExperienceFormSubmit(buildExperienceFormData(draftExperience))
      ).unwrap();

      syncExperiencesFromResponse(response);
      setExperienceToEdit(null);
      toast.success("Experience added successfully!");
    } catch (error) {
      console.error("Error adding experience:", error);
      toast.error(
        error?.message || "Failed to add experience. Please try again."
      );
    }
  };

  const handleEditExperience = (index) => {
    const selectedExperience = experiences[index];

    if (!selectedExperience || !selectedExperience._id) {
      toast.error("Unable to edit this experience entry.");
      return;
    }

    setExperienceToEdit(selectedExperience);
    setShowForm(true);
  };

  const handleUpdateExperience = async (updatedExperience) => {
    if (!experienceToEdit || !experienceToEdit._id) {
      toast.error("Unable to update experience. Please try again.");
      return;
    }

    try {
      const response = await dispatch(
        editExperience(
          buildExperienceFormData(
            {
              ...updatedExperience,
              _id: experienceToEdit._id,
            },
            { removeDocument: Boolean(updatedExperience.removeDocument) }
          )
        )
      ).unwrap();

      syncExperiencesFromResponse(response);
      setExperienceToEdit(null);
      toast.success("Experience updated successfully!");
    } catch (error) {
      console.error("Error updating experience:", error);
      toast.error(
        error?.message || "Failed to update experience. Please try again."
      );
    }
  };

  const handleDeleteExperience = async (index) => {
    const experienceToDelete = experiences[index];
    if (!experienceToDelete || !experienceToDelete._id) {
      toast.error("Unable to delete experience. Please try again.");
      return;
    }

    try {
      const response = await dispatch(
        deleteExpertExperience({ _id: experienceToDelete._id })
      ).unwrap();

      syncExperiencesFromResponse(response);
      toast.success("Experience deleted successfully!");
    } catch (error) {
      console.error("Error deleting experience:", error);
      toast.error(
        error?.message || "Failed to delete experience. Please try again."
      );
    }
  };

  return (
    <div className="py-6">
      <div className="bg-green-50 p-4 rounded-lg mb-6 text-left">
        <h3 className="text-xl font-semibold text-green-800 mb-2">
          Showcase Your Professional Journey
        </h3>
        <p className="text-green-700">
          Your professional journey tells your story. Adding your experience helps people
          understand your expertise and trust your skills.
        </p>
      </div>

      {showForm ? (
        <ExperienceForm
          key={experienceToEdit?._id || "create-experience"}
          onSubmit={
            experienceToEdit ? handleUpdateExperience : handleAddExperience
          }
          onCancel={() => {
            setExperienceToEdit(null);
            setShowForm(false);
          }}
          initialData={experienceToEdit}
        />
      ) : (
        <ExperienceList
          experiences={experiences}
          onAddClick={() => {
            setExperienceToEdit(null);
            setShowForm(true);
          }}
          onEdit={handleEditExperience}
          onDelete={handleDeleteExperience}
        />
      )}
    </div>
  );
}
