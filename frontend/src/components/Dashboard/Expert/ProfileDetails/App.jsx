import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import ProfileHeader from './components/ProfileHeader';
import ProfileTabs from './components/ProfileTabs';
import BasicInfo from './components/BasicInfo';
import ExpertiseTab from './components/expertise/ExpertiseTab';
import EducationTab from './components/education/EducationTab';
import PreviewApp from './components/preview/src/App';
import { basicFormSubmit, getExpertById, getmeasexpert, professionalFormSubmit } from '@/Redux/Slices/expert.Slice';
import { useDispatch, useSelector } from 'react-redux';
import CertificationsTab from './components/certifications/CertificationsTab';
import ExperienceTab from './components/experience/ExperienceTab';
import Spinner from '@/LoadingSkeleton/Spinner';

function App() {
  const tabs = ['basic', 'expertise', 'education', 'experience', 'certifications'];
  const dispatch = useDispatch();
  const {expertData,loading,error} = useSelector((state)=>state.expert);
  const {selectedExpert} = useSelector((state)=>state.expert)
  const expertbyexpert = selectedExpert?.expert
  // console.log('this is expert by expert',expertbyexpert);
  const [activeTab, setActiveTab] = useState('basic');
  const [showPreview, setShowPreview] = useState(false);
  const [profileImage, setProfileImage] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [enabledTabs, setEnabledTabs] = useState(['basic','certifications','experience','education','expertise']);
  let expert = null;
  useEffect(() => {
    dispatch(getmeasexpert())
  }, [dispatch]);

if (expertData) {
  if (typeof expertData === 'string') {
    try {
      expert = JSON.parse(expertData);
      console.log("This is expertData",expert);
    } catch (error) {
      console.error('Error parsing expertData:', error);
      expert = null; // Handle parsing errors safely
    }
  } else if (typeof expertData === 'object' && Object.keys(expertData).length > 0) {
    expert = expertData; // Already an object and not empty
  }
}


// console.log('this is languages',expert.languages.flatMap(lang => JSON.parse(lang).map(l => l.label)));
const [formData, setFormData] = useState({
  basic: {
    firstName: expert?.firstName || '',
    lastName: expert?.lastName || '',
    gender: expert?.gender || '',
    dateOfBirth: expert?.dateOfBirth || '',
    nationality: expert?.nationality || '',
    city: expert?.city || '',
    mobile: expert?.mobile || '',
    countryCode: expert?.countryCode || '',
    email: expert?.email || '',
    bio: expert?.bio || '',
    // languages: expert?.languages
    //   ? expert.languages.flatMap(lang => JSON.parse(lang).map(l => l.value))
    //   : [],
    languages: expert?.languages
    ? expert.languages.flatMap(lang => 
        typeof lang === 'string' ? JSON.parse(lang) : lang
      )
    : [],
    socialLinks: expert?.socialLinks?.length && typeof expert.socialLinks[0] === 'string'
    ? JSON.parse(expert.socialLinks[0])
    : expert?.socialLinks || [''],
    coverImage: expert?.coverImage?.secure_url || coverImage || '',
    profileImage: expert?.profileImage?.secure_url || profileImage || ''
  },
  expertise: {
    domain: expert?.credentials?.domain||'',
    niche: expert?.credentials?.niche||'',
    professionalTitle: Array.isArray(expert?.credentials?.professionalTitle) 
    ? expert.credentials.professionalTitle[0] || '' 
    : '',
    experienceYears:expert?.credentials?.experienceYears || 0,
    skills:expert?.credentials?.skills|| []
  },
  education: expert?.credentials?.education || [],
  experience: expert?.credentials?.work_experiences || [],
  certifications: expert?.credentials?.certifications_courses || []
});

  useEffect(()=>{
    if(expert?.coverImage?.secure_url){
      setCoverImage(expert.coverImage.secure_url)
    }
    if(expert?.profileImage?.secure_url){
      setProfileImage(expert.profileImage.secure_url)
    }
  },[expert])

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      basic: {
        ...prevFormData.basic,
        profileImage,
        coverImage
      }
    }));
  }, [profileImage, coverImage]);
  
  useEffect(()=>{
    dispatch(getExpertById(expert?._id))
  },[dispatch])

  const validateBasicInfo = () => {
    const newErrors = {};
    const { basic } = formData;

    if (!basic.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!basic.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!basic.gender) newErrors.gender = 'Gender is required';
    if (!basic.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!basic.nationality) newErrors.nationality = 'Nationality is required';
    if (!basic.city.trim()) newErrors.city = 'City is required';
    if (!basic.mobile) newErrors.mobile = 'Mobile number is required';
    if (!basic.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(basic.email)) {
      newErrors.email = 'Invalid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateFormData = (tab, data) => {
    setFormData(prev => ({
      ...prev,
      [tab]: data
    }));

    if (tab === 'basic') {
      const updatedErrors = { ...errors };
      Object.keys(data).forEach(field => {
        if (data[field] && updatedErrors[field]) {
          delete updatedErrors[field];
        }
      });
      setErrors(updatedErrors);
    }
  };

  // General image handler
  const handleImageChange = (event, imageType) => {
    console.log("this is event",event.target)
    const uploadedImage = event.target.files[0];

    if (uploadedImage) {
      setFormData(prev => ({
        ...prev,
        basic: {
          ...prev.basic,
          [imageType]: uploadedImage, // Store the File object for the image
        },
      }));

      const imagePreviewUrl = URL.createObjectURL(uploadedImage);

      if (imageType === 'profileImage') {
        setProfileImage(imagePreviewUrl);
      } else if (imageType === 'coverImage') {
        setCoverImage(imagePreviewUrl);
      }
    }
  };

 const handleNext = async () => {
  const currentIndex = tabs.indexOf(activeTab);
  
  if (activeTab === 'basic') {
    if (validateBasicInfo()) {
      const requiredFields = ['firstName', 'lastName', 'gender', 'dateOfBirth', 'nationality', 'city', 'mobile', 'email'];
      const allTouched = {};
      requiredFields.forEach(field => {
        allTouched[field] = true;
      });
      setTouched(allTouched);
      // console.log("profile image ",formData.basic.profileImage)
      const basicData = new FormData();
      basicData.append('firstName', formData.basic.firstName);
      basicData.append('lastName', formData.basic.lastName);
      basicData.append('city', formData.basic.city);
      basicData.append('bio', formData.basic.bio);
      basicData.append('gender', formData.basic.gender);
      basicData.append('dateOfBirth', formData.basic.dateOfBirth);
      basicData.append('email', formData.basic.email);
      basicData.append('countryCode',formData.basic.countryCode)
      basicData.append('mobile', formData.basic.mobile);
      basicData.append('nationality', formData.basic.nationality);
      basicData.append('languages', JSON.stringify(formData.basic.languages)); 
      basicData.append('socialLinks', JSON.stringify(formData.basic.socialLinks)); 
      basicData.append('coverImage', formData.basic.coverImage);
      basicData.append('profileImage', formData.basic.profileImage);

      try {
        const response = await dispatch(basicFormSubmit(basicData)).unwrap(); // Use `unwrap` to get the response directly
        if (response.success) {
          setEnabledTabs(prev => [...prev, 'expertise']); // Enable the next tab
          toast.success('Basic information submitted successfully!');
        } else {
          toast.error('Failed to submit basic information');
          return;
        }
      } catch (error) {
        console.error('Error submitting basic form:', error);
        toast.error('An error occurred while submitting the form');
        return;
      }
    }
  }

  if (activeTab === 'expertise') {
    setEnabledTabs(prev => [...prev, 'education']);
    console.log("This is the data to be sent for expertise", formData.expertise);
    dispatch(professionalFormSubmit(formData.expertise));
    toast.success('Changes saved successfully!');
  }

  if (activeTab === 'education') {
    setEnabledTabs(prev => [...prev, 'experience']);
    if (formData.education.length > 0) {
      console.log("Education form submitted"); 
      toast.success('Education form submitted successfully!');
      toast.success('Changes saved successfully!');
    }
  }

  if (activeTab === 'experience') {
    setEnabledTabs(prev => [...prev, 'certifications']);
    if (formData.experience.length > 0) {
      console.log("Experience data is present, proceeding to next step.");
      toast.success('Changes saved successfully!');
      setEnabledTabs(prev => [...prev, 'certifications']);
      toast.success('Changes saved successfully!');
    }
  }

  if (activeTab === 'certifications') {
    toast.success('Changes saved successfully!');
    if(formData.certifications.length > 0) {
      console.log("Certification form submitted"); 
      toast.success('Certification form submitted successfully!');
    }
  }

  if (currentIndex < tabs.length - 1) {
    setActiveTab(tabs[currentIndex + 1]);
  }
};


  const handleSkip = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      const nextTab = tabs[currentIndex + 1];
      setEnabledTabs(prev => [...prev, nextTab]);
      setActiveTab(nextTab);
      toast.success('Skipped to next section');
    }
  };

  const handlePrevious = () => {
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1]);
    }
  };

  const handleSaveAll = () => {
    const updatedFormData = {
      ...formData,
      basic: {
        ...formData.basic,
        profileImage,
        coverImage
      }
    };
    console.log('Saving all data:', updatedFormData);
    toast.success('All changes saved successfully!');
  };

  if(loading){
    return <Spinner/>
  }

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => setShowPreview(false)}
            className="mb-4 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            ← Back to Edit
          </button>
          <PreviewApp 
            formData={formData} 
            profileImage={profileImage} 
            coverImage={coverImage} 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Edit Profile</h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full sm:w-auto">
             <button 
              onClick={() => setShowPreview(true)}
              className="px-4 py-2 border rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50 w-full sm:w-auto"
            >
              <span className="text-gray-600">👁️</span>
              Preview
            </button> 
            <button 
              onClick={handleSaveAll}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 w-full sm:w-auto"
            >
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <ProfileHeader 
            onProfileImageChange={setProfileImage}
            onCoverImageChange={setCoverImage}
            profileImage={profileImage}
            coverImage={coverImage}
          />

          <div className="overflow-x-auto">
            <ProfileTabs 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              enabledTabs={enabledTabs}
            />
          </div>
          
          <div className="px-4 sm:px-6 lg:px-8">
            {activeTab === 'basic' && (
              <BasicInfo 
                formData={formData.basic} 
                onUpdate={(data) => handleUpdateFormData('basic', data)} 
                errors={errors}
                touched={touched}
                onBlur={(field) => setTouched({ ...touched, [field]: true })}
              />
            )}
            {activeTab === 'expertise' && enabledTabs.includes('expertise') && (
              <ExpertiseTab 
                formData={formData.expertise} 
                onUpdate={(data) => handleUpdateFormData('expertise', data)} 
              />
            )}
            {activeTab === 'education' && enabledTabs.includes('education') && (
              <EducationTab 
                formData={formData.education} 
                onUpdate={(data) => handleUpdateFormData('education', data)} 
              />
            )}
            {activeTab === 'experience' && enabledTabs.includes('experience') && (
              <ExperienceTab
                formData={formData.experience} 
                onUpdate={(data) => handleUpdateFormData('experience', data)} 
              />
            )}
            {activeTab === 'certifications' && enabledTabs.includes('certifications') && (
              < CertificationsTab
                formData={formData.certifications} 
                onUpdate={(data) => handleUpdateFormData('certifications', data)} 
              />
            )}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button 
            onClick={handlePrevious}
            disabled={activeTab === 'basic'}
            className={`px-4 sm:px-6 py-2 border rounded-lg ${
              activeTab === 'basic'
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <div className="flex gap-2">
            {(activeTab === 'education' || activeTab === 'experience') && (
              <button 
                onClick={handleSkip}
                className="px-4 sm:px-6 py-2 border rounded-lg hover:bg-gray-50"
              >
                Skip
              </button>
            )}
            <button 
              onClick={handleNext}
              className={`px-4 sm:px-6 py-2 ${
                activeTab === 'certifications'
                  ? 'bg-primary text-white hover:bg-green-600'
                  : 'bg-primary text-white hover:bg-green-600'
              } rounded-lg`}
            >
              {activeTab === 'certifications' ? 'Save' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;