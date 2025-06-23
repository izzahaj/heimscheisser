import { faToilet } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import L, { latLng, LeafletEventHandlerFnMap } from "leaflet";
import { useMemo, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import { Marker } from "react-leaflet";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import {
  selectIsSelectingToiletLocation,
  selectSelectedToilet,
  setOpenToiletDetails,
  setSelectedToilet,
} from "../../mapSlice";
import { Toilet } from "../../types/Toilet.types";

type ToiletMarkerProps = {
  toilet: Toilet;
};

const ToiletMarker: React.FC<ToiletMarkerProps> = (props) => {
  const { toilet } = props;
  const [opacity, setOpacity] = useState(0.7);
  const markerRef = useRef<L.Marker>(null);
  const position = latLng(toilet.latitude, toilet.longitude);
  const selectedToilet = useAppSelector(selectSelectedToilet);
  const isSelectingToiletLocation = useAppSelector(
    selectIsSelectingToiletLocation,
  );
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
        if (!isSelectingToiletLocation) {
          setOpacity(1);
        }
      },
      mouseout() {
        setOpacity(0.7);
      },
      click() {
        // TODO: delete toilet
        if (!isSelectingToiletLocation && selectedToilet !== toilet) {
          dispatch(setSelectedToilet(toilet));
          dispatch(setOpenToiletDetails(true));
        }
      },
      keypress() {
        if (!isSelectingToiletLocation && selectedToilet !== toilet) {
          dispatch(setSelectedToilet(toilet));
          dispatch(setOpenToiletDetails(true));
        }
      },
    }),
    [selectedToilet, toilet, dispatch, isSelectingToiletLocation],
  );

  return (
    position !== null && (
      <Marker
        ref={markerRef}
        icon={icon}
        position={position}
        eventHandlers={eventHandlers}
        riseOnHover={!isSelectingToiletLocation}
        opacity={opacity}
        alt="toilet marker"
      />
    )
  );
};

export default ToiletMarker;
