import { faToilet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import L, { LatLngExpression, LeafletEventHandlerFnMap } from "leaflet";
import { useMemo, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Marker } from "react-leaflet";

type ToiletMarkerProps = {
  position: LatLngExpression | null;
};

const ToiletMarker: React.FC<ToiletMarkerProps> = (props) => {
  const { position } = props;
  const [opacity, setOpacity] = useState(70);
  const markerRef = useRef<L.Marker>(null);

  const icon = L.divIcon({
    className: "",
    html: ReactDOMServer.renderToString(
      <FontAwesomeIcon icon={faToilet} size="xl" opacity={`${opacity}%`} />,
    ),
  });

  // TODO: change opacity to 100 on click of marker but reset on click outside
  const eventHandlers: LeafletEventHandlerFnMap = useMemo(
    () => ({
      click() {
        const marker = markerRef.current;
        if (marker != null) {
          setOpacity(100);
        }
      },
    }),
    [],
  );

  return (
    position !== null && (
      <Marker
        ref={markerRef}
        icon={icon}
        position={position}
        eventHandlers={eventHandlers}
      />
    )
  );
};

export default ToiletMarker;
