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

import FormProvider, {
  RHFCheckbox,
  RHFInput,
  RHFTextarea,
} from "@/common/components/hook-form";
import useMediaQuery from "@/common/hooks/useMediaQuery";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import {
  TOILET_DESC_MAX_LEN,
  TOILET_NAME_MAX_LEN,
} from "@/features/ToiletMap/constants/ToiletValues";
import { toiletSchema } from "@/features/ToiletMap/schema/ToiletSchema";

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

  const defaultValues = {
    name: "",
    // latitude: null,
    // longitude: null,
    description: "",
    // genderTypes: [],
    hasHandicap: false,
    // bidetTypes: [],
    isPaid: false,
    // updatedBy: ""
  };

  const methods = useForm({
    resolver: yupResolver(toiletSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
  });

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
                Know a loo we don't? Add it to the map!
              </DialogDescription>
            </DialogHeader>
            <FormProvider methods={methods} onSubmit={onSubmit}>
              <div className="grid m-4">
                <RHFInput
                  type="text"
                  name="name"
                  label="Name"
                  placeholder="Name"
                  maxLength={TOILET_NAME_MAX_LEN}
                  required
                />
                <RHFTextarea
                  name="description"
                  label="Description"
                  placeholder="Description"
                  className="field-sizing-fixed"
                  maxLength={TOILET_DESC_MAX_LEN}
                  rows={4}
                  required
                />
                <RHFCheckbox
                  name="hasHandicap"
                  label="Has accessible toilet"
                  required
                />
                <RHFCheckbox name="isPaid" label="Requires payment" required />
                <DialogClose asChild>
                  <Button onClick={handleSelectLocation}>
                    Edit Map Location
                  </Button>
                </DialogClose>
              </div>
              <div className="flex flex-row justify-end gap-2">
                <DialogClose asChild>
                  <Button variant="outline" onClick={handleCancelToilet}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Submit</Button>
              </div>
            </FormProvider>
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
              <Button type="submit">Submit</Button>
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
