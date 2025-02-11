function ProfileOverview({ data }) {
    return (
      <div className="bg-white p-6 rounded-md shadow-sm">
        {/* Profile Header */}
        <div className="flex items-center mb-6">
          <img
            src=''
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="ml-4">
            <h4 className="text-lg font-semibold text-gray-800">
              {data} {data}
            </h4>
            <p className="text-sm text-gray-600">Startup Advisor & Entrepreneur</p>
            <p className="text-sm text-gray-700 mt-2">
              {data ||
                "I'm a passionate career coach with over 15 years of experience helping professionals navigate their career paths and achieve their goals."}
            </p>
          </div>
        </div>
  
        {/* Basic Information */}
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="block text-sm font-medium text-gray-600">First Name</span>
              <span className="block text-gray-800">{data}</span>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Last Name</span>
              <span className="block text-gray-800">{data}</span>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Gender</span>
              <span className="block text-gray-800">{data}</span>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Date of Birth</span>
              <span className="block text-gray-800">{data}</span>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Nationality</span>
              <span className="block text-gray-800">{data}</span>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">City</span>
              <span className="block text-gray-800">{data}</span>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Mobile Number</span>
              <span className="block text-gray-800">{data}</span>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Email</span>
              <span className="block text-gray-800">{data}</span>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-600">Languages</span>
              <span className="block text-gray-800">
                {data}
              </span>
            </div>
          </div>
        </div>
  
        {/* Expertise, Work Experience, etc. */}
        {/* Add similar sections for Expertise, Work Experience, etc., using Tailwind classes */}
      </div>
    );
  }
  
  export default ProfileOverview;
  