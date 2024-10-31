import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (filters = {}) => {
    const { data } = await axios.get('/api/events', { params: filters });
    return data.data;
  }
);

export const createEvent = createAsyncThunk(
  'events/createEvent',
  async (eventData) => {
    const { data } = await axios.post('/api/events', eventData);
    return data.data;
  }
);

export const updateEvent = createAsyncThunk(
  'events/updateEvent',
  async ({ id, updates }) => {
    const { data } = await axios.put(`/api/events/${id}`, updates);
    return data.data;
  }
);

export const deleteEvent = createAsyncThunk(
  'events/deleteEvent',
  async (id) => {
    await axios.delete(`/api/events/${id}`);
    return id;
  }
);

const eventSlice = createSlice({
  name: 'events',
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedEvent: null,
    filters: {
      type: null,
      ministry: null,
      startDate: null,
      endDate: null,
      status: null,
      search: ''
    }
  },
  reducers: {
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        type: null,
        ministry: null,
        startDate: null,
        endDate: null,
        status: null,
        search: ''
      };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Handle other async actions similarly
  }
});

export const { setSelectedEvent, setFilters, clearFilters } = eventSlice.actions;
export default eventSlice.reducer; 