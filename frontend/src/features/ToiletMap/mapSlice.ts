import { createSlice } from "@reduxjs/toolkit";

import { Toilet } from "./types/Toilet.types";

interface MapState {
  toiletPosition: { lat: number; lng: number } | null; // LatLng is non-serializable
  selectedToilet: Toilet | null;
  isSelectingToiletLocation: boolean;
  openAddToiletDialog: boolean;
  openEditToiletDialog: boolean;
  mode: "add" | "edit";
  openToiletDetails: boolean;
}

const initialState: MapState = {
  toiletPosition: null,
  selectedToilet: null,
  isSelectingToiletLocation: false,
  openAddToiletDialog: false,
  openEditToiletDialog: false,
  mode: "add",
  openToiletDetails: false,
};

export const mapSlice = createSlice({
  name: "map",
  initialState,
  selectors: {
    selectToiletPosition: (state) => state.toiletPosition,
    selectSelectedToilet: (state) => state.selectedToilet,
    selectIsSelectingToiletLocation: (state) => state.isSelectingToiletLocation,
    selectOpenAddToiletDialog: (state) => state.openAddToiletDialog,
    selectOpenEditToiletDialog: (state) => state.openEditToiletDialog,
    selectMode: (state) => state.mode,
    selectOpenToiletDetails: (state) => state.openToiletDetails,
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
    setOpenAddToiletDialog: (state, action) => {
      state.openAddToiletDialog = action.payload;
    },
    setOpenEditToiletDialog: (state, action) => {
      state.openEditToiletDialog = action.payload;
    },
    setAddMode: (state) => {
      state.mode = "add";
    },
    setEditMode: (state) => {
      state.mode = "edit";
    },
    setOpenToiletDetails: (state, action) => {
      state.openToiletDetails = action.payload;
    },
  },
});

export const {
  setToiletPosition,
  resetToiletPosition,
  setSelectedToilet,
  enableSelectToiletLocation,
  disableSelectToiletLocation,
  setOpenAddToiletDialog,
  setOpenEditToiletDialog,
  setAddMode,
  setEditMode,
  setOpenToiletDetails,
} = mapSlice.actions;
export default mapSlice.reducer;

export const {
  selectToiletPosition,
  selectSelectedToilet,
  selectIsSelectingToiletLocation,
  selectOpenAddToiletDialog,
  selectOpenEditToiletDialog,
  selectMode,
  selectOpenToiletDetails,
} = mapSlice.selectors;
