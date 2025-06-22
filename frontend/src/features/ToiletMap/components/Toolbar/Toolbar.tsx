import { LatLng, latLng, Map } from "leaflet";
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
import { UseFormReturn } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { BidetType, Gender } from "../../constants/toiletValues";

type ToolbarProps = {
  map: Map | null;
  myPosition: LatLng | null;
  setMyPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
  isSelectingToiletLocation: boolean;
  setIsSelectingToiletLocation: React.Dispatch<React.SetStateAction<boolean>>;
  addToiletPosition: LatLng | null;
  setAddToiletPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
  setOpenAddToiletDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setOpenEditToiletDialog: React.Dispatch<React.SetStateAction<boolean>>;
  methods: UseFormReturn<
    {
      name: string;
      latitude: number | null;
      longitude: number | null;
      description: string | undefined;
      genders: (Gender | undefined)[];
      hasHandicap: boolean;
      hasBidet: boolean;
      bidetTypes: (BidetType | undefined)[] | undefined;
      isPaid: NonNullable<boolean>;
    },
    unknown,
    {
      description?: string | undefined;
      bidetTypes?: (BidetType | undefined)[] | undefined;
      name: string;
      latitude: number | null;
      longitude: number | null;
      genders: (Gender | undefined)[];
      hasHandicap: boolean;
      hasBidet: NonNullable<boolean>;
      isPaid: NonNullable<boolean>;
    }
  >;
  mode: "add" | "edit";
  setMode: React.Dispatch<React.SetStateAction<"add" | "edit">>;
};

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const {
    map,
    myPosition,
    setMyPosition,
    isSelectingToiletLocation,
    setIsSelectingToiletLocation,
    addToiletPosition,
    setAddToiletPosition,
    setOpenAddToiletDialog,
    setOpenEditToiletDialog,
    methods,
    mode,
    setMode,
  } = props;

  const [isLocating, setIsLocating] = useState(false);
  const { watch, setValue } = methods;

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
          console.error(err);
          setIsLocating(false);
        });
    }
  };

  const handleAddToilet = () => {
    if (map) {
      setMode("add");
      const center = map.getCenter();
      setValue("latitude", center.lat);
      setValue("longitude", center.lng);
      setAddToiletPosition(center);
      setOpenAddToiletDialog(true);
    }
  };

  const handleCancelToiletPin = () => {
    if (map) {
      const position = latLng(watch("latitude")!, watch("longitude")!);
      map.flyTo(position, map.getZoom());
      setAddToiletPosition(position);

      if (mode === "add") {
        setOpenAddToiletDialog(true);
      } else {
        setOpenEditToiletDialog(true);
      }

      setIsSelectingToiletLocation(false);
    }
  };

  const handleSaveToiletPin = () => {
    if (map) {
      map.flyTo(addToiletPosition!, map.getZoom());
      setValue("latitude", addToiletPosition!.lat);
      setValue("longitude", addToiletPosition!.lng);
      setAddToiletPosition(addToiletPosition);

      if (mode === "add") {
        setOpenAddToiletDialog(true);
      } else {
        setOpenEditToiletDialog(true);
      }

      setIsSelectingToiletLocation(false);
    }
  };

  return (
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
  );
};

export default Toolbar;
