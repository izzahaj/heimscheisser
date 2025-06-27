import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/redux/hooks";

import { setEditMode, setOpenEditToiletDialog } from "../../mapSlice";
import { Toilet } from "../../types/Toilet.types";

type EditButtonProps = {
  defaultValues: Omit<Toilet, "id">;
  handleOpenDeleteToiletDialog: VoidFunction;
};

const EditButton: React.FC<EditButtonProps> = (props) => {
  const { defaultValues, handleOpenDeleteToiletDialog } = props;
  const dispatch = useAppDispatch();
  const { reset } = useFormContext();

  const handleOpenEditDialog = () => {
    dispatch(setEditMode());
    dispatch(setOpenEditToiletDialog(true));
    reset(defaultValues);
  };

  return (
    <div
      className={cn(
        "self-center [&>*]:rounded-none [&>button:first-child]:rounded-l-md",
        "[&>button:last-child]:rounded-r-md divide-x",
      )}
    >
      <Button size="sm" variant="outline" onClick={handleOpenEditDialog}>
        <Pencil /> Edit
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline">
            <ChevronDown />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-(--radix-dropdown-menu-trigger-width) m-0"
          align="end"
        >
          <DropdownMenuItem onClick={handleOpenEditDialog}>
            <Pencil /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={handleOpenDeleteToiletDialog}
          >
            <Trash2 /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default EditButton;
