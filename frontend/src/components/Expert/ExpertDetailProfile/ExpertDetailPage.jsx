import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getExpertById, getExpertByRedirectUrl } from "@/Redux/Slices/expert.Slice";
import ProfileHeader from "./ProfileHeader";
import ProfileInfo from "./ProfileInfo";
import Expertise from "./Expertise";
import ServicesOffered from "./ServicesOffered/ServicesOffered";
import Reviews from "./Reviews";
import FAQ from "./FAQ";
import EducationCertifications from "./EducationCertifications";
import { getfeedbackbyexpertid } from "@/Redux/Slices/meetingSlice";
import Spinner from "@/components/LoadingSkeleton/Spinner";

const ExpertDetailPage = () => {
  // const { id } = useParams(); // Get the ID from URL params
  const { feedbackofexpert} = useSelector((state) => state.meeting);

  
  const { redirect_url } = useParams();

  const dispatch = useDispatch();

  // Fetch the expert data on mount
  // useEffect(() => {
  //   if (id) {
  //     dispatch(getExpertById(id));
  //   }
  // }, [id, dispatch]);

 
  useEffect(() => {
    if (redirect_url) {
      dispatch(getExpertByRedirectUrl(redirect_url));
    }
  }, [redirect_url, dispatch]);

  const { selectedExpert, loading, error } = useSelector((state) => state.expert);
  console.log('This is selected expert',selectedExpert)
  useEffect(() => {
    if (selectedExpert?.expert?._id) {
      dispatch(getfeedbackbyexpertid({ id: selectedExpert.expert._id }));
    }
  }, [dispatch, selectedExpert?.expert?._id]); // Add `selectedExpert.expert._id` as a dependency
  

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <p className="text-red-500">Error: {error}</p>;
  }

  if (!selectedExpert) {
    return <p>No expert found.</p>;
  }

  const expert = selectedExpert?.expert; // Shorten the chain for readability

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <ProfileHeader
        coverImage={expert?.coverImage?.secure_url}
        name={`${expert?.firstName || "Unknown"} ${expert?.lastName || ""}`}
        title={expert?.credentials?.domain || "No Title Provided"}
        location={expert?.credentials?.location || "Unknown"}
        rating={expert?.rating || 0}
        reviewsCount={expert?.reviews?.length || 0}
        image={expert?.profileImage?.secure_url}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <ProfileInfo
              experience={expert?.credentials?.work_experiences?.[0]?.years_of_experience || 0}
              languages={expert?.languages || []}
              about={expert?.bio || "No details provided"}
            />
            <Expertise skills={expert?.credentials?.expertise || []} />
            <ServicesOffered services={expert?.credentials?.services || []} />
            <Reviews reviews={Array.isArray(feedbackofexpert) ? feedbackofexpert : []} />
            <FAQ faqs={expert?.credentials?.faqs || []} />
          </div>
          <div className="md:col-span-1">
            <EducationCertifications
              education={expert?.credentials?.education || []}
              certifications={expert?.credentials?.certifications_courses || []}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertDetailPage;
