import { LatLng, Map as LeafletMap } from "leaflet";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";

import AddToiletMarker from "./AddToiletMarker";
import MyLocationMarker from "./MyLocationMarker";

type MapProps = {
  setMap: React.Dispatch<React.SetStateAction<LeafletMap | null>>;
  myPosition: LatLng | null;
  setAddToiletPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
  addToiletPosition: LatLng | null;
  isActive: boolean;
};

const Map: React.FC<MapProps> = (props) => {
  const {
    setMap,
    myPosition,
    setAddToiletPosition,
    addToiletPosition,
    isActive,
  } = props;

  return (
    <MapContainer
      ref={setMap}
      className="h-full"
      center={[1.3521, 103.8198]} // SG coords
      zoom={13}
      scrollWheelZoom={true}
      zoomControl={false}
    >
      <TileLayer
        attribution={
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> ' +
          "contributors"
        }
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position="topright" />
      <MyLocationMarker position={myPosition} />
      <AddToiletMarker
        setPosition={setAddToiletPosition}
        position={addToiletPosition}
        isActive={isActive}
      />
    </MapContainer>
  );
};

export default Map;
