import { yupResolver } from "@hookform/resolvers/yup";
import { LatLng, Map as LeafletMap } from "leaflet";
import {
  Loader2Icon,
  Locate,
  LocateFixed,
  MapPinCheck,
  MapPinPlus,
  MapPinX,
  Search,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AddToiletDialog from "@/features/ToiletMap/components/AddToilet/AddToiletDialog";
import { ToiletDetails } from "@/features/ToiletMap/components/ToiletDetails";
import { toiletSchema } from "@/features/ToiletMap/schema/toiletSchema";
import { Toilet } from "@/features/ToiletMap/types/Toilet.types";

import { Map } from "../features/ToiletMap/components/Map";

const MapPage = () => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [myPosition, setMyPosition] = useState<LatLng | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [addToiletPosition, setAddToiletPosition] = useState<LatLng | null>(
    null,
  );
  const [isSelectingToiletLocation, setIsSelectingToiletLocation] =
    useState(false);
  const [openAddToiletDialog, setOpenAddToiletDialog] = useState(false);
  const [toilet, setToilet] = useState<Toilet | null>(null);
  const [openToiletDetails, setOpenToiletDetails] = useState(false);

  const handleFindMyLocation = () => {
    if (map) {
      setIsLocating(true);

      map
        .locate()
        .on("locationfound", (e) => {
          setMyPosition(e.latlng);
          map.flyTo(e.latlng, map.getZoom());
          setIsLocating(false);
        })
        .on("locationerror", (err) => {
          // TODO: handle error in location (e.g. show a snackbar)
          console.log(err);
          setIsLocating(false);
        });
    }
  };

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

  const { watch, setValue } = methods;

  const handleAddToilet = () => {
    if (map) {
      const center = map.getCenter();
      setValue("latitude", center.lat);
      setValue("longitude", center.lng);
      setAddToiletPosition(center);
      setOpenAddToiletDialog(true);
    }
  };

  const handleCancelToiletPin = () => {
    if (map) {
      const position = new LatLng(watch("latitude")!, watch("longitude")!);
      map.flyTo(position, map.getZoom());
      setAddToiletPosition(position);
      setOpenAddToiletDialog(true);
      setIsSelectingToiletLocation(false);
    }
  };

  const handleSaveToiletPin = () => {
    if (map) {
      map.flyTo(addToiletPosition!, map.getZoom());
      setValue("latitude", addToiletPosition!.lat);
      setValue("longitude", addToiletPosition!.lng);
      setAddToiletPosition(addToiletPosition);
      setOpenAddToiletDialog(true);
      setIsSelectingToiletLocation(false);
    }
  };

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
      <div className="fixed right-3 bottom-5 flex flex-col gap-y-1 z-600">
        {!isSelectingToiletLocation && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" className="size-9" onClick={handleAddToilet}>
                <MapPinPlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" className="z-600">
              <p>Add Toilet</p>
            </TooltipContent>
          </Tooltip>
        )}
        {isSelectingToiletLocation && (
          <>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="size-9"
                  variant="outline"
                  onClick={handleCancelToiletPin}
                >
                  <MapPinX />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="z-600">
                <p>Cancel Pin</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="icon"
                  className="size-9"
                  onClick={handleSaveToiletPin}
                >
                  <MapPinCheck />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left" className="z-600">
                <p>Save Pin</p>
              </TooltipContent>
            </Tooltip>
          </>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="size-9"
              disabled={isLocating}
              onClick={handleFindMyLocation}
            >
              {isLocating ? (
                <Loader2Icon />
              ) : myPosition ? (
                <LocateFixed />
              ) : (
                <Locate />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="z-600">
            <p>Find My Location</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button size="icon" className="size-9">
              <Search />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="z-600">
            <p>Search Map</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <AddToiletDialog
        open={openAddToiletDialog}
        setOpen={setOpenAddToiletDialog}
        map={map}
        setToiletPosition={setAddToiletPosition}
        setIsSelectingToiletLocation={setIsSelectingToiletLocation}
        methods={methods}
      />
      <ToiletDetails
        open={openToiletDetails}
        setOpen={setOpenToiletDetails}
        toilet={toilet}
      />
    </>
  );
};

export default MapPage;
