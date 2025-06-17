import L, { LatLng, LeafletEventHandlerFnMap } from "leaflet";
import { useMemo, useRef } from "react";
import { Marker, useMapEvents } from "react-leaflet";

type AddToiletMarkerProps = {
  setPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
  position: LatLng | null;
  isActive: boolean;
};

const AddToiletMarker: React.FC<AddToiletMarkerProps> = (props) => {
  const { setPosition, position, isActive } = props;
  const markerRef = useRef<L.Marker>(null);

  useMapEvents({
    click(e) {
      if (isActive) {
        setPosition(e.latlng);
      }
    },
  });

  const eventHandlers: LeafletEventHandlerFnMap = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    [setPosition],
  );

  return (
    position !== null &&
    isActive && (
      <Marker
        position={position}
        draggable={true}
        eventHandlers={eventHandlers}
        ref={markerRef}
      />
    )
  );
};

export default AddToiletMarker;
