import React from "react";
import EducationItem from "./EducationItem";
import { GraduationCap } from "lucide-react";

const EducationList = ({ education }) => {
  // If no education is passed, show a fallback message
  if (!education || education.length === 0) {
    return (
      <div className="w-[284px] h-[200px] border rounded-lg flex flex-col items-center justify-center p-4 bg-background">
        <div className="mb-3"><GraduationCap className="w-10 h-10 text-muted-foreground" /></div>
        <div className="text-center text-sm text-muted-foreground">No education available</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
      <div className="flex items-center gap-2 mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="20"
          viewBox="0 0 24 20"
          fill="none"
        >
          <path
            d="M12 0.181824L0 6.72728L4.36364 9.10546V15.6509L12 19.8182L19.6364 15.6509V9.10546L21.8182 7.91637V15.4546H24V6.72728L12 0.181824ZM19.44 6.72728L12 10.7855L4.56 6.72728L12 2.6691L19.44 6.72728ZM17.4545 14.3636L12 17.3309L6.54545 14.3636V10.2946L12 13.2727L17.4545 10.2946V14.3636Z"
            fill="#16A348"
          />
        </svg>
        <h3 className="text-xl font-semibold text-gray-800">Education</h3>
      </div>
      <ul>
        {education.map((edu, index) => (
          <EducationItem
            key={index}
            degree={edu.degree}
            institution={edu.institution}
            year={edu.year}
          />
        ))}
      </ul>
    </div>
  );
};

export default EducationList;
