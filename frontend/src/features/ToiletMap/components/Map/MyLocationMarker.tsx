import { faCircleDot } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import L, { LatLng } from "leaflet";
import ReactDOMServer from "react-dom/server";
import { Marker } from "react-leaflet";

type MyLocationMarkerProps = {
  position: LatLng | null;
};

const MyLocationMarker: React.FC<MyLocationMarkerProps> = (props) => {
  const { position } = props;

  const icon = L.divIcon({
    className: "",
    html: ReactDOMServer.renderToString(
      <FontAwesomeIcon icon={faCircleDot} size="xl" color="red" beatFade />,
    ),
  });

  return position !== null && <Marker icon={icon} position={position} />;
};

export default MyLocationMarker;
