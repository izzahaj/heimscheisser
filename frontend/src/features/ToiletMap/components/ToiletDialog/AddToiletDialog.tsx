import axios from "axios";
import { latLng, Map } from "leaflet";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import { toast } from "sonner";

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
import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import { DEFAULT_TOILET_VALUES } from "../../constants/toiletValues";
import {
  enableSelectToiletLocation,
  resetToiletPosition,
  selectOpenAddToiletDialog,
  setOpenAddToiletDialog,
  setToiletPosition,
} from "../../mapSlice";
import ToiletForm from "./ToiletForm";

type AddToiletDialogProps = {
  map: Map | null;
};

const AddToiletDialog: React.FC<AddToiletDialogProps> = (props) => {
  const { map } = props;

  const open = useAppSelector(selectOpenAddToiletDialog);
  const dispatch = useAppDispatch();
  const skipResetRef = useRef(false);
  const isTablet = useMediaQuery("md");

  const { watch, handleSubmit, reset } = useFormContext();

  const handleOpen = (isOpen: boolean) => {
    dispatch(setOpenAddToiletDialog(isOpen));

    if (!isOpen && !skipResetRef.current) {
      reset(DEFAULT_TOILET_VALUES); // reset form if closed not via Edit Map Location
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
      dispatch(setOpenAddToiletDialog(false));
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
            <ToiletForm
              handleClose={() => dispatch(setOpenAddToiletDialog(false))}
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
          >
            <DrawerHeader>
              <DrawerTitle>Add Toilet</DrawerTitle>
              <DrawerDescription>
                Know a loo we don't? Add it to the map!
              </DrawerDescription>
            </DrawerHeader>
            <ToiletForm
              handleClose={() => dispatch(setOpenAddToiletDialog(false))}
              handleSelectLocation={handleSelectLocation}
              handleSubmit={onSubmit}
            />
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default AddToiletDialog;
