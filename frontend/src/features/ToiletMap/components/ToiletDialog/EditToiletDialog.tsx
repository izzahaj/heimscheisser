import axios from "axios";
import { latLng, Map } from "leaflet";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import {
  enableSelectToiletLocation,
  resetToiletPosition,
  selectOpenEditToiletDialog,
  selectSelectedToilet,
  setOpenEditToiletDialog,
  setSelectedToilet,
  setToiletPosition,
} from "../../mapSlice";
import { Toilet } from "../../types/Toilet.types";
import ToiletForm from "./ToiletForm";

type EditToiletDialogProps = {
  map: Map | null;
  defaultValues: Omit<Toilet, "id">;
};

const EditToiletDialog: React.FC<EditToiletDialogProps> = (props) => {
  const { map, defaultValues } = props;

  const open = useAppSelector(selectOpenEditToiletDialog);
  const toilet = useAppSelector(selectSelectedToilet);
  const dispatch = useAppDispatch();
  const skipResetRef = useRef(false);
  const isTablet = useMediaQuery("md");

  const {
    watch,
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = useFormContext();

  const handleOpen = (isOpen: boolean) => {
    dispatch(setOpenEditToiletDialog(isOpen));

    if (!isOpen && !skipResetRef.current) {
      reset(defaultValues); // reset form if closed not via Edit Map Location
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
      console.log(response);
      toast.success("Toilet edited successfully!");
      dispatch(setOpenEditToiletDialog(false));
      dispatch(setSelectedToilet(response.data));
      // TODO: Update all toilets with edited toilet
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
            <ToiletForm
              handleClose={() => dispatch(setOpenEditToiletDialog(false))}
              handleSelectLocation={handleSelectLocation}
              handleSubmit={onSubmit}
            />
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
            <ToiletForm
              handleClose={() => dispatch(setOpenEditToiletDialog(false))}
              handleSelectLocation={handleSelectLocation}
              handleSubmit={onSubmit}
            />
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default EditToiletDialog;
