import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useDeleteToiletByIdMutation } from "@/services/Toilet/ToiletService";

import {
  removeToilet,
  resetSelectedToilet,
  selectSelectedToilet,
  setOpenToiletDetails,
} from "../../mapSlice";

type DeleteToiletDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const DeleteToiletDialog: React.FC<DeleteToiletDialogProps> = (props) => {
  const { open, onOpenChange } = props;
  const toilet = useAppSelector(selectSelectedToilet);
  const [deleteToilet] = useDeleteToiletByIdMutation();
  const dispatch = useAppDispatch();

  const handleDeleteToilet = async () => {
    const toiletId = toilet!.id;

    try {
      await deleteToilet(toiletId).unwrap();
      dispatch(setOpenToiletDetails(false));
      dispatch(resetSelectedToilet());
      dispatch(removeToilet(toiletId));
      toast.success("Toilet deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            toilet.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: "destructive" })}
            onClick={handleDeleteToilet}
          >
            Delete Toilet
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteToiletDialog;
