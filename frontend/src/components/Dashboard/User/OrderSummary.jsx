import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ExpertProfileInSchedule from "./Scheduling/ExpertProfileInSchedule";
import { useDispatch, useSelector } from "react-redux";
import { createVideoCall, getMeet, payed } from "@/Redux/Slices/meetingSlice";
import { getServicebyid } from "@/Redux/Slices/expert.Slice";
import { createpaymentOrder, verifypaymentOrder } from "@/Redux/Slices/paymentSlice";
import Spinner from "@/components/LoadingSkeleton/Spinner";

const OrderSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { selectedMeeting, loading, error } = useSelector((state) => state.meeting);
  const { selectedExpert, loading: expertLoading, error: expertError, selectedService } = useSelector((state) => state.expert);
  const { loading: paymentLoading, error: paymentError } = useSelector((state) => state.payment);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!selectedMeeting) {
      navigate("/schedule");
    }
  }, [selectedMeeting, navigate]);

  useEffect(() => {
    if (selectedMeeting?.expertId) {
      dispatch(getServicebyid(selectedMeeting.expertId));
    }
  }, [selectedMeeting, dispatch]);

  const handlePrevious = () => {
    navigate("/schedule");
  };

  const handleConfirmPayment = async () => {
    try {
      const response = await dispatch(createpaymentOrder({ amount: priceforsession })).unwrap();
      if (response?.order?.id) {
        const options = {
          key: "rzp_test_TLiBgHHM6i2Hhj",
          amount: response.order.amount,
          currency: "INR",
          name: "Expertia",
          description: "Test Transaction",
          order_id: response.order.id,
          handler: async function (response) {
            const verifyPayment = await dispatch(
              verifypaymentOrder({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              })
            ).unwrap();

            if (verifyPayment.signatureIsValid) {
              const meetData = {
                expertId: selectedMeeting.expertId,
                userId: selectedMeeting.userId,
                date: selectedMeeting.date,
                slot: selectedMeeting.daySpecific.slot,
                message: message,
                amount: priceforsession,
              };
              const meet = await dispatch(createVideoCall(meetData)).unwrap();
              if (meet?._id) {
                dispatch(payed());
                navigate(`/payment-success/${meet._id}`);
              }
            }
          },
          prefill: {
            name: "Test User",
            email: "test@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#16a34a",
          },
        };
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      }
    } catch (error) {
      console.error("Payment failed:", error);
    }
  };

  if (loading || expertLoading) {
    return <Spinner />;
  }

  if (error || expertError) {
    return <div>Error: {error || expertError}</div>;
  }

  const date = selectedMeeting?.date?.split("-")[2];
  const month = new Date(selectedMeeting?.date)?.toLocaleString("default", {
    month: "short",
  });
  const day = new Date(selectedMeeting?.date)?.toLocaleString("default", {
    weekday: "long",
  });
  const trimDay = day?.slice(0, 3);
  const expert = selectedExpert;
  const priceforsession = selectedService?.price;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-start lg:gap-6">
        {/* Expert Profile - Hidden on mobile initially, shown at bottom */}
        <div className="hidden lg:block lg:w-full lg:max-w-md">
          <div className="bg-white rounded-lg shadow-md p-6">
            <ExpertProfileInSchedule expert={expert} />
          </div>
        </div>

        {/* Order Summary Section */}
        <div className="w-full lg:max-w-md space-y-6">
          {/* Date and Time Card */}
          <div className="bg-[#EDFDF5] rounded-lg shadow-md px-4 py-3 md:px-6">
            <div className="flex items-center flex-wrap sm:flex-nowrap gap-4">
              <div className="bg-white px-3 py-1 flex flex-col items-center justify-center border-2 shadow-sm rounded-md">
                <p className="text-sm font-bold">{month}</p>
                <p className="text-lg font-extrabold">{date}</p>
              </div>
              <div className="flex-grow min-w-[200px]">
                <p className="text-gray-900 font-bold">
                  {trimDay}, {date || "No date selected"} {month || "No month selected"}
                </p>
                <p className="text-gray-700 font-medium text-sm">
                  {`${selectedMeeting?.daySpecific?.slot?.startTime} - ${selectedMeeting?.daySpecific?.slot?.endTime} (GMT+5:30)` || "No time selected"}
                </p>
              </div>
              <button
                onClick={handlePrevious}
                className="ml-auto px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                Change
              </button>
            </div>
          </div>

          {/* Payment Summary Card */}
          <div className="bg-white shadow-md rounded-lg p-4 md:p-6">
            <h1 className="text-lg font-semibold mb-4">Order Summary</h1>
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-gray-700">{selectedService.title}</p>
                <span>₹{priceforsession || "0"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Platform fee</span>
                <span className="text-green-600 font-semibold">FREE</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-bold">₹{priceforsession || "0"}</span>
              </div>

              <div className="space-y-2">
                <p className="text-green-600 font-semibold">
                  Add message to Expert (optional)
                </p>
                <textarea
                  className="w-full border rounded-md p-2 text-gray-600 resize-none"
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
            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            onClick={handleConfirmPayment}
            disabled={paymentLoading}
          >
            {paymentLoading ? "Processing..." : `Confirm and Pay ₹${priceforsession || "0"}`}
          </button>
        </div>

        {/* Expert Profile - Shown only on mobile at bottom */}
        <div className="lg:hidden mt-6">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <ExpertProfileInSchedule expert={expert} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;