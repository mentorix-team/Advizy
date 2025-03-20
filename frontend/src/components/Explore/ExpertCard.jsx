import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "@/Redux/Slices/authSlice";
import AuthPopup from "@/components/Auth/AuthPopup.auth";
import { ChevronDown, LogOut, User, CircleUserRound, Video, BadgeIndianRupee, UserPen, MessageSquareText, LayoutDashboard, Home, UserCheck, Menu, X, Star, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";
import { useDispatch } from "react-redux";

// Badge Component
const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
  };

  return (
    <div
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

// Button Component
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";

// Card Components
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

// Expert Card Component
const ExpertCard = ({
  redirect_url,
  id,
  name,
  image,
  title,
  rating,
  totalRatings,
  experience,
  startingPrice,
  duration,
  expertise,
}) => {
  const [liked, setLiked] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [availability, setAvailability] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await dispatch(getAvailabilitybyid(id)).unwrap();
        setAvailability(response.availability);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    fetchAvailability();
  }, [dispatch, id]);

  // Find the first available slot
  const firstAvailableDay = availability?.daySpecific?.find(
    (day) => day.slots.length > 0
  );
  const firstAvailableTime = firstAvailableDay?.slots?.[0]?.startTime;

  const toggleLike = () => {
    setLiked(!liked);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <Card className="flex flex-col w-[503px] items-start gap-[12.27px] pt-[19.63px] pb-[28.21px] px-[24.53px] bg-[#fdfdfd] rounded-[9.81px] border-[1.23px] border-solid border-[#16954440] shadow-[0px_3px_9px_#16954440]">
      <CardContent className="relative self-stretch w-full h-[285.37px] p-0">
        <div className="flex flex-col w-[451px] items-start gap-[15.95px] absolute top-0 left-0">
          <div className="relative self-stretch w-full h-[145.23px]">
            <div className="absolute w-[427px] h-[145px] top-0 left-0">
              <div className="flex w-[110px] h-[129px] items-center gap-[12.27px] px-0 py-[9.81px] absolute top-0 left-0">
                <img
                  className="relative w-[110.4px] h-[110.4px] mt-[-0.61px] mb-[-0.61px] object-cover rounded-full"
                  alt={name}
                  src={image}
                />
              </div>

              <div className="absolute w-[302px] h-[145px] top-0 left-[125px]">
                <div className="absolute w-[302px] h-[88px] top-0 left-0">
                  <div className="absolute w-[302px] h-[63px] top-0 left-0">
                    <h3 className="absolute w-[302px] -top-px left-0 font-['Figtree',Helvetica] font-semibold text-[#1d1d1d] text-[21.3px] tracking-[0] leading-[29.8px] whitespace-nowrap">
                      {name}
                    </h3>
                    <p className="absolute w-[302px] top-7 left-0 opacity-80 font-['Figtree',Helvetica] font-normal text-[#1d1f1d] text-[15.5px] tracking-[0] leading-[23.2px] whitespace-nowrap">
                      {title}
                    </p>
                  </div>

                  <Badge className="inline-flex flex-col items-start gap-[9.67px] pl-[8.7px] pr-[9.67px] py-[1.93px] absolute top-[63px] left-[71px] bg-[#c4f3d34c] rounded-[24.16px] overflow-hidden text-[#1d1f1d] font-normal hover:bg-[#c4f3d34c]">
                    <div className="flex items-center gap-[7.73px] relative self-stretch w-full flex-[0_0_auto]">
                      <User className="relative w-[12.57px]" />
                      <span className="relative w-fit mt-[-0.97px] font-['Figtree',Helvetica] font-medium text-[10.6px] text-center tracking-[0] leading-[15.9px] whitespace-nowrap">
                        {totalRatings} Sessions done
                      </span>
                    </div>
                  </Badge>

                  <div className="absolute w-[59px] h-[25px] top-[63px] left-0 flex items-center">
                    <Star className="w-[18px] h-[18px] text-yellow-400" />
                    <span className="absolute top-0 left-[19px] font-['Figtree',Helvetica] font-medium text-[#1d1f1d] text-[14.5px] tracking-[0] leading-[21.7px] whitespace-nowrap">
                      {rating}/5
                    </span>
                  </div>
                </div>

                <div className="flex flex-col w-[302px] items-start gap-[4.41px] absolute top-[95px] left-0">
                  <p className="relative w-fit mt-[-1.23px] font-['Figtree',Helvetica] font-normal text-[15.5px] tracking-[0] leading-[23.2px] whitespace-nowrap">
                    <span className="text-[#1d1d1d]">Experience: </span>
                    <span className="font-medium text-[#1d1d1d]">{experience}</span>
                    <span className="text-[#1d1d1d]"> in industry</span>
                  </p>

                  <div className="flex flex-col h-[24.53px] items-start gap-[8.59px] relative self-stretch w-full">
                    <p className="relative w-fit mt-[-1.23px] font-['Figtree',Helvetica] font-normal text-[15.5px] tracking-[0]">
                      <span className="text-[#000000e6] leading-[0.1px]">
                        Starts at{" "}
                      </span>
                      <span className="font-medium text-[#0049b3] leading-[23.2px]">
                        ${startingPrice}
                      </span>
                      <span className="text-[#000000e6] leading-[0.1px]">
                        {" "}
                        for{" "}
                      </span>
                      <span className="font-medium text-[#0049b3] leading-[23.2px]">
                        {duration}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={toggleLike}
              className={`absolute right-0 top-0 ${isAnimating ? "animate-ping" : ""}`}
            >
              <Heart
                className={`h-6 w-6 transition-transform duration-300 ${
                  isAnimating ? "scale-125" : ""
                }`}
                fill={liked ? "#EF4444" : "none"}
                stroke={liked ? "#EF4444" : "currentColor"}
              />
            </button>
          </div>

          <div className="flex items-center justify-around gap-[22.08px] relative self-stretch w-full flex-[0_0_auto]">
            <div className="relative w-[451.41px] h-[65.01px]">
              <div className="relative w-[451px] h-[65px]">
                <div className="absolute w-[347px] h-6 top-0.5 left-0">
                  <div className="absolute w-[77px] top-0.5 left-0 font-['Figtree',Helvetica] font-normal text-[#1d1f1d] text-[15px] tracking-[0] leading-[22.5px]">
                    Expertise:
                  </div>

                  <div className="flex flex-wrap gap-2 absolute top-0 left-[78px]">
                    {expertise.map((tag, index) => (
                      <Badge
                        key={`tag-${index}`}
                        variant="secondary"
                        className="inline-flex items-center justify-center gap-[10.04px] px-[11.04px] py-[1.23px] bg-[#f2f2f2] rounded-[8.03px] text-[#1d1f1d] hover:bg-[#f2f2f2]"
                      >
                        <span className="font-['Figtree',Helvetica] font-normal text-[15px] text-center tracking-[0] leading-[22.5px] whitespace-nowrap">
                          {tag}
                        </span>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute w-[451px] h-11 top-[241px] left-0 flex justify-between items-center">
          <div className="w-[156px] h-11">
            <div className="h-11">
              <div className="flex flex-col w-[156px] items-start">
                <p className="font-['Figtree',Helvetica] font-medium text-[#1d1f1d] text-[14.5px] tracking-[0] leading-[21.7px]">
                  Next Available Slot:
                </p>
                <p className="font-['Figtree',Helvetica] font-normal text-[#1f409b] text-[14.5px] tracking-[0] leading-[21.7px]">
                  {firstAvailableDay
                    ? `${firstAvailableDay.day}, ${firstAvailableTime}`
                    : "No slots available"}
                </p>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-[7.73px]">
            <Button
              variant="outline"
              onClick={() => navigate(`/expert/${redirect_url}`)}
              className="w-[132px] h-[35px] items-center justify-center gap-[12.27px] px-[15.95px] py-[2.45px] bg-white rounded-[11.04px] shadow-[0px_2.45px_6.13px_2.15px_#0000001a] text-[#000000cc] hover:bg-white"
            >
              <span className="font-['Figtree',Helvetica] font-medium text-[14.5px] text-center tracking-[0] leading-[21.7px] whitespace-nowrap">
                View Profile
              </span>
            </Button>

            <Button
              onClick={() => navigate(`/expert/scheduling/${id}`)}
              className="w-[124px] h-[34px] bg-[#edfbf1] rounded-[11.04px] shadow-[0px_2.45px_6.13px_2.15px_#0000001a] text-[#169544] hover:bg-[#edfbf1] hover:text-[#169544]"
            >
              <span className="font-['Figtree',Helvetica] font-semibold text-[14.5px] text-center tracking-[0] leading-[21.7px] whitespace-nowrap">
                BOOK
              </span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertCard;