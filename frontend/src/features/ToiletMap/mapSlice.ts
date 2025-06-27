import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Toilet } from "./types/Toilet.types";

interface LatLng {
  lat: number;
  lng: number;
}

interface MapState {
  toiletPosition: LatLng | null; // LatLng is non-serializable
  selectedToilet: Toilet | null;
  isSelectingToiletLocation: boolean;
  openAddToiletDialog: boolean;
  openEditToiletDialog: boolean;
  mode: "add" | "edit";
  openToiletDetails: boolean;
  toilets: Toilet[];
}

const initialState: MapState = {
  toiletPosition: null,
  selectedToilet: null,
  isSelectingToiletLocation: false,
  openAddToiletDialog: false,
  openEditToiletDialog: false,
  mode: "add",
  openToiletDetails: false,
  toilets: [],
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
    selectToilets: (state) => state.toilets,
  },
  reducers: {
    setToiletPosition: (state, action: PayloadAction<LatLng>) => {
      state.toiletPosition = action.payload;
    },
    resetToiletPosition: (state) => {
      state.toiletPosition = null;
    },
    setSelectedToilet: (state, action: PayloadAction<Toilet>) => {
      state.selectedToilet = action.payload;
    },
    resetSelectedToilet: (state) => {
      state.selectedToilet = null;
    },
    enableSelectToiletLocation: (state) => {
      state.isSelectingToiletLocation = true;
    },
    disableSelectToiletLocation: (state) => {
      state.isSelectingToiletLocation = false;
    },
    setOpenAddToiletDialog: (state, action: PayloadAction<boolean>) => {
      state.openAddToiletDialog = action.payload;
    },
    setOpenEditToiletDialog: (state, action: PayloadAction<boolean>) => {
      state.openEditToiletDialog = action.payload;
    },
    setAddMode: (state) => {
      state.mode = "add";
    },
    setEditMode: (state) => {
      state.mode = "edit";
    },
    setOpenToiletDetails: (state, action: PayloadAction<boolean>) => {
      state.openToiletDetails = action.payload;
    },
    addToilets(state, action: PayloadAction<Toilet[]>) {
      const newToilets = action.payload.filter(
        (t) => !state.toilets.some((existing) => existing.id === t.id),
      );
      state.toilets.push(...newToilets);
    },
    addToilet(state, action: PayloadAction<Toilet>) {
      const toilet = action.payload;
      const exists = state.toilets.some((t) => t.id === toilet.id);
      if (!exists) {
        state.toilets.push(toilet);
      }
    },
    updateToilet(state, action: PayloadAction<Toilet>) {
      const index = state.toilets.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.toilets[index] = action.payload;
      }
    },
    removeToilet(state, action: PayloadAction<string>) {
      state.toilets = state.toilets.filter((t) => t.id !== action.payload);
    },
    resetToilets(state) {
      state.toilets = [];
    },
  },
});

export const {
  setToiletPosition,
  resetToiletPosition,
  setSelectedToilet,
  resetSelectedToilet,
  enableSelectToiletLocation,
  disableSelectToiletLocation,
  setOpenAddToiletDialog,
  setOpenEditToiletDialog,
  setAddMode,
  setEditMode,
  setOpenToiletDetails,
  addToilet,
  addToilets,
  updateToilet,
  removeToilet,
  resetToilets,
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
  selectToilets,
} = mapSlice.selectors;
