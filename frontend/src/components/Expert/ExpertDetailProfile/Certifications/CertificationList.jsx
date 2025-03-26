import React from "react";
import CertificationItem from "./CertificationItem";
import { CertificationIcon } from "@/icons/Icons";

const CertificationList = ({ certifications }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <CertificationIcon className="w-6 h-6" />
        <h2 className="text-xl font-semibold">Certifications</h2>
      </div>
      {certifications.map((cert, index) => {
        const formattedDate = new Date(cert.year).toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        });

        return (
          <CertificationItem key={index} year={formattedDate} name={cert.name} />
        );
      })}
    </div>
  );
};

export default CertificationList;
