import axios from "axios";
import { latLng, Map } from "leaflet";
import { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { InferType } from "yup";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
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

import {
  closeAddToiletDialog,
  enableSelectToiletLocation,
  resetToiletPosition,
  selectIsAddToiletDialogOpen,
  setIsAddToiletDialogOpen,
  setToiletPosition,
} from "../../mapSlice";
import { toiletSchema } from "../../schema/toiletSchema";
import ToiletForm from "./ToiletForm";

type AddToiletDialogProps = {
  map: Map | null;
  methods: UseFormReturn<InferType<typeof toiletSchema>>;
};

const AddToiletDialog: React.FC<AddToiletDialogProps> = (props) => {
  const { map, methods } = props;

  const open = useAppSelector(selectIsAddToiletDialogOpen);
  const dispatch = useAppDispatch();
  const skipResetRef = useRef(false);
  const isTablet = useMediaQuery("md");

  const { watch, handleSubmit, reset } = methods;

  const handleOpen = (isOpen: boolean) => {
    dispatch(setIsAddToiletDialogOpen(isOpen));
    if (!isOpen && !skipResetRef.current) {
      reset(); // reset form if closed not via Edit Map Location
      dispatch(resetToiletPosition());
    }
    skipResetRef.current = false; // reset the flag after close
  };

  const handleSelectLocation = () => {
    skipResetRef.current = true;
    if (map) {
      dispatch(enableSelectToiletLocation());
      const position = latLng(watch("latitude")!, watch("longitude")!);
      dispatch(setToiletPosition({ lat: position.lat, lng: position.lng }));
      map.flyTo(position, map.getZoom());
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);

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
      dispatch(closeAddToiletDialog());
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
              <ToiletForm
                handleClose={() => dispatch(closeAddToiletDialog())}
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
              <ToiletForm
                handleClose={() => dispatch(closeAddToiletDialog())}
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
