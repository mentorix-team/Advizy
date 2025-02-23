import { useEffect, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// import ProfileHeader from './components/ProfileHeader';
import BasicInfo from './components/BasicInfo';
import { basicFormSubmit } from '@/Redux/Slices/expert.Slice';

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { expertData,data,loading, error } = useSelector((state) => state.auth);
  // console.log("This is data",data);
  let user = null;
  if (data) {
    user = typeof data === "string" ? JSON.parse(data) : data;
  }
  console.log("this is user",user);
  // const [activeTab, setActiveTab] = useState('basic');
  // const [profileImage, setProfileImage] = useState('');
  // const [coverImage, setCoverImage] = useState('');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loadingState, setLoadingState] = useState(false);

  let expert = null;

  if (expertData) {
    if (typeof expertData === 'string') {
      try {
        expert = JSON.parse(expertData);
        console.log("This is expertData", expert);
      } catch (error) {
        console.error('Error parsing expertData:', error);
        expert = null; // Handle parsing errors safely
      }
    } else if (typeof expertData === 'object' && Object.keys(expertData).length > 0) {
      expert = expertData; // Already an object and not empty
    }
  }
  
  const [formData, setFormData] = useState({
    basic: {
      firstName: user?.firstName|| '',
      lastName: user?.lastName|| '',
      gender: expert?.gender || '',
      dateOfBirth: expert?.dateOfBirth || '',
      nationality: expert?.nationality || '',
      city: expert?.city || '',
      mobile: user?.number || '',
      countryCode: expert?.countryCode || '',
      email: user?.email || '',
      bio: expert?.bio || '',
      languages: [],
      socialLinks: [''],
      coverImage: expert?.coverImage?.secure_url || coverImage || '',
      profileImage: expert?.profileImage?.secure_url || profileImage || ''
    }
  });

  
  

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

  // const handleImageChange = (event, imageType) => {
  //   const uploadedImage = event.target.files[0];

  //   if (uploadedImage) {
  //     setFormData(prev => ({
  //       ...prev,
  //       basic: {
  //         ...prev.basic,
  //         [imageType]: uploadedImage, // Store the File object for the image
  //       },
  //     }));

  //     const imagePreviewUrl = URL.createObjectURL(uploadedImage);

  //     if (imageType === 'profileImage') {
  //       setProfileImage(imagePreviewUrl);
  //     } else if (imageType === 'coverImage') {
  //       setCoverImage(imagePreviewUrl);
  //     }
  //   }
  // };

  const handleNext = async () => {
    if (validateBasicInfo()) {
      const requiredFields = ['firstName', 'lastName', 'gender', 'dateOfBirth', 'nationality', 'city', 'mobile', 'email'];
      const allTouched = {};
      requiredFields.forEach(field => {
        allTouched[field] = true;
      });
      setTouched(allTouched);

      const basicData = new FormData();
      basicData.append('firstName', formData.basic.firstName);
      basicData.append('lastName', formData.basic.lastName);
      basicData.append('city', formData.basic.city);
      basicData.append('bio', formData.basic.bio);
      basicData.append('gender', formData.basic.gender);
      basicData.append('dateOfBirth', formData.basic.dateOfBirth);
      basicData.append('email', formData.basic.email);
      basicData.append('countryCode', formData.basic.countryCode);
      basicData.append('mobile', formData.basic.mobile);
      basicData.append('nationality', formData.basic.nationality);
      basicData.append('languages', JSON.stringify(formData.basic.languages));
      // basicData.append('socialLinks', JSON.stringify(formData.basic.socialLinks));
      // basicData.append('coverImage', formData.basic.coverImage);
      // basicData.append('profileImage', formData.basic.profileImage);

      setLoadingState(true);

      try {
        const response = await dispatch(basicFormSubmit(basicData)).unwrap(); // Use `unwrap` to get the response directly
        if (response.success) {
          toast.success('Basic information submitted successfully!');
          navigate('/dashboard/expert'); // Navigate to the dashboard on success
        } else {
          toast.error('Failed to submit basic information');
        }
      } catch (error) {
        console.error('Error submitting basic form:', error);
        toast.error('An error occurred while submitting the form');
      } finally {
        setLoadingState(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Join <span className='text-primary font-extrabold'>Advizy</span></h1>
          <p className="text-md sm:text-2xl font-semibold text-gray-600">Empower others with your knowledge while growing your influence and professional reach.</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* <ProfileHeader
            onProfileImageChange={setProfileImage}
            onCoverImageChange={setCoverImage}
            profileImage={profileImage}
            coverImage={coverImage}
          /> */}

          <div className="px-4 sm:px-6 lg:px-8">
            <BasicInfo
              formData={formData.basic}
              onUpdate={(data) => handleUpdateFormData('basic', data)}
              errors={errors}
              touched={touched}
              onBlur={(field) => setTouched({ ...touched, [field]: true })}
            />
          </div>
        </div>

        <div className="flex justify-end text-end mt-6">
          <button
            onClick={handleNext}
            disabled={loadingState}
            className={`px-4 sm:px-6 py-2 text-white rounded-lg transition ${
              loadingState ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-green-600'
            }`}
          >
            {loadingState ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;