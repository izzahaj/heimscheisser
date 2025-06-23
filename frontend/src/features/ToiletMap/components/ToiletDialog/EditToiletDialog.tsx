import axios from "axios";
import { latLng, Map } from "leaflet";
import { useRef } from "react";
import { UseFormReturn } from "react-hook-form";
import { toast } from "sonner";
import { InferType } from "yup";

import { useAppDispatch, useAppSelector } from "@/app/hooks";
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

import {
  closeEditToiletDialog,
  enableSelectToiletLocation,
  resetToiletPosition,
  selectIsEditToiletDialogOpen,
  selectSelectedToilet,
  setIsEditToiletDialogOpen,
  setToiletPosition,
} from "../../mapSlice";
import { toiletSchema } from "../../schema/toiletSchema";
import { Toilet } from "../../types/Toilet.types";
import ToiletForm from "./ToiletForm";

type EditToiletDialogProps = {
  map: Map | null;
  methods: UseFormReturn<InferType<typeof toiletSchema>>;
  setOpenToiletDetails: React.Dispatch<React.SetStateAction<boolean>>;
  defaultValues: Omit<Toilet, "id">;
};

const EditToiletDialog: React.FC<EditToiletDialogProps> = (props) => {
  const { map, methods, setOpenToiletDetails, defaultValues } = props;

  const open = useAppSelector(selectIsEditToiletDialogOpen);
  const toilet = useAppSelector(selectSelectedToilet);
  const dispatch = useAppDispatch();
  const skipResetRef = useRef(false);
  const isTablet = useMediaQuery("md");

  const {
    watch,
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = methods;

  const handleOpen = (isOpen: boolean) => {
    dispatch(setIsEditToiletDialogOpen(isOpen));

    if (!isOpen && !skipResetRef.current) {
      reset(defaultValues); // reset form if closed not via Edit Map Location
      dispatch(resetToiletPosition());
      setOpenToiletDetails(!isOpen);
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
      dispatch(closeEditToiletDialog());
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
                handleClose={() => dispatch(closeEditToiletDialog())}
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
                handleClose={() => dispatch(closeEditToiletDialog())}
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
