import { configureStore, createSlice } from '@reduxjs/toolkit';
import calcReducer from './slices/calcSlice';
import bioReducer  from './slices/bioSlice';

// ── s0 slice — mirrors SiteSetup activeStreams for cross-component access
const s0Slice = createSlice({
  name: 's0',
  initialState: {
    activeStreams: {
      efb: false, opdc: false, pos: false, pmf: false,
      pke: false, pome: false, opf: false, opt: false,
    },
  },
  reducers: {
    setStreamState(state, action) {
      state.activeStreams = { ...state.activeStreams, ...action.payload };
    },
  },
});

export const { setStreamState } = s0Slice.actions;

const store = configureStore({
  reducer: {
    calc: calcReducer,
    bio:  bioReducer,
    s0:   s0Slice.reducer,
  },
});

export default store;
