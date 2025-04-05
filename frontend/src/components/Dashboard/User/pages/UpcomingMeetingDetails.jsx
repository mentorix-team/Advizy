// import { useParams, useNavigate } from "react-router-dom";
// import { useState, useEffect, useRef } from "react";
// import {
//   AiOutlineUser,
//   AiOutlineCalendar,
//   AiOutlineClockCircle,
//   AiOutlineArrowLeft,
//   AiOutlineUp,
//   AiOutlineDown,
// } from "react-icons/ai";
// import { BiDownload } from "react-icons/bi";
// import { BsChatDots } from "react-icons/bs";
// import { IoClose } from "react-icons/io5";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   addvideoparticipant,
//   getMeet,
//   getMeetingbyid,
// } from "@/Redux/Slices/meetingSlice";
// import { getExpertById, getServicebyid } from "@/Redux/Slices/expert.Slice";
// import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";
// import toast from "react-hot-toast";

// export default function UpcomingMeetingDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [showPopup, setShowPopup] = useState(false);
//   const [meeting, setMeeting] = useState(null);
//   const [showDetails, setShowDetails] = useState(true);
//   const { selectedExpert, selectedService } = useSelector(
//     (state) => state.expert
//   );
//   const { selectedMeeting } = useSelector((state) => state.meeting);
//   const { selectedAvailability } = useSelector((state) => state.availability);
//   console.log("this is availability", selectedAvailability?.availability);
//   const { data } = useSelector((state) => state.auth);

//   console.log("THesse are service and expert", selectedExpert);
//   console.log("THesse are service and expert", selectedService);
//   console.log("This is selected one", selectedMeeting);
//   const dispatch = useDispatch();
//   // const navigate = useNavigate()

//   const handleRescheduleuser = async () => {
//     if (!selectedMeeting || !selectedAvailability) {
//       console.error("Meeting or availability data is missing.");
//       return;
//     }

//     console.log("Now rescheduling");

//     const { noticeperiod, recheduleType } =
//       selectedAvailability?.availability?.reschedulePolicy;
//     const { date, slot } = selectedMeeting?.daySpecific;
//     const { startTime } = slot;

//     // Convert meeting date & time to IST
//     const meetingDateTimeIST = new Date(`${date} ${startTime} GMT+5:30`);

//     // Get current date & time in IST
//     const nowIST = new Date(
//       new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
//     );

//     // Convert notice period (e.g., "8 hrs") into milliseconds
//     const noticePeriodMs = parseInt(noticeperiod) * 60 * 60 * 1000; // Convert hours to milliseconds

//     // Calculate the difference between the meeting time and the current time
//     const timeDifference = meetingDateTimeIST - nowIST;
//     console.log("this is time", timeDifference);
//     if (timeDifference < noticePeriodMs) {
//       toast.error("Reschedule not allowed: Notice period has already passed.");
//       return;
//     }
//     const meeting_id = selectedMeeting._id;
//     navigate(`/user/rescheduling/${selectedMeeting.serviceId}`, {
//       state: { meeting_id },
//     });
//   };

//   const handleJoin = async () => {
//     try {
//       console.log(selectedMeeting);
//       console.log("This is user videocall id ", selectedMeeting.videoCallId);
//       const joinCallData = {
//         meeting_id: selectedMeeting.videoCallId,
//         custom_participant_id: selectedMeeting.userId,
//         name: `${data.firstName} ${data.lastName}`,
//         preset_name: "group_call_participant",
//       };

//       console.log("Preset Name being sent:", joinCallData.preset_name);

//       const response = await dispatch(addvideoparticipant(joinCallData));
//       console.log("this is response", response.payload);
//       if (response?.payload?.data?.data?.token) {
//         const authToken = response.payload.data.data.token;

//         console.log("Auth Token received:", authToken);

//         // Navigate to meeting page with authToken
//         navigate("/meeting", { state: { authToken } });
//       } else {
//         console.error("Failed to retrieve authToken.");
//       }
//     } catch (error) {
//       console.error("Error joining call:", error);
//     }
//   };

//   const countRef = useRef(0);
//   useEffect(() => {
//     const responses = async () => {
//       if (countRef.current >= 2) return; // Stop execution after 3 times

//       const response = await dispatch(getMeetingbyid(id));

//       if (response.payload.success && selectedMeeting?.serviceId) {
//         const serviceId = selectedMeeting.serviceId;
//         const expertId = selectedMeeting.expertId;

//         dispatch(getServicebyid({ serviceId, expertId }));

//         dispatch(getAvailabilitybyid(expertId));
//       }

//       countRef.current += 1; // Increment count
//     };

//     responses();
//   }, [dispatch, selectedMeeting]);

//   const handleShowPopup = () => {
//     setShowPopup(true);
//     setTimeout(() => {
//       setShowPopup(false);
//     }, 3000);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Mobile Action Bar - Fixed at bottom for mobile */}
//       <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40 space-y-2">
//         <button
//           className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
//           onClick={handleJoin}
//         >
//           Join Meeting
//         </button>
//         <div className="flex space-x-2">
//           <button
//             className="flex-1 text-gray-700 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-500 transition-colors text-sm"
//             onClick={handleRescheduleuser}
//           >
//             Request Reschedule
//           </button>
//           <button className="flex-1 text-red-500 py-2.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors text-sm">
//             Cancel Meeting
//           </button>
//         </div>
//       </div>

//       <div className="p-4 pb-32 lg:p-8 flex flex-col lg:flex-row max-w-7xl mx-auto">
//         {/* Main content */}
//         <div className="flex-1">
//           <div className="flex items-center mb-6">
//             <button
//               onClick={() => navigate("/meetings")}
//               className="flex items-center text-gray-600 hover:text-gray-900"
//             >
//               <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
//               Back to Meetings
//             </button>
//           </div>

//           <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
//             <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-6">
//               <div>
//                 <h2 className="text-lg md:text-xl text-green-600">
//                   {meeting?.type}
//                 </h2>
//                 <p className="text-gray-600 mt-1 text-sm md:text-base">
//                   {selectedMeeting?.title}
//                 </p>
//               </div>
//               <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm whitespace-nowrap">
//                 {selectedMeeting?.status}
//               </span>
//             </div>

//             <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
//               <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
//                 <AiOutlineUser className="w-6 h-6 text-green-600" />
//               </div>
//               <div className="flex-1">
//                 <div className="flex items-center">
//                   <h3 className="text-lg font-medium">
//                     {selectedMeeting?.expertName}
//                   </h3>
//                 </div>
//                 <p className="text-gray-500 text-sm">
//                   {selectedExpert?.credentials?.professionalTitle}
//                 </p>
//                 <div className="flex items-center mt-1">
//                   <span className="text-gray-600">
//                     {selectedExpert?.credentials?.reviews?.rating}
//                   </span>
//                 </div>
//               </div>
//               <button
//                 onClick={handleShowPopup}
//                 className="flex items-center space-x-2 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50"
//               >
//                 <BsChatDots className="w-5 h-5" />
//                 <span className="text-sm">Chat with Expert</span>
//               </button>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="flex items-center text-gray-600 mb-2">
//                   <AiOutlineCalendar className="w-5 h-5 mr-2 text-green-600" />
//                   <span className="text-sm">Date</span>
//                 </div>
//                 <p className="text-gray-900 font-medium">
//                   {selectedMeeting?.daySpecific.date}
//                 </p>
//               </div>
//               <div className="bg-gray-50 p-4 rounded-lg">
//                 <div className="flex items-center text-gray-600 mb-2">
//                   <AiOutlineClockCircle className="w-5 h-5 mr-2 text-green-600" />
//                   <span className="text-sm">Time Slot</span>
//                 </div>
//                 <p className="text-gray-900 font-medium">
//                   {selectedMeeting?.daySpecific.slot.startTime}-
//                   {selectedMeeting?.daySpecific?.slot?.endTime}
//                 </p>
//               </div>
//             </div>

//             <div className="bg-gray-50 p-4 rounded-lg mb-6">
//               <div className="flex flex-col sm:flex-row justify-between gap-4">
//                 <div>
//                   <div className="flex items-center text-gray-600 mb-1">
//                     <span className="text-xl">$</span>
//                     <span className="ml-2 text-sm">Price</span>
//                   </div>
//                   <p className="text-2xl font-medium">
//                     ${selectedMeeting?.amount}
//                   </p>
//                 </div>
//                 <div className="flex flex-col sm:flex-row gap-2">
//                   <button className="text-green-600 hover:text-green-700 border border-gray-200 px-4 py-2 rounded-lg text-sm">
//                     Order Summary
//                   </button>
//                   <button className="text-green-600 hover:text-green-700 flex items-center justify-center border border-gray-200 px-4 py-2 rounded-lg text-sm">
//                     <BiDownload className="w-5 h-5 mr-1" />
//                     Download Invoice
//                   </button>
//                 </div>
//               </div>
//             </div>

//             <div>
//               <div
//                 className="flex items-center justify-between cursor-pointer"
//                 onClick={() => setShowDetails(!showDetails)}
//               >
//                 <h3 className="text-lg font-medium">
//                   Service Description & Features
//                 </h3>
//                 <button className="text-gray-500 hover:text-gray-700">
//                   {showDetails ? (
//                     <AiOutlineUp className="w-5 h-5" />
//                   ) : (
//                     <AiOutlineDown className="w-5 h-5" />
//                   )}
//                 </button>
//               </div>
//               {showDetails && (
//                 <div className="mt-4">
//                   <p className="text-gray-600 text-sm md:text-base mb-4">
//                     {selectedService?.detailedDescription}
//                   </p>
//                   <h4 className="font-medium mb-2 text-sm md:text-base">
//                     Features included:
//                   </h4>
//                   <ul className="text-gray-600 space-y-2">
//                     {selectedService?.features.map((feature, index) => (
//                       <li
//                         key={index}
//                         className="flex items-center text-sm md:text-base"
//                       >
//                         <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></span>
//                         {feature}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Right sidebar - Hidden on mobile */}
//         <div className="hidden lg:block lg:w-80 lg:ml-8">
//           <div className="space-y-6 sticky top-8">
//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <button
//                 className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors mb-4"
//                 onClick={handleJoin}
//               >
//                 Join Meeting
//               </button>
//               <button
//                 className="w-full text-gray-700 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors mb-4"
//                 onClick={handleRescheduleuser}
//               >
//                 Request Reschedule
//               </button>
//               <button className="w-full text-red-500 py-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors">
//                 Cancel Meeting
//               </button>
//             </div>

//             <div className="bg-white p-6 rounded-lg shadow-sm">
//               <h3 className="text-lg font-medium mb-2">Need Help?</h3>
//               <p className="text-gray-600 text-sm mb-4">
//                 If you have any questions or need assistance, our support team
//                 is here to help.
//               </p>
//               <button
//                 onClick={handleShowPopup}
//                 className="w-full py-2 px-4 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
//               >
//                 Contact Support
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Coming Soon Popup */}
//       {showPopup && (
//         <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
//           <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
//           <div className="bg-white rounded-lg p-6 shadow-xl relative z-10 w-full max-w-md transform transition-all animate-fade-in">
//             <div className="absolute top-4 right-4">
//               <button
//                 onClick={() => setShowPopup(false)}
//                 className="text-gray-400 hover:text-gray-600 transition-colors"
//               >
//                 <IoClose className="w-6 h-6" />
//               </button>
//             </div>
//             <div className="text-center">
//               <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                 <BsChatDots className="w-8 h-8 text-green-600" />
//               </div>
//               <h3 className="text-xl font-semibold mb-2">Coming Soon!</h3>
//               <p className="text-gray-600">
//                 We're working hard to bring you this feature. Stay tuned for
//                 updates!
//               </p>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  AiOutlineUser,
  AiOutlineCalendar,
  AiOutlineClockCircle,
  AiOutlineArrowLeft,
  AiOutlineUp,
  AiOutlineDown,
} from "react-icons/ai";
import { BiDownload } from "react-icons/bi";
import { BsChatDots } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  addvideoparticipant,
  getMeet,
  getMeetingbyid,
} from "@/Redux/Slices/meetingSlice";
import { getExpertById, getServicebyid } from "@/Redux/Slices/expert.Slice";
import { getAvailabilitybyid } from "@/Redux/Slices/availability.slice";
import toast from "react-hot-toast";
import NoData from "@/NoData";

export default function UpcomingMeetingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [meeting, setMeeting] = useState(null);
  const [showDetails, setShowDetails] = useState(true);
  const { selectedExpert, selectedService } = useSelector(
    (state) => state.expert
  );
  const { selectedMeeting } = useSelector((state) => state.meeting);
  const { selectedAvailability } = useSelector((state) => state.availability);
  const { data } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const countRef = useRef(0);

  // Fetch meeting details and related data
  useEffect(() => {
    const responses = async () => {
      if (countRef.current >= 2) return; // Stop execution after 2 times

      const response = await dispatch(getMeetingbyid(id));

      if (response.payload.success && selectedMeeting?.serviceId) {
        const serviceId = selectedMeeting.serviceId;
        const expertId = selectedMeeting.expertId;

        dispatch(getServicebyid({ serviceId, expertId }));
        dispatch(getAvailabilitybyid(expertId));
      }

      countRef.current += 1; // Increment count
    };

    responses();
  }, [dispatch, selectedMeeting]);

  // Handle no data scenario
  if (!selectedMeeting || !selectedExpert || !selectedService) {
    return (
      <NoData/>
    );
  }

  const handleRescheduleuser = async () => {
    if (!selectedMeeting || !selectedAvailability) {
      console.error("Meeting or availability data is missing.");
      return;
    }

    const { noticeperiod } =
      selectedAvailability?.availability?.reschedulePolicy;
    const { date, slot } = selectedMeeting?.daySpecific;
    const { startTime } = slot;

    // Convert meeting date & time to IST
    const meetingDateTimeIST = new Date(`${date} ${startTime} GMT+5:30`);

    // Get current date & time in IST
    const nowIST = new Date(
      new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    // Convert notice period (e.g., "8 hrs") into milliseconds
    const noticePeriodMs = parseInt(noticeperiod) * 60 * 60 * 1000; // Convert hours to milliseconds

    // Calculate the difference between the meeting time and the current time
    const timeDifference = meetingDateTimeIST - nowIST;

    if (timeDifference < noticePeriodMs) {
      toast.error("Reschedule not allowed: Notice period has already passed.",  {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }

    const meeting_id = selectedMeeting._id;
    navigate(`/user/rescheduling/${selectedMeeting.serviceId}`, {
      state: { meeting_id },
    });
  };

  const handleJoin = async () => {
    try {
      const joinCallData = {
        meeting_id: selectedMeeting.videoCallId,
        custom_participant_id: selectedMeeting.userId,
        name: `${data.firstName} ${data.lastName}`,
        preset_name: "group_call_participant",
      };

      const response = await dispatch(addvideoparticipant(joinCallData));

      if (response?.payload?.data?.data?.token) {
        const authToken = response.payload.data.data.token;
        navigate("/meeting", { state: { authToken } });
      } else {
        console.error("Failed to retrieve authToken.");
      }
    } catch (error) {
      console.error("Error joining call:", error);
    }
  };

  const handleShowPopup = () => {
    setShowPopup(true);
    setTimeout(() => {
      setShowPopup(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Action Bar - Fixed at bottom for mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-40 space-y-2">
        <button
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
          onClick={handleJoin}
        >
          Join Meeting
        </button>
        <div className="flex space-x-2">
          <button
            className="flex-1 text-gray-700 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-500 transition-colors text-sm"
            onClick={handleRescheduleuser}
          >
            Request Reschedule
          </button>
          <button className="flex-1 text-red-500 py-2.5 rounded-lg border border-red-200 hover:bg-red-50 transition-colors text-sm">
            Cancel Meeting
          </button>
        </div>
      </div>

      <div className="p-4 pb-32 lg:p-8 flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* Main content */}
        <div className="flex-1">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate("/dashboard/user/meetings")}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <AiOutlineArrowLeft className="w-5 h-5 mr-2" />
              Back to Meetings
            </button>
          </div>

          {/* Meeting details */}
          <div className="bg-white rounded-lg p-4 md:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-6">
              <div>
                <h2 className="text-lg md:text-xl text-green-600">
                  {meeting?.type}
                </h2>
                <p className="text-gray-600 mt-1 text-sm md:text-base">
                  {selectedMeeting?.title}
                </p>
              </div>
              <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm whitespace-nowrap">
                {selectedMeeting?.status}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center shrink-0">
                <AiOutlineUser className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="text-lg font-medium">
                    {selectedMeeting?.expertName}
                  </h3>
                </div>
                <p className="text-gray-500 text-sm">
                  {selectedExpert?.credentials?.professionalTitle}
                </p>
                <div className="flex items-center mt-1">
                  <span className="text-gray-600">
                    {selectedExpert?.credentials?.reviews?.rating}
                  </span>
                </div>
              </div>
              <button
                onClick={handleShowPopup}
                className="flex items-center space-x-2 text-gray-700 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                <BsChatDots className="w-5 h-5" />
                <span className="text-sm">Chat with Expert</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-600 mb-2">
                  <AiOutlineCalendar className="w-5 h-5 mr-2 text-green-600" />
                  <span className="text-sm">Date</span>
                </div>
                <p className="text-gray-900 font-medium">
                  {selectedMeeting?.daySpecific.date}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-600 mb-2">
                  <AiOutlineClockCircle className="w-5 h-5 mr-2 text-green-600" />
                  <span className="text-sm">Time Slot</span>
                </div>
                <p className="text-gray-900 font-medium">
                  {selectedMeeting?.daySpecific.slot.startTime}-
                  {selectedMeeting?.daySpecific?.slot?.endTime}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div>
                  <div className="flex items-center text-gray-600 mb-1">
                    <span className="text-xl">$</span>
                    <span className="ml-2 text-sm">Price</span>
                  </div>
                  <p className="text-2xl font-medium">
                    ${selectedMeeting?.amount}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button className="text-green-600 hover:text-green-700 border border-gray-200 px-4 py-2 rounded-lg text-sm">
                    Order Summary
                  </button>
                  <button className="text-green-600 hover:text-green-700 flex items-center justify-center border border-gray-200 px-4 py-2 rounded-lg text-sm">
                    <BiDownload className="w-5 h-5 mr-1" />
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setShowDetails(!showDetails)}
              >
                <h3 className="text-lg font-medium">
                  Service Description & Features
                </h3>
                <button className="text-gray-500 hover:text-gray-700">
                  {showDetails ? (
                    <AiOutlineUp className="w-5 h-5" />
                  ) : (
                    <AiOutlineDown className="w-5 h-5" />
                  )}
                </button>
              </div>
              {showDetails && (
                <div className="mt-4">
                  <p className="text-gray-600 text-sm md:text-base mb-4">
                    {selectedService?.detailedDescription}
                  </p>
                  <h4 className="font-medium mb-2 text-sm md:text-base">
                    Features included:
                  </h4>
                  <ul className="text-gray-600 space-y-2">
                    {selectedService?.features.map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-center text-sm md:text-base"
                      >
                        <span className="w-1.5 h-1.5 bg-gray-600 rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar - Hidden on mobile */}
        <div className="hidden lg:block lg:w-80 lg:ml-8">
          <div className="space-y-6 sticky top-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <button
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors mb-4"
                onClick={handleJoin}
              >
                Join Meeting
              </button>
              <button
                className="w-full text-gray-700 py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors mb-4"
                onClick={handleRescheduleuser}
              >
                Request Reschedule
              </button>
              <button className="w-full text-red-500 py-3 rounded-lg border border-red-200 hover:bg-red-50 transition-colors">
                Cancel Meeting
              </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-2">Need Help?</h3>
              <p className="text-gray-600 text-sm mb-4">
                If you have any questions or need assistance, our support team
                is here to help.
              </p>
              <button
                onClick={handleShowPopup}
                className="w-full py-2 px-4 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div>
          <div className="bg-white rounded-lg p-6 shadow-xl relative z-10 w-full max-w-md transform transition-all animate-fade-in">
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <IoClose className="w-6 h-6" />
              </button>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BsChatDots className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Coming Soon!</h3>
              <p className="text-gray-600">
                We're working hard to bring you this feature. Stay tuned for
                updates!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
