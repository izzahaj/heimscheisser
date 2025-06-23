import axios from "axios";
import { LatLng, latLng, Map } from "leaflet";
import { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { InferType } from "yup";

import FormProvider from "@/common/components/hook-form";
import useMediaQuery from "@/common/hooks/useMediaQuery";
import { filterChangedFormFields } from "@/common/utils/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { TOILET_SVC_URI } from "@/config/uris";
import { cn } from "@/lib/utils";

import { toiletSchema } from "../../schema/toiletSchema";
import { Toilet } from "../../types/Toilet.types";
import ToiletForm from "./ToiletForm";

type EditToiletDialogProps = {
  toilet: Toilet | null;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  map: Map | null;
  setToiletPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
  setIsSelectingToiletLocation: React.Dispatch<React.SetStateAction<boolean>>;
  methods: UseFormReturn<InferType<typeof toiletSchema>>;
  setOpenToiletDetails: React.Dispatch<React.SetStateAction<boolean>>;
  defaultValues: Omit<Toilet, "id">;
};

const EditToiletDialog: React.FC<EditToiletDialogProps> = (props) => {
  const {
    toilet,
    open,
    setOpen,
    map,
    setToiletPosition,
    setIsSelectingToiletLocation,
    methods,
    setOpenToiletDetails,
    defaultValues,
  } = props;

  const skipResetRef = useRef(false);
  const isTablet = useMediaQuery("md");

  const {
    watch,
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = methods;

  const handleOpen = (isOpen: boolean) => {
    setOpen(isOpen);

    if (!isOpen && !skipResetRef.current) {
      reset(defaultValues); // reset form if closed not via Edit Map Location
      setToiletPosition(null);
      setOpenToiletDetails(!isOpen);
    }
    skipResetRef.current = false; // reset the flag after close
  };

  const handleSelectLocation = () => {
    skipResetRef.current = true;
    if (map) {
      setIsSelectingToiletLocation(true);
      const position = latLng(watch("latitude")!, watch("longitude")!);
      setToiletPosition(position);
      map.flyTo(position, map.getZoom());
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    const dirtyData = filterChangedFormFields(data, dirtyFields);
    console.log(dirtyData);
    const url = `${TOILET_SVC_URI}/${toilet?.id}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.patch(url, dirtyData, config);
      // TODO: Add new toilet marker
      console.log(response);
      toast.success("Toilet edited successfully!");
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
          <DialogContent
            className="max-h-[90vh] overflow-hidden flex flex-col"
            aria-describedby={undefined}
          >
            <DialogHeader>
              <DialogTitle>Edit Toilet</DialogTitle>
            </DialogHeader>
            <FormProvider
              methods={methods}
              onSubmit={onSubmit}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <ToiletForm
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
            aria-describedby={undefined}
          >
            <DrawerHeader>
              <DrawerTitle>Edit Toilet</DrawerTitle>
            </DrawerHeader>
            <FormProvider
              methods={methods}
              onSubmit={onSubmit}
              className="flex flex-col flex-1 overflow-hidden"
            >
              <ToiletForm
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

export default EditToiletDialog;
