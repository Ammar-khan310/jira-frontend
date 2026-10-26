import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Workspace {
  id: number;
  name: string;
  role: string;
}

interface WorkspaceState {
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  loading: boolean;
}

const initialState: WorkspaceState = {
  workspaces: [],
  selectedWorkspace: null,
  loading: false,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaces: (state, action: PayloadAction<Workspace[]>) => {
      state.workspaces = action.payload;

      // Keep the selected workspace if it still exists
      const selected = state.workspaces.find(
        (workspace) => workspace.id === state.selectedWorkspace?.id,
      );

      state.selectedWorkspace = selected ?? state.workspaces[0] ?? null;
    },

    setSelectedWorkspace: (state, action: PayloadAction<Workspace>) => {
      state.selectedWorkspace = action.payload;
    },

    setWorkspaceLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    clearWorkspaces: (state) => {
      state.workspaces = [];
      state.selectedWorkspace = null;
      state.loading = false;
    },
  },
});

export const {
  setWorkspaces,
  setSelectedWorkspace,
  setWorkspaceLoading,
  clearWorkspaces,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
