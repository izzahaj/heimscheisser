import { LatLng, Map as LeafletMap } from "leaflet";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";

import { MIN_ZOOM } from "../../constants/MapValues";
import useToiletFetcher from "../../hooks/useToiletFetcher";
import AddToiletMarker from "./AddToiletMarker";
import MyLocationMarker from "./MyLocationMarker";
import ToiletMarker from "./ToiletMarker";

type MapProps = {
  setMap: React.Dispatch<React.SetStateAction<LeafletMap | null>>;
  map: LeafletMap | null;
  myPosition: LatLng | null;
  setAddToiletPosition: React.Dispatch<React.SetStateAction<LatLng | null>>;
  addToiletPosition: LatLng | null;
  isActive: boolean;
};

const Map: React.FC<MapProps> = (props) => {
  const {
    setMap,
    map,
    myPosition,
    setAddToiletPosition,
    addToiletPosition,
    isActive,
  } = props;

  const toilets = useToiletFetcher(map);

  return (
    <MapContainer
      ref={setMap}
      className="h-full"
      center={[1.3521, 103.8198]} // TODO: Cache last known coords OR current location
      zoom={17}
      minZoom={MIN_ZOOM}
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
      {toilets.map((toilet) => (
        <ToiletMarker
          key={toilet.id}
          position={[toilet.latitude, toilet.longitude]}
        />
      ))}
    </MapContainer>
  );
};

export default Map;
