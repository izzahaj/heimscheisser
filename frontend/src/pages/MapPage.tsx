import { yupResolver } from "@hookform/resolvers/yup";
import { LatLng, Map as LeafletMap } from "leaflet";
import {
  Loader,
  Loader2Icon,
  Locate,
  LocateFixed,
  MapPinCheck,
  MapPinPlus,
  MapPinX,
  Search,
} from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

import FormProvider, {
  RHFCheckbox,
  RHFInput,
  RHFMultiSelect,
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
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  bidetTypeOptions,
  genderOptions,
  TOILET_DESC_MAX_LEN,
  TOILET_NAME_MAX_LEN,
} from "@/features/ToiletMap/constants/ToiletValues";
import { toiletSchema } from "@/features/ToiletMap/schema/ToiletSchema";
import { cn } from "@/lib/utils";

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
  const [openForm, setOpenForm] = useState(false);
  const isTablet = useMediaQuery("md");
  const skipResetRef = useRef(false);

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

  const {
    watch,
    setValue,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
  });

  const handleTest = () => {
    console.log(errors);
  };

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

  const handleOnOpenChange = (isOpen: boolean) => {
    setOpenForm(isOpen);
    if (!isOpen && !skipResetRef.current) {
      reset(); // reset form if closed not via Edit Map Location
      setAddToiletPosition(null);
    }
    skipResetRef.current = false; // reset the flag after close
  };

  const handleAddToilet = () => {
    if (map) {
      const center = map.getCenter();
      setValue("latitude", center.lat);
      setValue("longitude", center.lng);
      setAddToiletPosition(center);
      setOpenForm(true);
    }
  };

  const handleSelectLocation = () => {
    skipResetRef.current = true;
    if (map) {
      setIsSelectingToiletLocation(true);
      const position = new LatLng(watch("latitude")!, watch("longitude")!);
      setAddToiletPosition(position);
      map.flyTo(position, map.getZoom());
    }
  };

  const handleCancelToiletPin = () => {
    if (map) {
      const position = new LatLng(watch("latitude")!, watch("longitude")!);
      map.flyTo(position, map.getZoom());
      setAddToiletPosition(position);
      setOpenForm(true);
      setIsSelectingToiletLocation(false);
    }
  };

  const handleSaveToiletPin = () => {
    if (map) {
      map.flyTo(addToiletPosition!, map.getZoom());
      setValue("latitude", addToiletPosition!.lat);
      setValue("longitude", addToiletPosition!.lng);
      setAddToiletPosition(addToiletPosition);
      setOpenForm(true);
      setIsSelectingToiletLocation(false);
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
        <Dialog open={openForm} onOpenChange={handleOnOpenChange}>
          <DialogContent className="max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Add Toilet</DialogTitle>
              <DialogDescription>
                Know a loo we don't? Add it to the map!
              </DialogDescription>
            </DialogHeader>
            <FormProvider
              methods={methods}
              onSubmit={onSubmit}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="flex flex-col m-1 px-4 py-1 overflow-auto gap-5">
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
                  helperText="Provide more specifics e.g. floor number, next to a landmark, etc."
                />
                <DialogClose asChild>
                  <Button onClick={handleSelectLocation}>
                    Edit Map Location
                  </Button>
                </DialogClose>
                <RHFMultiSelect
                  name="genders"
                  label="Genders"
                  options={genderOptions}
                  placeholder="Select genders"
                  variant="inverted"
                  required
                />
                <RHFCheckbox
                  name="hasHandicap"
                  label="Has accessible toilet"
                  required
                />
                <RHFCheckbox name="isPaid" label="Requires payment" required />
                <RHFCheckbox name="hasBidet" label="Has bidet" required />
                {watch("hasBidet") && (
                  <RHFMultiSelect
                    name="bidetTypes"
                    label="Bidet Types"
                    options={bidetTypeOptions}
                    placeholder="Select bidet types"
                    variant="inverted"
                  />
                )}
              </div>
              <div className="flex flex-row justify-end gap-2 p-1">
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  type="submit"
                  onClick={handleTest}
                  className="flex flex-row gap-2 items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader className="h-5 w-5 animate-spin" />}
                  Submit
                </Button>
              </div>
            </FormProvider>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={openForm} onOpenChange={handleOnOpenChange}>
          <DrawerContent
            className={cn(
              "overflow-hidden flex flex-col p-1 data-[vaul-drawer-direction=bottom]:max-h-[100vh]",
            )}
          >
            <DrawerHeader>
              <DrawerTitle>Add Toilet</DrawerTitle>
              <DrawerDescription>
                Know a loo we don't? Add it to the map!
              </DrawerDescription>
            </DrawerHeader>
            <FormProvider
              methods={methods}
              onSubmit={onSubmit}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <div className="flex flex-col m-1 px-4 py-1 overflow-auto gap-5 ">
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
                  helperText="Provide more specifics e.g. floor number, next to a landmark, etc."
                />
                <DrawerClose asChild>
                  <Button onClick={handleSelectLocation}>
                    Edit Map Location
                  </Button>
                </DrawerClose>
                <RHFMultiSelect
                  name="genders"
                  label="Genders"
                  options={genderOptions}
                  placeholder="Select genders"
                  variant="inverted"
                  required
                />
                <RHFCheckbox
                  name="hasHandicap"
                  label="Has accessible toilet"
                  required
                />
                <RHFCheckbox name="isPaid" label="Requires payment" required />
                <RHFCheckbox name="hasBidet" label="Has bidet" required />
                {watch("hasBidet") && (
                  <RHFMultiSelect
                    name="bidetTypes"
                    label="Bidet Types"
                    options={bidetTypeOptions}
                    placeholder="Select bidet types"
                    variant="inverted"
                  />
                )}
              </div>
              <div className="flex flex-row justify-around gap-2 p-1">
                <DrawerClose asChild className="flex-1">
                  <Button variant="outline">Cancel</Button>
                </DrawerClose>
                <Button
                  type="submit"
                  onClick={handleTest}
                  className="flex-1 flex flex-row gap-2 items-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting && <Loader className="h-5 w-5 animate-spin" />}
                  Submit
                </Button>
              </div>
            </FormProvider>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default MapPage;
