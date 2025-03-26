import React from "react";
import CertificationItem from "./CertificationItem";
import { FileBadge2 } from "lucide-react";

const CertificationList = ({ certifications = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileBadge2 className="w-6 h-6" />
        <h2 className="text-xl font-semibold">Certifications</h2>
      </div>

      {certifications.length > 0 ? (
        <div className="flex flex-col gap-4">
          {certifications.map((cert, index) => {
            const formattedDate = new Date(cert.year).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            });

            return (
              <CertificationItem
                key={index}
                year={formattedDate}
                name={cert.title || "Untitled Certification"}
                organization={cert.issue_organization || "Unknown Organization"}
              />
            );
          })}
        </div>
      ) : (
        <p className="text-gray-500">No certifications available.</p>
      )}
    </div>
  );
};

export default CertificationList;
