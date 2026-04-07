import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * calcSlice — caches the latest result from each backend calculator endpoint.
 *
 * State shape:
 * {
 *   results:  { 'efb-dm': {...}, 'opdc-dm': {...}, ... }
 *   loading:  { 'efb-dm': false, ... }
 *   errors:   { 'efb-dm': null,  ... }
 * }
 *
 * Usage in a component:
 *   const dispatch = useDispatch();
 *   const { results, loading } = useSelector(s => s.calc);
 *   dispatch(runCalc({ name: 'efb-dm', body: { ffb, util, ... } }));
 */

export const runCalc = createAsyncThunk(
  'calc/run',
  async ({ name, body, endpoint }, { rejectWithValue }) => {
    const route = endpoint || name;
    const res = await fetch(`/api/calc/${route}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      return rejectWithValue({ name, message: text });
    }
    const data = await res.json();
    return { name, data };
  }
);

const calcSlice = createSlice({
  name: 'calc',
  initialState: {
    results: {},
    loading: {},
    errors:  {},
  },
  reducers: {
    clearCalc(state, action) {
      const name = action.payload;
      delete state.results[name];
      delete state.loading[name];
      delete state.errors[name];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runCalc.pending, (state, action) => {
        const name = action.meta.arg.name;
        state.loading[name] = true;
        state.errors[name]  = null;
      })
      .addCase(runCalc.fulfilled, (state, action) => {
        const { name, data } = action.payload;
        state.loading[name]  = false;
        state.results[name]  = data;
      })
      .addCase(runCalc.rejected, (state, action) => {
        const name = action.meta.arg.name;
        state.loading[name] = false;
        state.errors[name]  = action.payload?.message || action.error.message;
      });
  },
});

export const { clearCalc } = calcSlice.actions;
export default calcSlice.reducer;
