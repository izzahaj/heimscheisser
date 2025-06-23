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
import { useFormContext } from "react-hook-form";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { DEFAULT_TOILET_VALUES } from "../../constants/toiletValues";
import {
  disableSelectToiletLocation,
  selectIsSelectingToiletLocation,
  selectMode,
  selectToiletPosition,
  setAddMode,
  setOpenAddToiletDialog,
  setOpenEditToiletDialog,
  setToiletPosition,
} from "../../mapSlice";

type ToolbarProps = {
  map: Map | null;
  myPosition: LatLng | null;
  setMyPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
};

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { map, myPosition, setMyPosition } = props;

  const [isLocating, setIsLocating] = useState(false);
  const isSelectingToiletLocation = useAppSelector(
    selectIsSelectingToiletLocation,
  );
  const mode = useAppSelector(selectMode);
  const addToiletPosition = useAppSelector(selectToiletPosition);
  const dispatch = useAppDispatch();

  const { watch, setValue, reset } = useFormContext();

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
      reset(DEFAULT_TOILET_VALUES);
      dispatch(setAddMode());
      const center = map.getCenter();
      setValue("latitude", center.lat);
      setValue("longitude", center.lng);
      dispatch(setToiletPosition({ lat: center.lat, lng: center.lng }));
      dispatch(setOpenAddToiletDialog(true));
    }
  };

  const openToiletDialog = () => {
    if (mode === "add") {
      dispatch(setOpenAddToiletDialog(true));
    } else {
      dispatch(setOpenEditToiletDialog(true));
    }
  };

  const handleCancelToiletPin = () => {
    if (map) {
      const position = latLng(watch("latitude")!, watch("longitude")!);
      map.flyTo(position, map.getZoom());
      dispatch(setToiletPosition({ lat: position.lat, lng: position.lng }));

      openToiletDialog();
      dispatch(disableSelectToiletLocation());
    }
  };

  const handleSaveToiletPin = () => {
    if (map) {
      map.flyTo(addToiletPosition!, map.getZoom());
      setValue("latitude", addToiletPosition!.lat);
      setValue("longitude", addToiletPosition!.lng);
      dispatch(
        setToiletPosition({
          lat: addToiletPosition!.lat,
          lng: addToiletPosition!.lng,
        }),
      );

      openToiletDialog();
      dispatch(disableSelectToiletLocation());
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
