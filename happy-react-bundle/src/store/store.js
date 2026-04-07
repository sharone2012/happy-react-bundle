import { configureStore } from '@reduxjs/toolkit';
import calcReducer from './slices/calcSlice';
import bioReducer  from './slices/bioSlice';

const store = configureStore({
  reducer: {
    calc: calcReducer,
    bio:  bioReducer,
  },
});

export default store;
