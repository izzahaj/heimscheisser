import { LatLng } from "leaflet";
import { Marker } from "react-leaflet";

type MyLocationMarkerProps = {
  position: LatLng | null;
};

const MyLocationMarker: React.FC<MyLocationMarkerProps> = (props) => {
  const { position } = props;

  // TODO: Change marker icon
  return position === null ? null : <Marker position={position} />;
};

export default MyLocationMarker;
