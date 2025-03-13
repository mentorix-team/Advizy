import React from 'react';

const LanguageSection = ({ languages, selectedLanguage, setLanguages, setSelectedLanguage }) => {
  const removeLanguage = (langToRemove) => {
    setLanguages(languages.filter(lang => lang !== langToRemove));
  };

  const addLanguage = (e) => {
    const lang = e.target.value;
    if (lang && !languages.includes(lang)) {
      setLanguages([...languages, lang]);
      setSelectedLanguage('');
    }
  };

  return (
    <div className="mt-6 text-left">
      <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {languages.map((lang) => (
          <span
            key={lang}
            className="inline-flex items-center px-3 py-1 rounded-full bg-green-50 text-green-700"
          >
            {lang}
            <button
              onClick={() => removeLanguage(lang)}
              className="ml-2 text-green-500 hover:text-green-700"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <select 
        value={selectedLanguage}
        onChange={addLanguage}
        className="w-full p-2 border rounded-lg focus:ring-primary focus:border-primary"
      >
        <option value="">Add a language</option>
        <option value="Arabic">Arabic</option>
        <option value="Bengali">Bengali</option>
        <option value="Chinese">Chinese</option>
        <option value="English">English</option>
        <option value="French">French</option>
        <option value="German">German</option>
        <option value="Hindi">Hindi</option>
        <option value="Japanese">Japanese</option>
        <option value="Marathi">Marathi</option>
        <option value="Portuguese">Portuguese</option>
        <option value="Russian">Russian</option>
        <option value="Spanish">Spanish</option>
      </select>
    </div>
  );
};

export default LanguageSection;