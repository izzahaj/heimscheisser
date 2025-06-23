import L, { LeafletEventHandlerFnMap } from "leaflet";
import { useMemo, useRef } from "react";
import { Marker, useMapEvents } from "react-leaflet";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";

import {
  selectIsSelectingToiletLocation,
  selectToiletPosition,
  setToiletPosition,
} from "../../mapSlice";

const SelectLocationMarker: React.FC = () => {
  const markerRef = useRef<L.Marker>(null);
  const position = useAppSelector(selectToiletPosition);
  const isActive = useAppSelector(selectIsSelectingToiletLocation);
  const dispatch = useAppDispatch();

  useMapEvents({
    click(e) {
      if (isActive) {
        const pos = e.latlng;
        dispatch(setToiletPosition({ lat: pos.lat, lng: pos.lng }));
      }
    },
  });

  const eventHandlers: LeafletEventHandlerFnMap = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const pos = marker.getLatLng();
          dispatch(setToiletPosition({ lat: pos.lat, lng: pos.lng }));
        }
      },
    }),
    [dispatch],
  );

  return (
    position !== null &&
    isActive && (
      <Marker
        position={position}
        draggable={true}
        eventHandlers={eventHandlers}
        ref={markerRef}
        riseOnHover
      />
    )
  );
};

export default SelectLocationMarker;
