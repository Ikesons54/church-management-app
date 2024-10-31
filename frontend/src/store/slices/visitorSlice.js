import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { message } from 'antd';

// Async Thunks
export const fetchVisitors = createAsyncThunk(
  'visitors/fetchVisitors',
  async (filters) => {
    const response = await fetch('/api/visitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filters)
    });
    return response.json();
  }
);

export const addVisitor = createAsyncThunk(
  'visitors/addVisitor',
  async (visitorData) => {
    const response = await fetch('/api/visitors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visitorData)
    });
    return response.json();
  }
);

export const updateVisitor = createAsyncThunk(
  'visitors/updateVisitor',
  async ({ id, data }) => {
    const response = await fetch(`/api/visitors/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
);

export const recordFollowUp = createAsyncThunk(
  'visitors/recordFollowUp',
  async ({ visitorId, followUpData }) => {
    const response = await fetch(`/api/visitors/${visitorId}/follow-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(followUpData)
    });
    return response.json();
  }
);

export const completeFollowUp = createAsyncThunk(
  'visitors/completeFollowUp',
  async (followUpId) => {
    const response = await fetch(`/api/follow-ups/${followUpId}/complete`, {
      method: 'PUT'
    });
    if (!response.ok) throw new Error('Failed to complete follow-up');
    return await response.json();
  }
);

export const updateFollowUp = createAsyncThunk(
  'visitors/updateFollowUp',
  async ({ id, data }) => {
    const response = await fetch(`/api/follow-ups/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update follow-up');
    return await response.json();
  }
);

export const createFollowUp = createAsyncThunk(
  'visitors/createFollowUp',
  async (data) => {
    const response = await fetch('/api/follow-ups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create follow-up');
    return await response.json();
  }
);

const visitorSlice = createSlice({
  name: 'visitors',
  initialState: {
    visitors: [],
    stats: {
      total: 0,
      followedUp: 0,
      converted: 0,
      pending: 0,
      weeklyGrowth: 0
    },
    loading: false,
    error: null,
    selectedVisitor: null,
    filters: {
      dateRange: null,
      status: 'all'
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    setSelectedVisitor: (state, action) => {
      state.selectedVisitor = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Visitors
      .addCase(fetchVisitors.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchVisitors.fulfilled, (state, action) => {
        state.loading = false;
        state.visitors = action.payload.visitors;
        state.stats = action.payload.stats;
      })
      .addCase(fetchVisitors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        message.error('Failed to fetch visitors');
      })
      // Add Visitor
      .addCase(addVisitor.fulfilled, (state, action) => {
        state.visitors.unshift(action.payload);
        state.stats.total += 1;
        message.success('Visitor added successfully');
      })
      // Update Visitor
      .addCase(updateVisitor.fulfilled, (state, action) => {
        const index = state.visitors.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.visitors[index] = action.payload;
        }
        message.success('Visitor updated successfully');
      })
      // Record Follow-up
      .addCase(recordFollowUp.fulfilled, (state, action) => {
        const index = state.visitors.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.visitors[index] = action.payload;
          state.stats.followedUp += 1;
          state.stats.pending -= 1;
        }
        message.success('Follow-up recorded successfully');
      })
      .addCase(completeFollowUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(completeFollowUp.fulfilled, (state, action) => {
        state.loading = false;
        state.followUps = state.followUps.map(followUp =>
          followUp.id === action.payload.id ? action.payload : followUp
        );
      })
      .addCase(completeFollowUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateFollowUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFollowUp.fulfilled, (state, action) => {
        state.loading = false;
        state.followUps = state.followUps.map(followUp =>
          followUp.id === action.payload.id ? action.payload : followUp
        );
      })
      .addCase(updateFollowUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createFollowUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFollowUp.fulfilled, (state, action) => {
        state.loading = false;
        state.followUps.unshift(action.payload);
      })
      .addCase(createFollowUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { setFilters, setSelectedVisitor, clearError } = visitorSlice.actions;
export default visitorSlice.reducer; 