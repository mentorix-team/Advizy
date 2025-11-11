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
import { getPublicAvailability } from "@/Redux/Slices/availability.slice";
// import Spinner from "@/components/LoadingSkeleton/Spinner";
import Spinner from "@/components/LoadingSkeleton/Spinner";
import Navbar from "@/components/Home/components/Navbar";
import Footer from "@/components/Home/components/Footer";
import SearchModal from "@/components/Home/components/SearchModal";
import BlockedDates from "./BlockedDates";
import {
  optimisticAdd,
  optimisticRemove,
  toggleFavourite,
  selectFavouriteIds,
  selectIsUpdatingFavourite,
} from "@/Redux/Slices/favouritesSlice";
import toast from "react-hot-toast";

const MAX_SOCIAL_LINKS = 4;

const parseSocialLinks = (rawLinks) => {
  if (!rawLinks) return [];

  const collected = new Set();

  const processValue = (value) => {
    if (!value) return;
    if (Array.isArray(value)) {
      value.forEach(processValue);
      return;
    }
    if (typeof value !== "string") return;

    const trimmed = value.trim();
    if (!trimmed) return;

    const looksJson =
      (trimmed.startsWith("[") && trimmed.endsWith("]")) ||
      (trimmed.startsWith("{") && trimmed.endsWith("}"));

    if (looksJson) {
      try {
        const parsed = JSON.parse(trimmed);
        processValue(parsed);
        return;
      } catch (error) {
        // treat as literal when parsing fails
      }
    }

    if (trimmed.startsWith("\"") && trimmed.endsWith("\"")) {
      try {
        const parsed = JSON.parse(trimmed);
        processValue(parsed);
        return;
      } catch (error) {
        // fallback to trimmed literal value
      }
    }

    collected.add(trimmed);
  };

  processValue(rawLinks);

  return Array.from(collected).slice(0, MAX_SOCIAL_LINKS);
};

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
  const { publicAvailability } = useSelector((state) => state.availability);


  // Normalized expert object whether slice stored wrapper {expert: {...}} or expert directly
  const expert = useMemo(() => {
    if (!rawSelectedExpert) return null;
    if (rawSelectedExpert.expert) return rawSelectedExpert.expert; // wrapper
    return rawSelectedExpert; // assume already expert object
  }, [rawSelectedExpert]);

  const socialLinks = useMemo(
    () => parseSocialLinks(expert?.socialLinks),
    [expert?.socialLinks]
  );

  // Extract blocked dates from availability data (single availability object)
  const blockedDates = publicAvailability?.availability?.blockedDates || [];

  // Compute next available bookable slot (start time) from publicAvailability
  const nextAvailableSlot = useMemo(() => {
    // Prefer backend-provided next slot from sessions (same as cards)
    const sessionSlot = expert?.sessions?.find(
      (session) => session?.next_available_slot?.time
    )?.next_available_slot;

    if (sessionSlot?.day && sessionSlot?.time) {
      return {
        day: sessionSlot.day,
        time: sessionSlot.time,
      };
    }

    const av = publicAvailability?.availability;
    if (!av || !Array.isArray(av.daySpecific)) return null;

    const blocked = new Set((av.blockedDates || []).filter(Boolean));

    // Helper to parse 12-hour time (e.g., "02:30 PM") to minutes since midnight
    const parse12ToMinutes = (t) => {
      if (!t || typeof t !== "string") return Number.POSITIVE_INFINITY;
      const match = t.trim().match(/^(\d{1,2}):(\d{2})\s*([AP]M)$/i);
      if (!match) return Number.POSITIVE_INFINITY;
      let [_, hh, mm, ap] = match;
      let h = parseInt(hh, 10);
      const m = parseInt(mm, 10);
      if (ap.toUpperCase() === "PM" && h !== 12) h += 12;
      if (ap.toUpperCase() === "AM" && h === 12) h = 0;
      return h * 60 + m;
    };

    // Collect all candidate date+time combinations from daySpecific slots
    const candidates = [];
    const todayStr = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    for (const dayEntry of av.daySpecific) {
      if (!dayEntry?.slots || !Array.isArray(dayEntry.slots)) continue;
      for (const slot of dayEntry.slots) {
        const defaultStart = slot?.startTime;
        if (!Array.isArray(slot?.dates)) continue;
        for (const d of slot.dates) {
          const dateStr = typeof d?.date === "string" ? d.date : null;
          if (!dateStr) continue;
          if (blocked.has(dateStr)) continue;
          if (dateStr < todayStr) continue; // past dates
          // Prefer an inner bookable slot start time if provided, else use the slot start
          let candidateStart = defaultStart;
          if (Array.isArray(d?.slots) && d.slots.length > 0) {
            // Pick the earliest inner slot
            const sortedInner = [...d.slots]
              .map(s => ({
                start: s?.startTime,
                startMinutes: parse12ToMinutes(s?.startTime),
              }))
              .filter(s => Number.isFinite(s.startMinutes))
              .sort((a, b) => a.startMinutes - b.startMinutes);
            if (sortedInner.length > 0) {
              candidateStart = sortedInner[0].start;
            }
          }
          const startMinutes = parse12ToMinutes(candidateStart);
          candidates.push({
            date: dateStr,
            start: candidateStart,
            startMinutes,
          });
        }
      }
    }

    if (candidates.length === 0) return null;

    // Sort by date then by start time
    candidates.sort((a, b) => {
      if (a.date === b.date) return a.startMinutes - b.startMinutes;
      return a.date < b.date ? -1 : 1;
    });

    const first = candidates[0];
    // Format day name using locale (falls back to user's locale)
    let day;
    try {
      day = new Date(first.date).toLocaleDateString(undefined, { weekday: 'long' });
    } catch {
      day = null;
    }

    // Only show the next start time (not a range)
    return { day, time: first.start };
  }, [expert?.sessions, publicAvailability]);

  // Calculate rating from feedback data
  const ratingData = useMemo(() => {
    if (!feedbackofexpert || !Array.isArray(feedbackofexpert) || feedbackofexpert.length === 0) {
      return {
        averageRating: 0,
        reviewsCount: 0
      };
    }

    const validRatings = feedbackofexpert.filter(feedback =>
      feedback.rating && !isNaN(Number(feedback.rating))
    );

    const totalRating = validRatings.reduce((sum, feedback) =>
      sum + Number(feedback.rating), 0
    );

    const averageRating = validRatings.length > 0
      ? totalRating / validRatings.length
      : 0;

    return {
      averageRating: parseFloat(averageRating.toFixed(1)),
      reviewsCount: feedbackofexpert.length
    };
  }, [feedbackofexpert]);

  // console.log("Normalized expert", expert);
  useEffect(() => {
    if (expert?._id) {
      dispatch(getfeedbackbyexpertid({ id: expert._id }));
      dispatch(getPublicAvailability(expert._id));
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

  // console.log("Public availability data:", publicAvailability);
  // console.log("Blocked dates:", blockedDates);

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
          rating={ratingData.averageRating}
          reviewsCount={ratingData.reviewsCount}
          image={expert?.profileImage?.secure_url}
          redirect_uri={expert?.redirect_url || redirect_url}
          isAdminApproved={expert?.admin_approved_expert}
          // NEW PROPS:
          isFavourite={isFav}
          onToggleFavourite={handleFavorite}
          favUpdating={isUpdating}
          socialLinks={socialLinks}
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
                socialLinks={socialLinks}
              />
              {/* <BlockedDates blockedDates={blockedDates} /> */}
              <div className="my-6">
                <Expertise skills={expert?.credentials?.skills || []} />
              </div>
              <div className="my-6">
                <ServicesOffered
                  id="services-offered"
                  services={expert?.credentials?.services || []}
                  nextAvailableSlot={nextAvailableSlot}
                />
              </div>
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