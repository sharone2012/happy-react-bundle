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
    // streamVolumes: { efb: 8262, opdc: 1256, ... } — t/month from S0 sliders
    streamVolumes: {},
    // customStreamNames: { custom_1: 'My Residue', custom_2: '...' } — user-defined labels
    customStreamNames: {},
  },
  reducers: {
    setStreamState(state, action) {
      state.activeStreams = { ...state.activeStreams, ...action.payload };
    },
    setStreamVolumes(state, action) {
      state.streamVolumes = { ...state.streamVolumes, ...action.payload };
    },
    setCustomStreamNames(state, action) {
      state.customStreamNames = { ...state.customStreamNames, ...action.payload };
    },
  },
});

export const { setStreamState, setStreamVolumes, setCustomStreamNames } = s0Slice.actions;

const store = configureStore({
  reducer: {
    calc: calcReducer,
    bio:  bioReducer,
    s0:   s0Slice.reducer,
  },
});

export default store;
