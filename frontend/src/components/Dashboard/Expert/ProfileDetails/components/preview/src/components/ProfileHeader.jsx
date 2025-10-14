import { MapPin, Link as LinkIcon } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaFacebook,
} from "react-icons/fa";

const MAX_SOCIAL_LINKS = 4;

const ProfileHeader = ({
  firstName,
  lastName,
  city,
  nationality,
  professionalTitle,
  profileImage,
  coverImage,
  reviews,
  socialLinks = [],
}) => {
  const averageRating = reviews?.length
    ? (
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    ).toFixed(1)
    : "0.0";

  const ensureProtocol = (url) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    return `https://${url}`;
  };

  const formatLinkLabel = (url) => {
    if (!url) return "";
    try {
      const parsed = new URL(ensureProtocol(url));
      const pathname = parsed.pathname === "/" ? "" : parsed.pathname;
      return `${parsed.hostname.replace(/^www\./i, "")}${pathname}`;
    } catch (error) {
      return url;
    }
  };

  const PLATFORM_MAP = [
    {
      matcher: /linkedin\.com/i,
      label: "LinkedIn",
      Icon: FaLinkedin,
      iconClassName: "text-[#0A66C2]",
    },
    {
      matcher: /github\.com/i,
      label: "GitHub",
      Icon: FaGithub,
      iconClassName: "text-gray-900",
    },
    {
      matcher: /twitter\.com|x\.com/i,
      label: "Twitter",
      Icon: FaTwitter,
      iconClassName: "text-sky-500",
    },
    {
      matcher: /instagram\.com/i,
      label: "Instagram",
      Icon: FaInstagram,
      iconClassName: "text-[#E1306C]",
    },
    {
      matcher: /facebook\.com/i,
      label: "Facebook",
      Icon: FaFacebook,
      iconClassName: "text-[#1877F2]",
    },
  ];

  const normalizedLinks = Array.isArray(socialLinks)
    ? socialLinks.slice(0, MAX_SOCIAL_LINKS)
    : [];

  const socialLinkMeta = normalizedLinks
    .map((link) => {
      if (!link) return null;

      const rawUrl = typeof link === "string" ? link : link.url || link.href || "";
      if (!rawUrl) return null;

      const platform = PLATFORM_MAP.find(({ matcher }) => matcher.test(rawUrl));
      const Icon = platform?.Icon || LinkIcon;
      const labelFromLink =
        (typeof link === "object" && (link.label || link.platform)) || "";

      return {
        href: ensureProtocol(rawUrl),
        label: platform?.label || labelFromLink || formatLinkLabel(rawUrl) || "Website",
        Icon,
        iconClassName: platform?.iconClassName || "text-primary",
      };
    })
    .filter(Boolean);

  return (
    <div className="relative">
      {/* Cover Image */}
      <div className="h-[200px] sm:h-[300px] w-full bg-gray-200">
        {coverImage && (
          <img
            src={coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Section */}
      <div
        className="absolute left-0 w-full px-4 sm:px-6 lg:px-8"
        style={{ bottom: "-80px" }}
      >
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-full relative">
          <div className="flex flex-col md:flex-row items-start gap-4">
            {/* Profile Image */}
            <div className="relative -mt-16 md:-mt-20">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-300 rounded-full border-4 border-white overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-left">
              <h1 className="text-black font-figtree text-2xl md:text-4xl font-medium leading-[120%] mb-2">
                {firstName} {lastName}
              </h1>
              <p className="text-black font-figtree text-lg md:text-xl font-normal leading-[140%]">
                {professionalTitle}
              </p>
              <p className="flex items-center mt-2 text-gray-600">
                <MapPin className="w-4 h-4 text-gray-600" />
                {city}, {nationality}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-3">
                <span className="text-yellow-400 text-lg">★</span>
                <span className="text-lg font-medium">{averageRating}</span>
                <span className="text-gray-500 text-sm">
                  ({reviews?.length || 0} reviews)
                </span>
              </div>
            </div>
          </div>

          {socialLinkMeta.length > 0 && (
            <div className="absolute right-6 bottom-6 flex items-center gap-3">
              {socialLinkMeta.map(({ href, label, Icon, iconClassName }, index) => (
                <motion.a
                  key={`${href}-${index}`}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${label}`}
                  className="inline-flex items-center justify-center w-9 h-9 text-primary hover:rounded-lg transition-shadow"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 10
                  }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 15
                    }}
                  >
                    <Icon className={`w-8 h-8 ${iconClassName}`} aria-hidden />
                  </motion.div>
                  <span className="sr-only">{label}</span>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
