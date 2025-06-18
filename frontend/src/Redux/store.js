import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './Slices/authSlice.js'
import expertSliceReducer from './Slices/expert.Slice.js'
import availabilitySliceReducer from './Slices/availability.slice.js'
import meetingSliceReducer from './Slices/meetingSlice.js'
import paymentSliceReducer from './Slices/paymentSlice.js'
import supportQueriesSliceReducer from './Slices/supportQueriesSlice.js'
const store = configureStore({
    reducer:{
        auth : authSliceReducer,
        expert:expertSliceReducer,
        availability:availabilitySliceReducer,
        meeting:meetingSliceReducer,
        payment:paymentSliceReducer,
        supportQueries: supportQueriesSliceReducer,
    },
    devTools:true
});
export default store