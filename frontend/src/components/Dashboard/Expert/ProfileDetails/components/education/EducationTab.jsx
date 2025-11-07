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

const parseCertificatePayload = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return parsed ? [parsed] : [];
    } catch (error) {
      return [];
    }
  }
  return [value];
};

const normalizeCertificate = (certificate) => {
  const parsed = parseCertificatePayload(certificate);
  return parsed.filter(Boolean);
};

const getPrimaryCertificate = (certificate) => {
  const normalized = normalizeCertificate(certificate);
  return normalized.length > 0 ? normalized[0] : null;
};

const sanitizeEducation = (education) => {
  if (!education) return null;

  const certificateSource =
    education.certificate ?? education.certificates ?? education.existingCertificate;

  return {
    ...education,
    certificate: normalizeCertificate(certificateSource),
  };
};

const mapEducations = (incoming) => {
  if (!Array.isArray(incoming)) return [];
  return incoming.map(sanitizeEducation).filter(Boolean);
};

const buildEducationFormData = (education, options = {}) => {
  const formData = new FormData();

  const trimmedDegree = education.degree?.trim() ?? "";
  const trimmedInstitution = education.institution?.trim() ?? "";

  formData.append("degree", trimmedDegree);
  formData.append("institution", trimmedInstitution);
  formData.append("passingYear", education.passingYear ?? "");

  if (education._id) {
    formData.append("_id", education._id);
  }

  const primaryCertificate = getPrimaryCertificate(education.certificate);

  if (primaryCertificate instanceof File) {
    formData.append("certificate", primaryCertificate);
  } else if (primaryCertificate) {
    formData.append("existingCertificate", JSON.stringify(primaryCertificate));
  }

  if (options.removeCertificate) {
    formData.append("removeCertificate", "true");
  }

  return formData;
};

export default function EducationTab({ formData = [], onUpdate }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.expert);

  const [educations, setEducations] = useState(mapEducations(formData));
  const [showForm, setShowForm] = useState(formData.length === 0);
  const [educationToEdit, setEducationToEdit] = useState(null);

  useEffect(() => {
    const normalizedEducations = mapEducations(formData);
    setEducations(normalizedEducations);
    setShowForm(normalizedEducations.length === 0);
  }, [formData]);

  const syncEducationsFromResponse = (payload) => {
    const updatedEducations = mapEducations(
      payload?.expert?.credentials?.education
    );

    setEducations(updatedEducations);
    setShowForm(updatedEducations.length === 0);

    if (typeof onUpdate === "function") {
      onUpdate(updatedEducations);
    }
  };

  const handleAddEducation = async (draftEducation) => {
    try {
      const response = await dispatch(
        SingleEducationForm(buildEducationFormData(draftEducation))
      ).unwrap();

      syncEducationsFromResponse(response);
      setEducationToEdit(null);
      setShowForm(false);
      toast.success("Education added successfully!");
    } catch (error) {
      console.error("Error adding education:", error);
      toast.error(
        error?.message || "Failed to add education. Please try again."
      );
    }
  };

  const handleEditEducation = (index) => {
    const selectedEducation = educations[index];

    if (!selectedEducation || !selectedEducation._id) {
      toast.error("Unable to edit this education entry.");
      return;
    }

    setEducationToEdit(selectedEducation);
    setShowForm(true);
  };

  const handleUpdateEducation = async (updatedEducation) => {
    if (!educationToEdit || !educationToEdit._id) {
      toast.error("Unable to update education. Please try again.");
      return;
    }

    try {
      const response = await dispatch(
        EditEducationForm(
          buildEducationFormData(
            {
              ...updatedEducation,
              _id: educationToEdit._id,
              certificate: updatedEducation.certificate,
            },
            { removeCertificate: Boolean(updatedEducation.removeCertificate) }
          )
        )
      ).unwrap();

      syncEducationsFromResponse(response);
      setEducationToEdit(null);
      setShowForm(false);
      toast.success("Education updated successfully!");
    } catch (error) {
      console.error("Error updating education:", error);
      toast.error(
        error?.message || "Failed to update education. Please try again."
      );
    }
  };

  const handleDeleteEducation = async (index) => {
    const educationToDelete = educations[index];

    if (!educationToDelete || !educationToDelete._id) {
      toast.error("Unable to delete education. Please try again.");
      return;
    }

    try {
      const response = await dispatch(
        deleteEducation({ _id: educationToDelete._id })
      ).unwrap();

      syncEducationsFromResponse(response);
      toast.success("Education deleted successfully!");
    } catch (error) {
      console.error("Error deleting education:", error);
      toast.error(
        error?.message || "Failed to delete education. Please try again."
      );
    }
  };

  if (loading) {
    return <Spinner />;
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
          key={educationToEdit?._id || "create-education"}
          onSubmit={educationToEdit ? handleUpdateEducation : handleAddEducation}
          onCancel={() => {
            setEducationToEdit(null);
            setShowForm(false);
          }}
          initialData={educationToEdit}
        />
      ) : (
        <EducationList
          education={educations}
          onAddClick={() => {
            setEducationToEdit(null);
            setShowForm(true);
          }}
          onEdit={handleEditEducation}
          onDelete={handleDeleteEducation}
        />
      )}
    </div>
  );
}
