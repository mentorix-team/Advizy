import React, { useEffect } from "react";

const tabs = [
  { id: "basic", label: "Basic Info", icon: "👤" },
  { id: "expertise", label: "Expertise", icon: "💼" },
  { id: "education", label: "Education", icon: "🎓" },
  { id: "experience", label: "Experience", icon: "⚡" },
  { id: "certifications", label: "Certifications", icon: "📜" },
];

const ProfileTabs = ({ activeTab, setActiveTab, enabledTabs }) => {
  // Load active tab from localStorage when component mounts
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab && enabledTabs.includes(savedTab)) {
      setActiveTab(savedTab);
    }
  }, [setActiveTab, enabledTabs]);

  const handleTabClick = (tabId) => {
    if (enabledTabs.includes(tabId)) {
      setActiveTab(tabId);
      localStorage.setItem("activeTab", tabId); // Update localStorage on tab switch
    }
  };

  return (
    <div className="flex overflow-x-auto hide-scrollbar border-b mt-20">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => handleTabClick(tab.id)}
          disabled={!enabledTabs.includes(tab.id)}
          className={`flex items-center gap-2 px-4 sm:px-6 py-4 whitespace-nowrap ${
            activeTab === tab.id
              ? "border-b-2 border-primary text-primary"
              : !enabledTabs.includes(tab.id)
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          <span className="hidden sm:inline">{tab.icon}</span>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ProfileTabs;
