import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ExpertProfileInSchedule from "./Scheduling/ExpertProfileInSchedule";
import { useDispatch, useSelector } from "react-redux";
import { createVideoCall, getMeet, payed } from "@/Redux/Slices/meetingSlice";
import { getServicebyid } from "@/Redux/Slices/expert.Slice";
import {
  createpaymentOrder,
  verifypaymentOrder,
} from "@/Redux/Slices/paymentSlice";
import Spinner from "@/components/LoadingSkeleton/Spinner";
import CategoryNav from "@/components/Home/components/CategoryNav";
import Navbar from "@/components/Home/components/Navbar";
import Footer from "@/components/Home/components/Footer";
import { AnimatePresence } from "framer-motion";
import SearchModal from "@/components/Home/components/SearchModal";
import { PayU } from "@/Redux/Slices/Payu.slice";
import SmallSpinner from "@/components/LoadingSkeleton/SmallSpinner";

const PayuOrderSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);
  const [delayedPrice, setDelayedPrice] = useState(null);
  const { selectedMeeting, loading, error } = useSelector(
    (state) => state.meeting
  );
  const {
    selectedExpert,
    loading: expertLoading,
    error: expertError,
    selectedService,
  } = useSelector((state) => state.expert);
  const { data } = useSelector((state) => state.auth);

  const [isPriceLoading, setIsPriceLoading] = useState(true);

  const user = typeof data === "string" ? JSON.parse(data) : data;

  const { loading: paymentLoading, error: paymentError } = useSelector(
    (state) => state.payment
  );
  console.log("this is selected meeting", selectedMeeting);
  const [message, setMessage] = useState("");

  const {
    durationforstate,
    selectedDate,
    includes,
    serviceDescription,
    title,
    selectedTime,
  } = location.state || {};
  const Price = location.state?.Price; // Ensure it exists before accessing
  const parsedDate = selectedDate ? new Date(selectedDate) : null;
  console.log("parsed", parsedDate);
  console.log("this is also price", Price);

  useEffect(() => {
    dispatch(getMeet());
  }, [dispatch]);

  const handleToggle = () => {
    setIsExpertMode(!isExpertMode);
  };

  useEffect(() => {
    if (selectedMeeting?.serviceId && selectedMeeting?.expertId) {
      dispatch(
        getServicebyid({
          serviceId: selectedMeeting.serviceId,
          expertId: selectedMeeting.expertId,
        })
      )
        .unwrap()
        .then((response) => {
          console.log("Service fetched successfully:", response);
        })
        .catch((error) => {
          console.error("Failed to fetch service:", error);
        });
    }
  }, [selectedMeeting, dispatch]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      console.log("Razorpay script loaded successfully.");
    };

    script.onerror = () => {
      console.error("Failed to load Razorpay script.");
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    setIsPriceLoading(true);
    if (selectedService?.price) {
      setDelayedPrice(selectedService.price);
      setIsPriceLoading(false);
    } else {
      const timeout = setTimeout(() => {
        setDelayedPrice(selectedService?.price || Price);
        setIsPriceLoading(false);
      }, 3000); // Wait for 3 seconds

      return () => clearTimeout(timeout); // Cleanup the timeout
    }
  }, [selectedService?.price, Price]);

  if (loading || expertLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error fetching meeting data: {error}</div>;
  }

  if (expertError) {
    return <div>Error fetching expert data: {expertError}</div>;
  }

  const formatTime = (timeString) => {
    if (!timeString) return { hours: 0, minutes: 0 }; // Default to 00:00 if no time is provided

    // Split the string time into hours and minutes
    const [time, modifier] = timeString.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    // Convert time to 24-hour format
    if (modifier === "PM" && hours < 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return { hours, minutes }; // Return an object
  };

  const expert = {
    image:
      selectedExpert?.profileImage?.secure_url ||
      "https://img.freepik.com/premium-vector/character-avatar-isolated_729149-194801.jpg?semt=ais_hybrid&w=740&q=80",
    name: selectedExpert?.firstName + " " + selectedExpert?.lastName,
    title:
      selectedExpert?.credentials?.professionalTitle ||
      title ||
      "No Title Provided",
    sessionDuration: selectedService?.duration || durationforstate,
    price: selectedService?.price || Price,
    description: selectedService?.detailedDescription || serviceDescription,
    includes: selectedService?.features || includes,
  };

  const formatSelectedDate = (date) => {
    if (!date) return { monthDate: "No Date", day: "No Day" };
    const optionsForMonthDate = { month: "short", day: "numeric" };
    const optionsForDay = { weekday: "long" };
    const monthDate = date.toLocaleDateString("en-US", optionsForMonthDate);
    const day = date.toLocaleDateString("en-US", optionsForDay);
    return { monthDate, day };
  };

  const { monthDate, day } = formatSelectedDate(parsedDate);
  const month = monthDate.split(" ")[0];
  const date = monthDate.split(" ")[1];
  const trimDay = day.slice(0, 3);

  const handlePrevious = () => {
    navigate(-1);
  };

  const handlePayuPayment = async () => {
    try {
      if (!selectedDate) {
        throw new Error("Selected date is invalid.");
      }

      const parsedDate =
        typeof selectedDate === "string" || typeof selectedDate === "number"
          ? new Date(selectedDate)
          : selectedDate;

      if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
        throw new Error(
          "Failed to parse selected date into a valid Date object."
        );
      }

      const { hours: startHours, minutes: startMinutes } = formatTime(
        selectedMeeting?.daySpecific?.slot?.startTime
      );
      const { hours: endHours, minutes: endMinutes } = formatTime(
        selectedMeeting?.daySpecific?.slot?.endTime
      );

      const startDateTime = new Date(parsedDate);
      startDateTime.setHours(startHours, startMinutes, 0, 0);

      const endDateTime = new Date(parsedDate);
      endDateTime.setHours(endHours, endMinutes, 0, 0);

      const paymentData = {
        txnid: `TXN${Date.now()}`,
        amount: priceforsession.toString(),
        firstname: selectedMeeting?.userName || "Customer Name", // Replace with actual user data
        email: user?.email || "customer@example.com", // Replace with actual user data
        phone: user?.mobile || "9999999999", // Replace with actual user data
        productinfo: selectedService?.title || "Service Booking",
        serviceId: selectedMeeting?.serviceId,
        expertId: selectedMeeting?.expertId,
        userId: user?._id,
        date: parsedDate.toISOString().split("T")[0],
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        message: message,
      };

      console.log("PayU Payment Data being sent:", paymentData);
      console.log("Message being sent:", message);
      console.log("Message length:", message?.length || 0);

      const response = await dispatch(PayU(paymentData)).unwrap();
      console.log('this is payu response', response)
      const payuWindow = window.open("", "_blank");
      if (response) {
        payuWindow.document.write(response)
      }
    } catch (error) {
      console.error("PayU payment failed:", error);
      // Handle error (show toast, etc.)
    }
  };

  const handleConfirmPayment = async () => {
    try {
      await handlePayuPayment();
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  console.log("this is delayed", delayedPrice);
  const priceforsession = delayedPrice;

  if (loading && paymentLoading && expertLoading) {
    return <Spinner />;
  }

  const handleModalCategorySelect = (category) => {
    if (category.value) {
      navigate(`/explore?category=${category.value}`);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Navbar
            onSearch={() => setIsModalOpen(true)}
            isExpertMode={isExpertMode}
            onToggleExpertMode={handleToggle}
          />
        </div>
      </div>

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row  lg:gap-6">
            {/* Expert Profile - Hidden on mobile initially */}
            <div className="hidden lg:block lg:w-full lg:max-w-md">
              <div className="bg-white rounded-lg shadow-md p-6">
                <ExpertProfileInSchedule expert={expert} />
              </div>
            </div>

            {/* Order Summary Section */}
            <div className="w-full lg:max-w-md space-y-4 md:space-y-6">
              {/* Date and Time Card */}
              <div className="bg-[#EDFDF5] rounded-lg shadow-md px-4 md:px-6 py-3">
                <div className="flex flex-wrap md:flex-nowrap items-center gap-4">
                  <div className="bg-white px-3 py-1 flex flex-col items-center justify-center border-2 shadow-sm rounded-md">
                    <p className="text-sm font-bold">{month}</p>
                    <p className="text-lg font-extrabold">{date}</p>
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-gray-900 font-bold truncate">
                      {trimDay}, {date || "No date selected"}{" "}
                      {month || "No month selected"}
                    </p>
                    <p className="text-gray-700 font-medium text-sm truncate">
                      {`${selectedMeeting?.daySpecific?.slot?.startTime} - ${selectedMeeting?.daySpecific?.slot?.endTime} (GMT+5:30)` ||
                        "No time selected"}
                    </p>
                  </div>
                  <button
                    onClick={handlePrevious}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm whitespace-nowrap"
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Payment Summary Card */}
              <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
                <h1 className="text-lg font-semibold mb-4">Order Summary</h1>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700 truncate max-w-[70%]">
                      {selectedService?.title || title || "Service"}
                    </p>
                    {isPriceLoading ? (
                      <SmallSpinner />
                    ) : (
                      <span className="font-medium">
                        ₹{priceforsession || "0"}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Platform fee</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    {isPriceLoading ? (
                      <SmallSpinner />
                    ) : (
                      <span className="font-medium">
                        ₹{priceforsession || "0"}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-2 p-2 bg-gray-50 rounded-lg border">
                    {/* <div className="flex items-center gap-2">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-5 w-5 text-green-600" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                        />
                      </svg>
                      <p className="text-green-600 font-semibold text-sm">
                        Add message to Expert (optional)
                      </p>
                    </div> */}
                    <textarea
                      className="w-full border border-gray-300 rounded-md p-3 text-sm text-gray-700 resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                      placeholder="Add a message for the expert (optional)"
                      rows="3"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={500}
                    ></textarea>
                    <div className="flex justify-between items-center text-xs md:text-sm text-gray-500">
                      <span>Help your expert prepare better for the session</span>
                      <span>{message.length}/500</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleConfirmPayment}
                disabled={paymentLoading}
              >
                {paymentLoading
                  ? "Processing..."
                  : `Confirm and Pay ₹${priceforsession || "0"}`}
              </button>
            </div>

            {/* Expert Profile - Mobile view at bottom */}
            <div className="lg:hidden mt-6">
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <ExpertProfileInSchedule expert={expert} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className=" border-t mt-auto">
        <Footer />
      </footer>

      <SearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCategorySelect={handleModalCategorySelect}
      />
    </div>
  );
};

export default PayuOrderSummary;
