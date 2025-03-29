import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircleIcon, User } from "lucide-react";
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";

export const ExpertCard = ({ expert }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);
  const [availability, setAvailability] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const calculateTotalExperience = (workExperiences) => {
    if (!Array.isArray(workExperiences) || workExperiences.length === 0) return "0 years";
  
    let totalMonths = 0;
  
    workExperiences.forEach((job) => {
      if (!job.startDate || !job.endDate) return;
  
      const start = new Date(job.startDate);
      const end = new Date(job.endDate);
  
      const yearsDiff = end.getFullYear() - start.getFullYear();
      const monthsDiff = end.getMonth() - start.getMonth();
  
      totalMonths += yearsDiff * 12 + monthsDiff;
    });
  
    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;
  
    return years > 0 ? `${years} years ${months} months` : `${months} months`;
  };

  const mentoringService = expert.credentials?.services?.find(
    (service) => service.title === "One-on-One Mentoring"
  );

  const firstEnabledSlot = mentoringService?.one_on_one?.find(
    (slot) => slot.enabled
  );

  const startingPrice = firstEnabledSlot?.price || 0;
  const duration = firstEnabledSlot?.duration || "N/A";

  const totalExperience = calculateTotalExperience(expert.credentials?.work_experiences);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          setIsVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await dispatch(getAvailabilitybyid(expert._id)).unwrap(); 
        setAvailability(response.availability);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [dispatch, expert._id]);

  const firstAvailableDay = availability?.daySpecific?.find(day => day.slots.length > 0);
  const firstAvailableTime = firstAvailableDay?.slots?.[0]?.startTime;

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    toast.success(
      !isFavorite ? 'Added to favorites!' : 'Removed from favorites!',
      {
        duration: 2000,
        position: 'top-right',
        style: {
          background: '#169544',
          color: '#fff',
          borderRadius: '10px',
        },
      }
    );
  };

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white w-[884px]">
        <Card className="relative w-[289px] mx-auto mt-[41px] bg-neutral-50 border border-solid border-[#00000040]">
          <CardContent className="p-5">
            <div className="flex flex-col items-center">
              <div className="py-2.5">
                <Avatar className="w-[120px] h-[120px]">
                  <AvatarImage src={expert?.profileImage?.secure_url || "/ellipse-10.png"} alt={`${expert.firstName} ${expert.lastName}`} />
                  <AvatarFallback>{`${expert.firstName?.[0]}${expert.lastName?.[0]}`}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex items-center gap-[1.22px] mt-6">
                <span className="text-yellow-400">★</span>
                <span className="font-medium text-black text-[13.4px] leading-[20.1px] font-['Figtree',Helvetica]">
                  {expert.reviews?.length > 0
                    ? (expert.reviews.reduce((acc, review) => acc + review.rating, 0) / expert.reviews.length).toFixed(1)
                    : "0.0"}/5
                </span>
                
                <span className="font-medium text-gray-700 text-[9.8px] leading-[14.6px] font-['Figtree',Helvetica]">
                  ({expert.reviews?.length || 0})
                </span>
              </div>

              <div className="flex flex-col items-center w-full mt-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-['Figtree',Helvetica] font-semibold text-[#1d1f1d] text-xl leading-7">
                    {`${expert.firstName} ${expert.lastName}`}
                  </h3>
                  <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                </div>
                <p className="opacity-80 font-['Figtree',Helvetica] font-normal text-black text-base text-center leading-6">
                  {expert.credentials?.domain}
                </p>
              </div>

              <div className="flex w-full items-center justify-between mt-6">
                <div className="flex flex-col">
                  <span className="font-['Figtree',Helvetica] font-medium text-[#1d1f1d] text-xs leading-[18px]">
                    Next Available Slot:
                  </span>
                  <span className="font-['Figtree',Helvetica] font-normal text-[#1f409b] text-xs leading-[18px]">
                    {firstAvailableDay ? `${firstAvailableDay.day}, ${firstAvailableTime}` : "No slots available"}
                  </span>
                </div>

                <button
                  onClick={() => navigate(`/expert/${expert.redirect_url}`)}
                  className="h-[27px] bg-neutral-50 rounded-[9px] border-[#00000040] shadow-[0px_2px_5px_1.75px_#0000001a] font-['Figtree',Helvetica] font-medium text-[#1d1d1fcc] text-[15px] px-4"
                >
                  View Profile
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpertCard;