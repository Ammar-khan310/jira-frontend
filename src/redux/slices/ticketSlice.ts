import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { getAllTickets } from "../../api/ticketService";

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  assignedTo?: {
    id: number;
    name: string;
    email: string;
  };
}

interface TicketState {
  tickets: Ticket[];
  loading: boolean;
  error: string | null;
}

const initialState: TicketState = {
  tickets: [],
  loading: false,
  error: null,
};

export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async () => {
    const response = await getAllTickets();
    return response.tickets as Ticket[];
  },
);

const ticketSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    setTickets: (state, action: PayloadAction<Ticket[]>) => {
      state.tickets = action.payload;
    },

    addTicket: (state, action: PayloadAction<Ticket>) => {
      state.tickets.push(action.payload);
    },

    updateTicket: (state, action: PayloadAction<Ticket>) => {
      const index = state.tickets.findIndex(
        (ticket) => ticket.id === action.payload.id,
      );

      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
    },

    removeTicket: (state, action: PayloadAction<number>) => {
      state.tickets = state.tickets.filter(
        (ticket) => ticket.id !== action.payload,
      );
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch tickets";
      });
  },
});

export const { setTickets, addTicket, updateTicket, removeTicket } =
  ticketSlice.actions;

export default ticketSlice.reducer;
