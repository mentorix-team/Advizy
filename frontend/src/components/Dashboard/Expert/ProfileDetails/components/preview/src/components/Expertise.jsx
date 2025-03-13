import React from 'react';

const ExpertiseTag = ({ text }) => (
  <span className="inline-block px-4 py-2 bg-gray-100 text-black rounded-full text-sm mr-2 mb-2">
    {text}
  </span>
);

const Expertise = ({ skills = [] }) => {
  return (
    <div className="bg-white rounded-lg p-6 mt-6">
      <div className="flex items-center mb-5">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
  <path d="M20.25 4.5H16.875V3.75C16.875 3.05381 16.5984 2.38613 16.1062 1.89384C15.6139 1.40156 14.9462 1.125 14.25 1.125H9.75C9.05381 1.125 8.38613 1.40156 7.89384 1.89384C7.40156 2.38613 7.125 3.05381 7.125 3.75V4.5H3.75C3.25272 4.5 2.77581 4.69754 2.42417 5.04917C2.07254 5.40081 1.875 5.87772 1.875 6.375V18.375C1.875 18.8723 2.07254 19.3492 2.42417 19.7008C2.77581 20.0525 3.25272 20.25 3.75 20.25H20.25C20.7473 20.25 21.2242 20.0525 21.5758 19.7008C21.9275 19.3492 22.125 18.8723 22.125 18.375V6.375C22.125 5.87772 21.9275 5.40081 21.5758 5.04917C21.2242 4.69754 20.7473 4.5 20.25 4.5ZM9.375 3.75C9.375 3.65054 9.41451 3.55516 9.48483 3.48484C9.55516 3.41451 9.65054 3.375 9.75 3.375H14.25C14.3495 3.375 14.4448 3.41451 14.5152 3.48484C14.5855 3.55516 14.625 3.65054 14.625 3.75V4.5H9.375V3.75ZM14.625 6.75V18H9.375V6.75H14.625ZM4.125 6.75H7.125V18H4.125V6.75ZM19.875 18H16.875V6.75H19.875V18Z" fill="#16A348"/>
</svg>
        <h2 className="text-black font-Figtree text-2xl font-semibold leading-9 p-3">
          Expertise
        </h2>
      </div>
      <div className="text-white text-left font-Figtree text-xs font-semibold leading-5">
        {skills.map((skill, index) => (
          <ExpertiseTag key={index} text={skill} />
        ))}
      </div>
    </div>
  );
};

export default Expertise;