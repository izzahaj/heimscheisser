import { yupResolver } from "@hookform/resolvers/yup";
import { LatLng, Map as LeafletMap } from "leaflet";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { ToiletDetails } from "@/features/ToiletMap/components/ToiletDetails";
import {
  AddToiletDialog,
  EditToiletDialog,
} from "@/features/ToiletMap/components/ToiletDialog";
import { Toolbar } from "@/features/ToiletMap/components/Toolbar";
import { toiletSchema } from "@/features/ToiletMap/schema/toiletSchema";
import { Toilet } from "@/features/ToiletMap/types/Toilet.types";

import { Map } from "../features/ToiletMap/components/Map";

const MapPage = () => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [myPosition, setMyPosition] = useState<LatLng | null>(null);
  const [addToiletPosition, setAddToiletPosition] = useState<LatLng | null>(
    null,
  );
  const [isSelectingToiletLocation, setIsSelectingToiletLocation] =
    useState(false);
  const [openAddToiletDialog, setOpenAddToiletDialog] = useState(false);
  const [toilet, setToilet] = useState<Toilet | null>(null);
  const [openToiletDetails, setOpenToiletDetails] = useState(false);
  const [openEditToiletDialog, setOpenEditToiletDialog] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");

  const defaultValues = {
    name: "",
    latitude: null,
    longitude: null,
    description: "",
    genders: [],
    hasHandicap: false,
    hasBidet: false,
    bidetTypes: [],
    isPaid: false,
  };

  const methods = useForm({
    resolver: yupResolver(toiletSchema),
    defaultValues,
  });

  const defaultEditValues = useMemo(
    () => ({
      name: toilet?.name || "",
      latitude: toilet?.latitude || null,
      longitude: toilet?.longitude || null,
      description: toilet?.description || "",
      genders: toilet?.genders || [],
      hasHandicap: toilet?.hasHandicap || false,
      hasBidet: toilet?.hasBidet || false,
      bidetTypes: toilet?.bidetTypes || [],
      isPaid: toilet?.hasBidet || false,
    }),
    [toilet],
  );

  const editMethods = useForm({
    resolver: yupResolver(toiletSchema),
    defaultValues: defaultEditValues,
  });

  const { reset } = editMethods;

  return (
    <>
      <Map
        setMap={setMap}
        map={map}
        myPosition={myPosition}
        setAddToiletPosition={setAddToiletPosition}
        addToiletPosition={addToiletPosition}
        isActive={isSelectingToiletLocation}
        setSelectedToilet={setToilet}
        selectedToilet={toilet}
        setOpenDetails={setOpenToiletDetails}
      />
      <Toolbar
        map={map}
        myPosition={myPosition}
        setMyPosition={setMyPosition}
        isSelectingToiletLocation={isSelectingToiletLocation}
        setIsSelectingToiletLocation={setIsSelectingToiletLocation}
        addToiletPosition={addToiletPosition}
        setAddToiletPosition={setAddToiletPosition}
        setOpenAddToiletDialog={setOpenAddToiletDialog}
        setOpenEditToiletDialog={setOpenEditToiletDialog}
        methods={mode === "add" ? methods : editMethods}
        mode={mode}
        setMode={setMode}
      />
      <AddToiletDialog
        open={openAddToiletDialog}
        setOpen={setOpenAddToiletDialog}
        map={map}
        setToiletPosition={setAddToiletPosition}
        setIsSelectingToiletLocation={setIsSelectingToiletLocation}
        methods={methods}
      />
      <EditToiletDialog
        toilet={toilet}
        open={openEditToiletDialog}
        setOpen={setOpenEditToiletDialog}
        map={map}
        setToiletPosition={setAddToiletPosition}
        setIsSelectingToiletLocation={setIsSelectingToiletLocation}
        methods={editMethods}
        setOpenToiletDetails={setOpenToiletDetails}
        defaultValues={defaultEditValues}
      />
      <ToiletDetails
        open={openToiletDetails}
        setOpen={setOpenToiletDetails}
        toilet={toilet}
        setOpenEditDialog={setOpenEditToiletDialog}
        resetEditForm={reset}
        defaultValues={defaultEditValues}
        setMode={setMode}
      />
    </>
  );
};

export default MapPage;
