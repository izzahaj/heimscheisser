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

import useMediaQuery from "@/common/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Map } from "../features/ToiletMap/components/Map";

const MapPage = () => {
  const [map, setMap] = useState<LeafletMap | null>(null);
  const [myPosition, setMyPosition] = useState<LatLng | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [defaultToiletPosition, setDefaultToiletPosition] =
    useState<LatLng | null>(null); // the toilet position upon opening form
  const [addToiletPosition, setAddToiletPosition] = useState<LatLng | null>(
    null,
  );
  const [isSelectingToiletLocation, setIsSelectingToiletLocation] =
    useState(false);
  const [openForm, setOpenForm] = useState(false);
  const isTablet = useMediaQuery("md");

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

  const handleAddToilet = () => {
    if (map) {
      const center = map.getCenter();
      setDefaultToiletPosition(center);
      setAddToiletPosition(center);
      setOpenForm(true);
    }
  };

  const handleCancelToilet = () => {
    setAddToiletPosition(null);
    setIsSelectingToiletLocation(false);
  };

  const handleSelectLocation = () => {
    if (map) {
      setIsSelectingToiletLocation(true);
      setAddToiletPosition(defaultToiletPosition);
      map.flyTo(defaultToiletPosition!, map.getZoom());
    }
  };

  const handleCancelToiletPin = () => {
    if (map) {
      setIsSelectingToiletLocation(false);
      map.flyTo(defaultToiletPosition!, map.getZoom());
      setAddToiletPosition(defaultToiletPosition);
      setOpenForm(true);
    }
  };

  const handleSaveToiletPin = () => {
    if (map) {
      setIsSelectingToiletLocation(false);
      map.flyTo(addToiletPosition!, map.getZoom());
      setDefaultToiletPosition(addToiletPosition);
      setAddToiletPosition(addToiletPosition);
      setOpenForm(true);
    }
  };

  return (
    <>
      <Map
        setMap={setMap}
        myPosition={myPosition}
        setAddToiletPosition={setAddToiletPosition}
        addToiletPosition={addToiletPosition}
        isActive={isSelectingToiletLocation}
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
      {isTablet ? (
        <Dialog open={openForm} onOpenChange={setOpenForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Toilet</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="grid m-4">
              <DialogClose asChild>
                <Button onClick={handleSelectLocation}>
                  Edit Map Location
                </Button>
              </DialogClose>
            </div>
            <DialogFooter>
              <Button>Submit</Button>
              <DialogClose asChild>
                <Button variant="outline" onClick={handleCancelToilet}>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={openForm} onOpenChange={setOpenForm}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Add Toilet</DrawerTitle>
              <DrawerDescription>
                This action cannot be undone.
              </DrawerDescription>
            </DrawerHeader>
            <div className="grid m-4">
              <DrawerClose asChild>
                <Button onClick={handleSelectLocation}>
                  Edit Map Location
                </Button>
              </DrawerClose>
            </div>
            <DrawerFooter>
              <Button>Submit</Button>
              <DrawerClose asChild>
                <Button variant="outline" onClick={handleCancelToilet}>
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default MapPage;
