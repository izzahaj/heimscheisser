import { faToilet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import L, { LatLngExpression, LeafletEventHandlerFnMap } from "leaflet";
import { useMemo, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Marker } from "react-leaflet";

import { Toilet } from "../../types/Toilet.types";

type ToiletMarkerProps = {
  position: LatLngExpression | null;
  setSelectedToilet: React.Dispatch<React.SetStateAction<Toilet | null>>;
  toilet: Toilet;
  selectedToilet: Toilet | null;
  setOpenDetails: React.Dispatch<React.SetStateAction<boolean>>;
};

const ToiletMarker: React.FC<ToiletMarkerProps> = (props) => {
  const {
    position,
    toilet,
    selectedToilet,
    setSelectedToilet,
    setOpenDetails,
  } = props;
  const [opacity, setOpacity] = useState(0.7);
  const markerRef = useRef<L.Marker>(null);

  const icon = useMemo(() => {
    return L.divIcon({
      className: "",
      html: ReactDOMServer.renderToString(
        <FontAwesomeIcon icon={faToilet} size="2xl" />,
      ),
    });
  }, []);

  const eventHandlers: LeafletEventHandlerFnMap = useMemo(
    () => ({
      mouseover() {
        setOpacity(1);
      },
      mouseout() {
        setOpacity(0.7);
      },
      click() {
        // TODO: View toilet details + edit + delete
        if (selectedToilet !== toilet) {
          setSelectedToilet(toilet);
          setOpenDetails(true);
        }
      },
      keypress() {
        if (selectedToilet !== toilet) {
          setSelectedToilet(toilet);
          setOpenDetails(true);
        }
      },
    }),
    [selectedToilet, toilet, setSelectedToilet, setOpenDetails],
  );

  return (
    position !== null && (
      <Marker
        ref={markerRef}
        icon={icon}
        position={position}
        eventHandlers={eventHandlers}
        riseOnHover
        opacity={opacity}
        alt="toilet marker"
      />
    )
  );
};

export default ToiletMarker;
