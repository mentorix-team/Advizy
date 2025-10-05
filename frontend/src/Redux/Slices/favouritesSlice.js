import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import axiosInstance from "../../Helperw/axiosInstance";

const dedupe = (arr = []) => Array.from(new Set(arr.filter(Boolean)));

// RE-ADD this thunk
export const fetchFavourites = createAsyncThunk(
    "favourites/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get("/user/favourites");
            // Expect: favourites (populated) OR favouriteIds
            const populated = data.favourites || data.favouritesPopulated || [];
            const ids = data.favouriteIds || populated.map(e => e._id);
            return {
                ids: dedupe(ids),
                entities: Array.isArray(populated) ? populated : []
            };
        } catch (e) {
            return rejectWithValue(e.response?.data?.message || "Failed to load favourites");
        }
    }
);

export const toggleFavourite = createAsyncThunk(
    "favourites/toggle",
    async (expertId, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post("/user/favourites", { expertId });
            return {
                expertId,
                action: data.action,
                ids: dedupe(data.favourites || []),
                entities: data.favouritesPopulated || []
            };
        } catch (e) {
            return rejectWithValue({ message: e.response?.data?.message || "Failed", expertId });
        }
    }
);

const favouritesSlice = createSlice({
    name: "favourites",
    initialState: {
        ids: [],
        entities: [],
        loading: false,
        error: null,
        lastAction: null,
        updating: {} // { [expertId]: true }
    },
    reducers: {
        optimisticAdd(state, action) {
            const id = action.payload;
            if (!state.ids.includes(id)) state.ids.push(id);
        },
        optimisticRemove(state, action) {
            const id = action.payload;
            state.ids = state.ids.filter(x => x !== id);
        },
        clearFavourites(state) {
            state.ids = [];
            state.entities = [];
            state.updating = {};
            state.error = null;
            state.lastAction = null;
        }
    },
    extraReducers: builder => {
        const uniq = (arr = []) => Array.from(new Set(arr));

        builder
            .addCase(fetchFavourites.pending, s => { s.loading = true; s.error = null; })
            .addCase(fetchFavourites.fulfilled, (s, a) => {
                s.loading = false;
                s.ids = uniq(a.payload.ids);
                if (a.payload.entities.length) s.entities = a.payload.entities;
            })
            .addCase(fetchFavourites.rejected, (s, a) => {
                s.loading = false;
                s.error = a.payload;
            })
            .addCase(toggleFavourite.pending, (s, a) => {
                s.updating[a.meta.arg] = true;
            })
            .addCase(toggleFavourite.fulfilled, (s, a) => {
                const { expertId, action, favourites, entities } = a.payload;
                // Trust the action primarily
                if (action === "added" && !s.ids.includes(expertId)) {
                    s.ids.push(expertId);
                } else if (action === "removed") {
                    s.ids = s.ids.filter(id => id !== expertId);
                }
                // Align with server canonical list (normalized & deduped)
                if (Array.isArray(favourites) && favourites.length) {
                    s.ids = uniq(favourites);
                } else {
                    s.ids = uniq(s.ids);
                }
                if (Array.isArray(entities) && entities.length) {
                    const map = new Map();
                    entities.forEach(e => { if (e?._id) map.set(e._id, e); });
                    // Keep only those existing in ids
                    s.entities = Array.from(map.values()).filter(e => s.ids.includes(e._id));
                } else {
                    s.entities = s.entities.filter(e => s.ids.includes(e._id));
                }
                s.lastAction = action;
                delete s.updating[expertId];
            })
            .addCase(toggleFavourite.rejected, (s, a) => {
                const expertId = a.payload?.expertId || a.meta.arg;
                delete s.updating[expertId];
                s.error = a.payload?.message || "Failed";
            });
    }
});

export const {
    optimisticAdd,
    optimisticRemove,
    clearFavourites
} = favouritesSlice.actions;

export const selectFavouriteIds = state => state.favourites.ids;
export const selectIsUpdatingFavourite = (state, id) => !!state.favourites.updating[id];
export const makeSelectIsFavourite = () =>
    createSelector(
        [selectFavouriteIds, (_, id) => id],
        (ids, id) => ids.includes(id)
    );

export default favouritesSlice.reducer;