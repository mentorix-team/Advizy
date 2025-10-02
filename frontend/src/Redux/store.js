import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from './Slices/authSlice.js'
import expertSliceReducer from './Slices/expert.Slice.js'
import availabilitySliceReducer from './Slices/availability.slice.js'
import meetingSliceReducer from './Slices/meetingSlice.js'
import paymentSliceReducer from './Slices/paymentSlice.js'
import supportQueriesSliceReducer from './Slices/supportQueriesSlice.js'
import payuReducer from './Slices/Payu.slice.js'
import favouritesReducer from "./Slices/favouritesSlice";

const store = configureStore({
    reducer: {
        auth: authSliceReducer,
        expert: expertSliceReducer,
        availability: availabilitySliceReducer,
        meeting: meetingSliceReducer,
        payment: paymentSliceReducer,
        supportQueries: supportQueriesSliceReducer,
        payu: payuReducer,
        favourites: favouritesReducer
    },
    devTools: true
});
export default store