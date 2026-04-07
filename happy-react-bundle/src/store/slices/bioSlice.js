import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * bioSlice — organism library state, connected to Supabase + backend API.
 *
 * State shape:
 * {
 *   organisms:    [],      // loaded from Supabase biological_library
 *   loadingFetch: false,
 *   loadingInsert: false,
 *   errorFetch:   null,
 *   errorInsert:  null,
 *   insertResult: null,    // last insert response from backend
 * }
 */

// ── Fetch all organisms from Supabase directly (read path) ──────────────────
export const fetchOrganisms = createAsyncThunk(
  'bio/fetchOrganisms',
  async (_, { rejectWithValue }) => {
    const url  = import.meta.env.VITE_SUPABASE_URL;
    const key  = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
    const res  = await fetch(
      `${url}/rest/v1/biological_library?order=organism_name.asc&limit=500`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
      }
    );
    if (!res.ok) {
      const text = await res.text();
      return rejectWithValue(text);
    }
    return res.json();
  }
);

// ── Insert organism via Express backend (write path) ───────────────────────
export const insertOrganism = createAsyncThunk(
  'bio/insertOrganism',
  async (payload, { rejectWithValue }) => {
    const res = await fetch('/api/insert-organism', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      return rejectWithValue(text);
    }
    return res.json();
  }
);

const bioSlice = createSlice({
  name: 'bio',
  initialState: {
    organisms:     [],
    loadingFetch:  false,
    loadingInsert: false,
    errorFetch:    null,
    errorInsert:   null,
    insertResult:  null,
  },
  reducers: {
    clearInsertResult(state) {
      state.insertResult = null;
      state.errorInsert  = null;
    },
    removeOrganism(state, action) {
      state.organisms = state.organisms.filter(o => o.id !== action.payload);
    },
    addOrganismLocal(state, action) {
      state.organisms = [...state.organisms, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchOrganisms
      .addCase(fetchOrganisms.pending,  (state) => { state.loadingFetch = true;  state.errorFetch = null; })
      .addCase(fetchOrganisms.fulfilled,(state, action) => {
        state.loadingFetch = false;
        state.organisms    = action.payload;
      })
      .addCase(fetchOrganisms.rejected, (state, action) => {
        state.loadingFetch = false;
        state.errorFetch   = action.payload || action.error.message;
      })
      // insertOrganism
      .addCase(insertOrganism.pending,  (state) => { state.loadingInsert = true;  state.errorInsert = null; })
      .addCase(insertOrganism.fulfilled,(state, action) => {
        state.loadingInsert = false;
        state.insertResult  = action.payload;
      })
      .addCase(insertOrganism.rejected, (state, action) => {
        state.loadingInsert = false;
        state.errorInsert   = action.payload || action.error.message;
      });
  },
});

export const { clearInsertResult, removeOrganism, addOrganismLocal } = bioSlice.actions;
export default bioSlice.reducer;
