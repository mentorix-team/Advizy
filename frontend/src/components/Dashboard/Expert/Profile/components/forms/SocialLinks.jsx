import React from 'react';

const SocialLinks = ({ socialLinks, errors, updateSocialLink, addSocialLink }) => {
  const placeholders = [
    'https://linkedin.com/in/username',
    'https://twitter.com/username',
    'https://github.com/username',
    'https://yourwebsite.com'
  ];

  return (
    <div className="mt-6 bg-green-50 p-6 rounded-lg text-left">
      <h3 className="text-lg font-semibold text-green-800 mb-4">Social Media Links</h3>
      <div className="space-y-4">
        {socialLinks.map((link, index) => (
          <input
            key={index}
            type="url"
            value={link}
            onChange={(e) => updateSocialLink(index, e.target.value)}
            className={`w-full p-2 border rounded-lg focus:ring-primary focus:border-primary ${
              errors.socialLinks ? 'border-red-500' : ''
            }`}
            placeholder={placeholders[index % placeholders.length]}
          />
        ))}
        {errors.socialLinks && (
          <p className="text-red-500 text-sm">{errors.socialLinks}</p>
        )}
        <button
          type="button"
          onClick={addSocialLink}
          className="w-full p-2 border-2 border-dashed border-green-300 rounded-lg text-primary hover:bg-green-50"
        >
          + Add Social Link
        </button>
      </div>
    </div>
  );
};

export default SocialLinks;