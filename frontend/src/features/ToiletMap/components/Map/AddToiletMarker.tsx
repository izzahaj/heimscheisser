import { LatLng } from "leaflet";
import { Marker, useMapEvents } from "react-leaflet";

type AddToiletMarkerProps = {
  setPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
  position: LatLng | null;
  isActive: boolean;
};

const AddToiletMarker: React.FC<AddToiletMarkerProps> = (props) => {
  const { setPosition, position, isActive } = props;

  useMapEvents({
    click(e) {
      if (isActive) {
        setPosition(e.latlng);
      }
    },
  });

  return position === null
    ? null
    : isActive && <Marker position={position} draggable={true} />;
};

export default AddToiletMarker;
