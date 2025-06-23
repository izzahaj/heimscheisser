import { yupResolver } from "@hookform/resolvers/yup";
import { LatLng, Map as LeafletMap } from "leaflet";
import { useMemo, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { InferType } from "yup";

import { useAppSelector } from "@/app/hooks";
import { ToiletDetails } from "@/features/ToiletMap/components/ToiletDetails";
import {
  AddToiletDialog,
  EditToiletDialog,
} from "@/features/ToiletMap/components/ToiletDialog";
import { Toolbar } from "@/features/ToiletMap/components/Toolbar";
import { selectSelectedToilet } from "@/features/ToiletMap/mapSlice";
import { toiletSchema } from "@/features/ToiletMap/schema/toiletSchema";

import { Map } from "../features/ToiletMap/components/Map";

const MapPage = () => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [myPosition, setMyPosition] = useState<LatLng | null>(null);
  const [openToiletDetails, setOpenToiletDetails] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const toilet = useAppSelector(selectSelectedToilet);

  const defaultValues = {
    name: "",
    latitude: 0,
    longitude: 0,
    description: "",
    genders: [],
    hasHandicap: false,
    hasBidet: false,
    bidetTypes: [],
    isPaid: false,
  };

  const methods = useForm<InferType<typeof toiletSchema>>({
    resolver: yupResolver(toiletSchema) as Resolver<
      InferType<typeof toiletSchema>
    >,
    defaultValues,
  });

  const defaultEditValues = useMemo(
    () => ({
      name: toilet?.name || "",
      latitude: toilet?.latitude || 0,
      longitude: toilet?.longitude || 0,
      description: toilet?.description || "",
      genders: toilet?.genders || [],
      hasHandicap: toilet?.hasHandicap || false,
      hasBidet: toilet?.hasBidet || false,
      bidetTypes: toilet?.bidetTypes || [],
      isPaid: toilet?.hasBidet || false,
    }),
    [toilet],
  );

  const editMethods = useForm<InferType<typeof toiletSchema>>({
    resolver: yupResolver(toiletSchema) as Resolver<
      InferType<typeof toiletSchema>
    >,
    defaultValues: defaultEditValues,
  });

  return (
    <>
      <Map
        setMap={setMap}
        map={map}
        myPosition={myPosition}
        setOpenDetails={setOpenToiletDetails}
      />
      <Toolbar
        map={map}
        myPosition={myPosition}
        setMyPosition={setMyPosition}
        methods={mode === "add" ? methods : editMethods}
        mode={mode}
        setMode={setMode}
      />
      <AddToiletDialog map={map} methods={methods} />
      <EditToiletDialog
        map={map}
        methods={editMethods}
        setOpenToiletDetails={setOpenToiletDetails}
        defaultValues={defaultEditValues}
      />
      <ToiletDetails
        open={openToiletDetails}
        setOpen={setOpenToiletDetails}
        methods={editMethods}
        defaultValues={defaultEditValues}
        setMode={setMode}
      />
    </>
  );
};

export default MapPage;
