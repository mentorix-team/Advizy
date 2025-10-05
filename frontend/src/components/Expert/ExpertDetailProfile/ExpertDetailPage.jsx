import React, { useEffect, useState, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
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
// import Spinner from "@/components/LoadingSkeleton/Spinner";
import Spinner from "@/components/LoadingSkeleton/Spinner";
import Navbar from "@/components/Home/components/Navbar";
import Footer from "@/components/Home/components/Footer";
import SearchModal from "@/components/Home/components/SearchModal";
import {
  optimisticAdd,
  optimisticRemove,
  toggleFavourite,
  selectFavouriteIds,
  selectIsUpdatingFavourite,
} from "@/Redux/Slices/favouritesSlice";
import toast from "react-hot-toast";

const ExpertDetailPage = () => {
  const navigate = useNavigate();
  // const { id } = useParams(); // Get the ID from URL params
  const { feedbackofexpert } = useSelector((state) => state.meeting);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);

  const { redirect_url } = useParams();

  const location = useLocation();
  const dispatch = useDispatch();

  const handleToggle = () => {
    setIsExpertMode(!isExpertMode);
  };

  // Fetch the expert data on mount
  // useEffect(() => {
  //   if (id) {
  //     dispatch(getExpertById(id));
  //   }
  // }, [id, dispatch]);

  // Heuristic: 24-char hex => ObjectId -> fetch by ID; else treat as redirect slug
  useEffect(() => {
    if (!redirect_url) return;
    const isMongoId = /^[a-fA-F0-9]{24}$/.test(redirect_url);
    if (isMongoId) {
      dispatch(getExpertById(redirect_url));
    } else {
      dispatch(getExpertByRedirectUrl(redirect_url));
    }
  }, [redirect_url, dispatch]);

  useEffect(() => {
    const queryparams = new URLSearchParams(location.search);
    const scrollTo = queryparams.get("scrollTo");

    if (scrollTo === "services-offered") {
      const element = document.getElementById("services-offered");

      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location.search]);

  const { selectedExpert: rawSelectedExpert, loading, error } = useSelector((state) => state.expert);

  // Normalized expert object whether slice stored wrapper {expert: {...}} or expert directly
  const expert = useMemo(() => {
    if (!rawSelectedExpert) return null;
    if (rawSelectedExpert.expert) return rawSelectedExpert.expert; // wrapper
    return rawSelectedExpert; // assume already expert object
  }, [rawSelectedExpert]);

  console.log("Normalized expert", expert);
  useEffect(() => {
    if (expert?._id) {
      dispatch(getfeedbackbyexpertid({ id: expert._id }));
    }
  }, [dispatch, expert?._id]);

  const expertId = expert?._id;

  const favIds = useSelector(selectFavouriteIds);
  const isFav = expertId ? favIds.includes(expertId) : false;
  const isUpdating = useSelector(s => selectIsUpdatingFavourite(s, expertId));

  const handleFavorite = () => {
    if (!expertId || isUpdating) return;
    if (isFav) dispatch(optimisticRemove(expertId));
    else dispatch(optimisticAdd(expertId));

    dispatch(toggleFavourite(expertId)).then(r => {
      if (r.meta.requestStatus === "fulfilled") {
        toast.success(
          r.payload.action === "added" ? "Added to favourites" : "Removed from favourites",
          { position: "top-right" }
        );
      } else {
        // rollback
        if (isFav) dispatch(optimisticAdd(expertId));
        else dispatch(optimisticRemove(expertId));
        toast.error("Failed to update favourite", { position: "top-right" });
      }
    });
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    const msg = typeof error === "string" ? error : error?.message || "Unexpected error";
    return <p className="text-red-500">Error: {msg}</p>;
  }

  if (!expert) {
    return <p className="text-gray-500">No expert found.</p>;
  }

  const parseLanguages = (languages) => {
    if (typeof languages === "string") {
      try {
        return JSON.parse(languages); // Parse if it's a stringified JSON array
      } catch (error) {
        console.error("Error parsing languages:", error);
        return []; // Return an empty array if parsing fails
      }
    } else if (Array.isArray(languages)) {
      return languages; // Use directly if it's already an array
    }
    return []; // Return an empty array for invalid formats
  };

  const handleModalCategorySelect = (category) => {
    if (category.value) {
      navigate(`/explore?category=${category.value}`);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen top-[65px] bg-[#F5F5F5]">
      <Navbar
        onSearch={() => setIsModalOpen(true)}
        isExpertMode={isExpertMode}
        onToggleExpertMode={handleToggle}
      />
      <main className="top-[100px]">
        <ProfileHeader
          coverImage={expert?.coverImage?.secure_url}
          name={`${expert?.firstName || "Unknown"} ${expert?.lastName || ""}`}
          title={expert?.credentials?.professionalTitle?.[0] || "No Title Provided"}
          location={expert?.city || "Unknown"}
          rating={
            expert?.reviews?.length
              ? Math.round(
                expert.reviews.reduce((acc, r) => acc + r.rating, 0) /
                expert.reviews.length
              )
              : 0
          }
          reviewsCount={expert?.reviews?.length || 0}
          image={expert?.profileImage?.secure_url}
          redirect_uri={expert?.redirect_url || redirect_url}
          isAdminApproved={expert?.admin_approved_expert}
          // NEW PROPS:
          isFavourite={isFav}
          onToggleFavourite={handleFavorite}
          favUpdating={isUpdating}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 mb-2">
              <ProfileInfo
                experience={expert?.credentials?.experienceYears || 0}
                languages={parseLanguages(expert?.languages).map(
                  (lang) => lang.label
                )}
                about={expert?.bio || "No details provided"}
              />
              <Expertise skills={expert?.credentials?.skills || []} />
              <ServicesOffered
                id="services-offered"
                services={expert?.credentials?.services || []}
              />
              <div className="block md:hidden">
                <EducationCertifications
                  education={expert?.credentials?.education || []}
                  certifications={
                    expert?.credentials?.certifications_courses || []
                  }
                  workExperiences={expert?.credentials?.work_experiences || []}
                />
              </div>
              <Reviews
                reviews={
                  Array.isArray(feedbackofexpert) ? feedbackofexpert : []
                }
              />
              <FAQ faqs={expert?.credentials?.faqs || []} />
            </div>
            <div className="md:col-span-1 hidden md:block">
              <EducationCertifications
                education={expert?.credentials?.education || []}
                certifications={
                  expert?.credentials?.certifications_courses || []
                }
                workExperiences={expert?.credentials?.work_experiences || []}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategorySelect={handleModalCategorySelect}
      />
    </div>
  );
};

export default ExpertDetailPage;
