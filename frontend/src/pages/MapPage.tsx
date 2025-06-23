import { yupResolver } from "@hookform/resolvers/yup";
import { LatLng, Map as LeafletMap } from "leaflet";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { useAppSelector } from "@/app/hooks";
import { Form } from "@/components/ui/form";
import { ToiletDetails } from "@/features/ToiletMap/components/ToiletDetails";
import {
  AddToiletDialog,
  EditToiletDialog,
} from "@/features/ToiletMap/components/ToiletDialog";
import { Toolbar } from "@/features/ToiletMap/components/Toolbar";
import { DEFAULT_TOILET_VALUES } from "@/features/ToiletMap/constants/toiletValues";
import { selectSelectedToilet } from "@/features/ToiletMap/mapSlice";
import { toiletSchema } from "@/features/ToiletMap/schema/toiletSchema";

import { Map } from "../features/ToiletMap/components/Map";

const MapPage = () => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [myPosition, setMyPosition] = useState<LatLng | null>(null);
  const toilet = useAppSelector(selectSelectedToilet);

  const defaultEditValues = useMemo(
    () => ({
      name: toilet?.name || DEFAULT_TOILET_VALUES.name,
      latitude: toilet?.latitude || DEFAULT_TOILET_VALUES.latitude,
      longitude: toilet?.longitude || DEFAULT_TOILET_VALUES.longitude,
      description: toilet?.description || DEFAULT_TOILET_VALUES.description,
      genders: toilet?.genders || DEFAULT_TOILET_VALUES.genders,
      hasHandicap: toilet?.hasHandicap || DEFAULT_TOILET_VALUES.hasHandicap,
      hasBidet: toilet?.hasBidet || DEFAULT_TOILET_VALUES.hasBidet,
      bidetTypes: toilet?.bidetTypes || DEFAULT_TOILET_VALUES.bidetTypes,
      isPaid: toilet?.isPaid || DEFAULT_TOILET_VALUES.isPaid,
    }),
    [toilet],
  );

  const methods = useForm({
    resolver: yupResolver(toiletSchema),
    defaultValues: DEFAULT_TOILET_VALUES,
  });

  return (
    <>
      <Map setMap={setMap} map={map} myPosition={myPosition} />
      <Form {...methods}>
        <Toolbar
          map={map}
          myPosition={myPosition}
          setMyPosition={setMyPosition}
        />
        <AddToiletDialog map={map} />
        <EditToiletDialog map={map} defaultValues={defaultEditValues} />
        <ToiletDetails defaultValues={defaultEditValues} />
      </Form>
    </>
  );
};

export default MapPage;
