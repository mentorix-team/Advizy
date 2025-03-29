import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ExpertProfileInSchedule from "./Scheduling/ExpertProfileInSchedule";
import { useDispatch, useSelector } from "react-redux";
import { createVideoCall, getMeet, payed } from "@/Redux/Slices/meetingSlice";
import { getServicebyid } from "@/Redux/Slices/expert.Slice";
import { createpaymentOrder, verifypaymentOrder } from "@/Redux/Slices/paymentSlice";
import Spinner from "@/components/LoadingSkeleton/Spinner";
import CategoryNav from "@/components/Home/components/CategoryNav";
import Navbar from "@/components/Home/components/Navbar";
import Footer from "@/components/Home/components/Footer";
import { AnimatePresence } from "framer-motion";
import SearchModal from "@/components/Home/components/SearchModal";

const OrderSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showCategoryNav, setShowCategoryNav] = useState(false);
  const [isExpertMode, setIsExpertMode] = useState(false);

  const { selectedMeeting, loading, error } = useSelector((state) => state.meeting);
  const { selectedExpert, loading: expertLoading, error: expertError, selectedService } = useSelector((state) => state.expert);
  const { loading: paymentLoading, error: paymentError } = useSelector((state) => state.payment);
  console.log("this is selected meeting",selectedMeeting)
  const [message, setMessage] = useState("");

  useEffect(() => {
    dispatch(getMeet());
  }, [dispatch]);

  const handleToggle = () => {
    setIsExpertMode(!isExpertMode);
  };

  useEffect(() => {
    if (selectedMeeting?.serviceId && selectedMeeting?.expertId) {
      dispatch(getServicebyid({ 
        serviceId: selectedMeeting.serviceId, 
        expertId: selectedMeeting.expertId 
      })).unwrap()
        .then(response => {
          console.log("Service fetched successfully:", response);
        })
        .catch(error => {
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
    image: selectedExpert.credentials?.portfolio?.[0]?.photo?.secure_url || 'https://via.placeholder.com/100',
    name: selectedExpert.firstName + " " + selectedExpert.lastName,
    title: selectedExpert.credentials?.domain || 'No Title Provided',
    sessionDuration: selectedService.duration,
    price: selectedService.price,
    description: selectedService.detailedDescription,
    includes: selectedService.features,
  };

  const { selectedDate, startTime, endTime, Price } = location.state || {};
  const parsedDate = selectedDate ? new Date(selectedDate) : null;

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

  const handleConfirmPayment = async () => {
    try {
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded. Please try again later.");
      }
  
      if (!selectedDate) {
        throw new Error("Selected date is invalid.");
      }
  
      const parsedDate =
        typeof selectedDate === "string" || typeof selectedDate === "number"
          ? new Date(selectedDate)
          : selectedDate;
  
      if (!(parsedDate instanceof Date) || isNaN(parsedDate.getTime())) {
        throw new Error("Failed to parse selected date into a valid Date object.");
      }
  
      const { hours: startHours, minutes: startMinutes } = formatTime(selectedMeeting?.daySpecific?.slot?.startTime);
      const { hours: endHours, minutes: endMinutes } = formatTime(selectedMeeting?.daySpecific?.slot?.endTime);
  
      const startDateTime = new Date(parsedDate);
      startDateTime.setHours(startHours, startMinutes, 0, 0);
  
      const endDateTime = new Date(parsedDate);
      endDateTime.setHours(endHours, endMinutes, 0, 0);
  
      const dateStr = parsedDate.toISOString().split("T")[0];
      const amountInPaise = priceforsession * 100;
  
      const paymentData = {
        serviceId: selectedMeeting.serviceId,
        expertId: selectedMeeting.expertId,
        amount: amountInPaise,
        message: message,
        date: dateStr,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
      };
  
      const orderResponse = await dispatch(createpaymentOrder(paymentData)).unwrap();
  
      const options = {
        key: "rzp_test_1LI16MdQqpqI62",
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: "Advizy",
        description: "Session Booking",
        order_id: orderResponse.orderId,
        handler: async function (response) {
          const verificationData = {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          };
  
          console.log("Verification Data:", verificationData);
  
          const paymentResponse = await dispatch(verifypaymentOrder(verificationData));
  
          console.log("This is payment response", paymentResponse);
          const paymentData = {
            amount: orderResponse.amount,
            razorpay_order_id: paymentResponse.payload.razorpay_order_id,
            razorpay_payment_id: paymentResponse.payload.razorpay_payment_id,
            razorpay_signature: paymentResponse.payload.razorpay_signature,
          };
  
          const payedResponse = await dispatch(payed(paymentData));
          if (payedResponse.payload.success) {
            const videoCallData = {
              title: selectedExpert.credentials?.domain || 'No Title Provided',
              preferred_region: "ap-southeast-1",
            };
            await dispatch(createVideoCall(videoCallData));
          }
  
          navigate("/payment-success");
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  const priceforsession = selectedService?.price || Price;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Navbar
            onSearch={() => setIsModalOpen(true)}
            isExpertMode={isExpertMode}
            onToggleExpertMode={handleToggle}
          />
        </div>
        <AnimatePresence>
          {showCategoryNav && (
            <div className="border-t">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <CategoryNav categories={categories} />
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-start lg:gap-6">
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
                      {trimDay}, {date || "No date selected"} {month || "No month selected"}
                    </p>
                    <p className="text-gray-700 font-medium text-sm truncate">
                      {`${selectedMeeting?.daySpecific?.slot?.startTime} - ${selectedMeeting?.daySpecific?.slot?.endTime} (GMT+5:30)` || "No time selected"}
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
                    <p className="text-gray-700 truncate max-w-[70%]">{selectedService.title}</p>
                    <span className="font-medium">₹{priceforsession || "0"}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Platform fee</span>
                    <span className="text-green-600 font-semibold">FREE</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold">₹{priceforsession || "0"}</span>
                  </div>

                  <div className="space-y-2">
                    <p className="text-green-600 font-semibold">
                      Add message to Expert (optional)
                    </p>
                    <textarea
                      className="w-full border border-gray-300 rounded-md p-3 text-gray-600 resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Share what you'd like to discuss in the session..."
                      rows="3"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button 
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleConfirmPayment}
                disabled={paymentLoading}
              >
                {paymentLoading ? "Processing..." : `Confirm and Pay ₹${priceforsession || "0"}`}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Footer />
        </div>
      </footer>

      <SearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default OrderSummary;