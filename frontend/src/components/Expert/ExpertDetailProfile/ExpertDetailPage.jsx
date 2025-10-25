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
import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";
// import Spinner from "@/components/LoadingSkeleton/Spinner";
import Spinner from "@/components/LoadingSkeleton/Spinner";
import Navbar from "@/components/Home/components/Navbar";
import Footer from "@/components/Home/components/Footer";
import SearchModal from "@/components/Home/components/SearchModal";
import BlockedDates from "./BlockedDates";
import AvailableSlots from "./AvailableSlots";
import {
  optimisticAdd,
  optimisticRemove,
  toggleFavourite,
  selectFavouriteIds,
  selectIsUpdatingFavourite,
} from "@/Redux/Slices/favouritesSlice";
import toast from "react-hot-toast";

const MAX_SOCIAL_LINKS = 4;

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const extractTimeString = (timeLike) => {
  if (!timeLike) return "";
  if (typeof timeLike === "string") return timeLike;
  if (typeof timeLike === "number") return String(timeLike);
  if (typeof timeLike === "object") {
    const candidate =
      timeLike.value ??
      timeLike.label ??
      timeLike.startTime ??
      timeLike.from ??
      timeLike.start ??
      timeLike.time ??
      "";
    return typeof candidate === "string" ? candidate : String(candidate || "");
  }
  return "";
};

const parseTimeToMinutes = (timeLike) => {
  const raw = extractTimeString(timeLike)
    .replace(/\u200e|\u200f/g, "")
    .trim();

  if (!raw) return null;

  const periodMatch = raw.match(/(AM|PM)/i);
  const period = periodMatch ? periodMatch[1].toUpperCase() : null;
  const numericPart = period ? raw.replace(/(AM|PM)/i, "").trim() : raw;

  const [hourPart, minutePart = "0"] = numericPart.split(":");
  let hours = parseInt(hourPart, 10);
  const minutes = parseInt(minutePart, 10) || 0;

  if (Number.isNaN(hours) || minutes < 0 || minutes > 59) {
    return null;
  }

  if (period === "PM" && hours < 12) {
    hours += 12;
  } else if (period === "AM" && hours === 12) {
    hours = 0;
  }

  if (!period && hours >= 24) {
    hours %= 24;
  }

  return hours * 60 + minutes;
};

const roundUpToInterval = (minutes, interval = 15) => {
  if (!Number.isFinite(minutes)) return minutes;
  return Math.ceil(minutes / interval) * interval;
};

const formatMinutesAsLabel = (minutes) => {
  if (!Number.isFinite(minutes)) return "";
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setMinutes(minutes);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
};

const collectSlotsForDay = (availability, dayName) => {
  if (!availability) return [];

  const normalizedDay = dayName.toLowerCase();
  const daySpecificList = Array.isArray(availability.daySpecific)
    ? availability.daySpecific
    : [];

  const daySpecificEntry = daySpecificList.find(
    (entry) =>
      typeof entry?.day === "string" &&
      entry.day.toLowerCase() === normalizedDay
  );

  const normalizeSlots = (slotCollection) =>
    Array.isArray(slotCollection) ? slotCollection : [];

  const daySpecificSlots = normalizeSlots(daySpecificEntry?.slots).filter(
    (slot) => extractTimeString(slot?.startTime ?? slot?.start ?? slot?.from)
  );

  if (daySpecificSlots.length > 0) {
    return daySpecificSlots;
  }

  const weeklyEntry = availability?.weeklyAvailability?.[normalizedDay];
  if (!weeklyEntry || weeklyEntry.enabled === false) {
    return [];
  }

  const weeklySlots = normalizeSlots(weeklyEntry.slots).filter((slot) =>
    extractTimeString(slot?.startTime ?? slot?.start ?? slot?.from)
  );

  if (weeklySlots.length > 0) {
    return weeklySlots;
  }

  if (
    extractTimeString(
      weeklyEntry.startTime ??
      weeklyEntry.start ??
      weeklyEntry.from ??
      weeklyEntry.begin
    )
  ) {
    return [weeklyEntry];
  }

  return [];
};

const computeNextAvailableSlot = (availability, durationMinutes = 30) => {
  if (!availability) return null;

  const duration = Number(durationMinutes) > 0 ? Number(durationMinutes) : 30;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const threshold = roundUpToInterval(currentMinutes + 30, 15);

  for (let offset = 0; offset < 7; offset += 1) {
    const dayIndex = (now.getDay() + offset) % 7;
    const dayName = DAYS_OF_WEEK[dayIndex];
    const slots = collectSlotsForDay(availability, dayName);
    if (!slots.length) continue;

    for (const slot of slots) {
      const rawStart =
        slot?.startTime ??
        slot?.start ??
        slot?.from ??
        slot?.begin ??
        slot?.time ??
        slot;
      const rawEnd =
        slot?.endTime ?? slot?.end ?? slot?.to ?? slot?.finish ?? null;
      const slotStart = parseTimeToMinutes(rawStart);
      let slotEnd = parseTimeToMinutes(rawEnd);

      if (!Number.isFinite(slotStart)) {
        continue;
      }

      if (!Number.isFinite(slotEnd) || slotEnd <= slotStart) {
        const slotDuration = Number(slot?.duration) > 0 ? Number(slot.duration) : duration;
        slotEnd = slotStart + slotDuration;
      }

      const initial = offset === 0 ? Math.max(slotStart, threshold) : slotStart;
      const alignedStart = offset === 0 ? roundUpToInterval(initial, 15) : initial;

      for (
        let candidate = alignedStart;
        candidate + duration <= slotEnd + 1e-6;
        candidate += 15
      ) {
        const labelDay = offset === 0 ? "Today" : offset === 1 ? "Tomorrow" : dayName;
        return {
          day: labelDay,
          time: formatMinutesAsLabel(candidate),
        };
      }
    }
  }

  return null;
};

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
  const { selectedAvailability } = useSelector((state) => state.availability);


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

  console.log("Normalized expert", expert);
  useEffect(() => {
    if (expert?._id) {
      dispatch(getfeedbackbyexpertid({ id: expert._id }));
      dispatch(getAvailabilitybyid(expert._id));
    }
  }, [dispatch, expert?._id]);

  const expertId = expert?._id;

  const favIds = useSelector(selectFavouriteIds);
  const isFav = expertId ? favIds.includes(expertId) : false;
  const isUpdating = useSelector(s => selectIsUpdatingFavourite(s, expertId));

  const services = useMemo(
    () =>
      Array.isArray(expert?.credentials?.services)
        ? expert.credentials.services
        : [],
    [expert?.credentials?.services]
  );

  const defaultDuration = useMemo(() => {
    const durations = services
      .map((service) => Number(service?.duration))
      .filter((value) => Number.isFinite(value) && value > 0);
    if (durations.length === 0) {
      return 30;
    }
    return Math.min(...durations);
  }, [services]);

  const nextAvailableSlot = useMemo(
    () =>
      computeNextAvailableSlot(
        selectedAvailability?.availability,
        defaultDuration
      ),
    [selectedAvailability?.availability, defaultDuration]
  );

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

  // Extract blocked dates from availability data
  const blockedDates = selectedAvailability?.availability?.blockedDates || [];

  console.log("Selected availability data:", selectedAvailability);
  console.log("Blocked dates:", blockedDates);

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
              <BlockedDates blockedDates={blockedDates} />
              <Expertise skills={expert?.credentials?.skills || []} />
              <AvailableSlots selectedAvailability={selectedAvailability} />
              <ServicesOffered
                id="services-offered"
                services={services}
                nextAvailableSlot={nextAvailableSlot}
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