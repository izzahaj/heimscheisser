import axios from "axios";
import { LatLng, Map } from "leaflet";
import { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";

import FormProvider from "@/common/components/hook-form";
import useMediaQuery from "@/common/hooks/useMediaQuery";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { TOILET_SVC_URI } from "@/config/uris";
import { cn } from "@/lib/utils";

import { BidetType, Gender } from "../../constants/toiletValues";
import AddToiletForm from "./AddToiletForm";

type AddToiletDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  map: Map | null;
  setToiletPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
  setIsSelectingToiletLocation: React.Dispatch<React.SetStateAction<boolean>>;
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
};

const AddToiletDialog: React.FC<AddToiletDialogProps> = (props) => {
  const {
    open,
    setOpen,
    map,
    setToiletPosition,
    setIsSelectingToiletLocation,
    methods,
  } = props;
  const skipResetRef = useRef(false);
  const isTablet = useMediaQuery("md");

  const { watch, handleSubmit, reset } = methods;

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen && !skipResetRef.current) {
      reset(); // reset form if closed not via Edit Map Location
      setToiletPosition(null);
    }
    skipResetRef.current = false; // reset the flag after close
  };

  const handleSelectLocation = () => {
    skipResetRef.current = true;
    if (map) {
      setIsSelectingToiletLocation(true);
      const position = new LatLng(watch("latitude")!, watch("longitude")!);
      setToiletPosition(position);
      map.flyTo(position, map.getZoom());
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    if (!data.hasBidet) {
      data.bidetTypes = [];
    }

    const url = TOILET_SVC_URI;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.post(url, data, config);
      // TODO: Add new toilet marker
      console.log(response);
      toast.success("Toilet added successfully!");
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again later.");
    }
  });

  return (
    <>
      {isTablet ? (
        <Dialog open={open} onOpenChange={handleOpen}>
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
              <AddToiletForm
                handleClose={() => setOpen(false)}
                handleSelectLocation={handleSelectLocation}
              />
            </FormProvider>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={handleOpen}>
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
              <AddToiletForm
                handleClose={() => setOpen(false)}
                handleSelectLocation={handleSelectLocation}
              />
            </FormProvider>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default AddToiletDialog;
