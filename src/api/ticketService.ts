import api from "./axios";

interface CreateTicketData {
  title: string;
  description: string;
  assignedToId: number;
}

interface UpdateTicketData {
  title: string;
  description: string;
}

interface UpdateStatusData {
  status: string;
}

export const getAllTickets = async () => {
  const response = await api.get("/tickets");
  return response.data;
};

export const getTicketById = async (id: number) => {
  const response = await api.get(`/tickets/${id}`);
  return response.data;
};

export const createTicket = async (data: CreateTicketData) => {
  const response = await api.post("/tickets", data);
  return response.data;
};

export const editTicket = async (id: number, data: UpdateTicketData) => {
  const response = await api.put(`/tickets/${id}`, data);
  return response.data;
};

export const updateTicketStatus = async (
  id: number,
  data: UpdateStatusData,
) => {
  const response = await api.patch(`/tickets/${id}/status`, data);
  return response.data;
};

export const deleteTicket = async (id: number) => {
  const response = await api.delete(`/tickets/${id}`);
  return response.data;
};
