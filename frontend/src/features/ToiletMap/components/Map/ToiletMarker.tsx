import { faToilet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import L, { latLng, LeafletEventHandlerFnMap } from "leaflet";
import { useMemo, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Marker } from "react-leaflet";

import { useAppDispatch, useAppSelector } from "@/app/hooks";

import { selectSelectedToilet, setSelectedToilet } from "../../mapSlice";
import { Toilet } from "../../types/Toilet.types";

type ToiletMarkerProps = {
  toilet: Toilet;
  setOpenDetails: React.Dispatch<React.SetStateAction<boolean>>;
};

const ToiletMarker: React.FC<ToiletMarkerProps> = (props) => {
  const { toilet, setOpenDetails } = props;
  const [opacity, setOpacity] = useState(0.7);
  const markerRef = useRef<L.Marker>(null);
  const position = latLng(toilet.latitude, toilet.longitude);
  const selectedToilet = useAppSelector(selectSelectedToilet);
  const dispatch = useAppDispatch();

  const icon = useMemo(() => {
    return L.divIcon({
      className: "",
      iconAnchor: [10, 14],
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
        // TODO: delete toilet
        if (selectedToilet !== toilet) {
          dispatch(setSelectedToilet(toilet));
          setOpenDetails(true);
        }
      },
      keypress() {
        if (selectedToilet !== toilet) {
          dispatch(setSelectedToilet(toilet));
          setOpenDetails(true);
        }
      },
    }),
    [selectedToilet, toilet, setOpenDetails, dispatch],
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
