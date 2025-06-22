import {
  Accessibility,
  Banknote,
  Droplet,
  DropletOff,
  Droplets,
  Pencil,
  VenusAndMars,
} from "lucide-react";
import { UseFormReset } from "react-hook-form";

import useMediaQuery from "@/common/hooks/useMediaQuery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { BidetType, Gender } from "../../constants/toiletValues";
import { Toilet } from "../../types/Toilet.types";

type ToiletDetailsProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  toilet: Toilet | null;
  setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>;
  resetEditForm: UseFormReset<{
    name: string;
    latitude: number | null;
    longitude: number | null;
    description: string | undefined;
    genders: (Gender | undefined)[];
    hasHandicap: boolean;
    hasBidet: boolean;
    bidetTypes: (BidetType | undefined)[] | undefined;
    isPaid: NonNullable<boolean>;
  }>;
  defaultValues: {
    name: string;
    latitude: number | null;
    longitude: number | null;
    description: string;
    genders: Gender[];
    hasHandicap: boolean;
    hasBidet: boolean;
    bidetTypes: BidetType[];
    isPaid: boolean;
  };
  setMode: React.Dispatch<React.SetStateAction<"add" | "edit">>;
};

const ToiletDetails: React.FC<ToiletDetailsProps> = (props) => {
  const {
    open,
    setOpen,
    toilet,
    setOpenEditDialog,
    resetEditForm,
    defaultValues,
    setMode,
  } = props;
  const isTablet = useMediaQuery("md");

  const handleOpenEditDialog = () => {
    setMode("edit");
    setOpenEditDialog(true);
    resetEditForm(defaultValues);
    setOpen(false);
  };

  return (
    <>
      {isTablet ? (
        <Sheet modal={false} open={open} onOpenChange={setOpen}>
          <SheetContent
            side="left"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <SheetHeader>
              <SheetTitle>{toilet?.name}</SheetTitle>
              <SheetDescription>{toilet?.description}</SheetDescription>
            </SheetHeader>
            <div className="flex flex-col flex-1 p-4 gap-3">
              <div className="flex flex-row gap-5 items-center">
                <VenusAndMars />
                <div className="flex flex-row gap-1">
                  {toilet?.genders.map((gender) => (
                    <Badge key={gender}>{gender}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-row gap-5 items-center">
                <Accessibility />
                {toilet?.hasHandicap ? (
                  <p className="text-emerald-600">
                    Accessible toilet available
                  </p>
                ) : (
                  <p className="text-red-600">Accessible toilet unavailable</p>
                )}
              </div>
              <div className="flex flex-row gap-5 items-center">
                <Banknote />
                {toilet?.isPaid ? (
                  <p className="text-emerald-600">Free to use</p>
                ) : (
                  <p className="text-red-600">Requires payment</p>
                )}
              </div>
              <div className="flex flex-row gap-5 items-center">
                {toilet?.hasBidet ? (
                  <>
                    <Droplet />
                    <p className="text-emerald-600">Bidet available</p>
                  </>
                ) : (
                  <>
                    <DropletOff />
                    <p className="text-red-600">Bidet unavailable</p>
                  </>
                )}
              </div>
              {toilet?.hasBidet && (toilet?.bidetTypes ?? [].length > 0) && (
                <div className="flex flex-row gap-5 items-center">
                  <Droplets />
                  <div className="flex flex-row gap-1">
                    {toilet?.bidetTypes.map((bidet) => (
                      <Badge key={bidet}>{bidet}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <Button
                className="self-center"
                size="sm"
                variant="outline"
                onClick={handleOpenEditDialog}
              >
                <Pencil /> Edit
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent
            className={cn(
              "overflow-hidden flex flex-col p-1 data-[vaul-drawer-direction=bottom]:max-h-[100vh]",
            )}
          >
            <DrawerHeader>
              <DrawerTitle>{toilet?.name}</DrawerTitle>
            </DrawerHeader>
            <div className="flex flex-col flex-1 px-4 py-2 gap-3 overflow-auto">
              <DrawerDescription>{toilet?.description}</DrawerDescription>
              <div className="flex flex-row gap-5 items-center">
                <VenusAndMars />
                <div className="flex flex-row gap-1">
                  {toilet?.genders.map((gender) => (
                    <Badge key={gender}>{gender}</Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-row gap-5 items-center">
                <Accessibility />
                {toilet?.hasHandicap ? (
                  <p className="text-emerald-600">
                    Accessible toilet available
                  </p>
                ) : (
                  <p className="text-red-600">Accessible toilet unavailable</p>
                )}
              </div>
              <div className="flex flex-row gap-5 items-center">
                <Banknote />
                {toilet?.isPaid ? (
                  <p className="text-emerald-600">Free to use</p>
                ) : (
                  <p className="text-red-600">Requires payment</p>
                )}
              </div>
              <div className="flex flex-row gap-5 items-center">
                {toilet?.hasBidet ? (
                  <>
                    <Droplet />
                    <p className="text-emerald-600">Bidet available</p>
                  </>
                ) : (
                  <>
                    <DropletOff />
                    <p className="text-red-600">Bidet unavailable</p>
                  </>
                )}
              </div>
              {toilet?.hasBidet && (toilet?.bidetTypes ?? [].length > 0) && (
                <div className="flex flex-row gap-5 items-center">
                  <Droplets />
                  <div className="flex flex-row gap-1">
                    {toilet?.bidetTypes.map((bidet) => (
                      <Badge key={bidet}>{bidet}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <Button
                className="self-center"
                size="sm"
                variant="outline"
                onClick={handleOpenEditDialog}
              >
                <Pencil /> Edit
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

export default ToiletDetails;
