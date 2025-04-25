import Tooltip from "@mui/material/Tooltip";
import { Marker, useMapEvents } from "react-leaflet"

const AddToiletMarker = ({ setPosition, position, isActive }) => {
  useMapEvents({
    click(e) {
      if (isActive) {
        setPosition(e.latlng)
      }
    }
  });

  return position === null ? null : (
    <Marker position={position} draggable={true} />
  );
}

export default AddToiletMarker;
