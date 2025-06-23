import { createSlice } from "@reduxjs/toolkit";

import { Toilet } from "./types/Toilet.types";

interface MapState {
  toiletPosition: { lat: number; lng: number } | null; // LatLng is non-serializable
  selectedToilet: Toilet | null;
  isSelectingToiletLocation: boolean;
  isAddToiletDialogOpen: boolean;
  isEditToiletDialogOpen: boolean;
}

const initialState: MapState = {
  toiletPosition: null,
  selectedToilet: null,
  isSelectingToiletLocation: false,
  isAddToiletDialogOpen: false,
  isEditToiletDialogOpen: false,
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  selectors: {
    selectToiletPosition: (state) => state.toiletPosition,
    selectSelectedToilet: (state) => state.selectedToilet,
    selectIsSelectingToiletLocation: (state) => state.isSelectingToiletLocation,
    selectIsAddToiletDialogOpen: (state) => state.isAddToiletDialogOpen,
    selectIsEditToiletDialogOpen: (state) => state.isEditToiletDialogOpen,
  },
  reducers: {
    setToiletPosition: (state, action) => {
      state.toiletPosition = action.payload;
    },
    resetToiletPosition: (state) => {
      state.toiletPosition = null;
    },
    setSelectedToilet: (state, action) => {
      state.selectedToilet = action.payload;
    },
    enableSelectToiletLocation: (state) => {
      state.isSelectingToiletLocation = true;
    },
    disableSelectToiletLocation: (state) => {
      state.isSelectingToiletLocation = false;
    },
    openAddToiletDialog: (state) => {
      state.isAddToiletDialogOpen = true;
    },
    closeAddToiletDialog: (state) => {
      state.isAddToiletDialogOpen = false;
    },
    setIsAddToiletDialogOpen: (state, action) => {
      state.isAddToiletDialogOpen = action.payload;
    },
    openEditToiletDialog: (state) => {
      state.isEditToiletDialogOpen = true;
    },
    closeEditToiletDialog: (state) => {
      state.isEditToiletDialogOpen = false;
    },
    setIsEditToiletDialogOpen: (state, action) => {
      state.isEditToiletDialogOpen = action.payload;
    },
  },
});

export const {
  setToiletPosition,
  resetToiletPosition,
  setSelectedToilet,
  enableSelectToiletLocation,
  disableSelectToiletLocation,
  openAddToiletDialog,
  closeAddToiletDialog,
  setIsAddToiletDialogOpen,
  openEditToiletDialog,
  closeEditToiletDialog,
  setIsEditToiletDialogOpen,
} = mapSlice.actions;
export default mapSlice.reducer;

export const {
  selectToiletPosition,
  selectSelectedToilet,
  selectIsSelectingToiletLocation,
  selectIsAddToiletDialogOpen,
  selectIsEditToiletDialogOpen,
} = mapSlice.selectors;
