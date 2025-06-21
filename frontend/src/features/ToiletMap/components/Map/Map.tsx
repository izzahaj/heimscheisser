import { LatLng, Map as LeafletMap } from "leaflet";
import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";

import { MIN_ZOOM } from "../../constants/mapValues";
import { BidetType, Gender } from "../../constants/toiletValues";
import useToiletFetcher from "../../hooks/useToiletFetcher";
import { Toilet } from "../../types/Toilet.types";
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
  selectedToilet: Toilet | null;
  setSelectedToilet: React.Dispatch<React.SetStateAction<Toilet | null>>;
  setOpenDetails: React.Dispatch<React.SetStateAction<boolean>>;
};

const Map: React.FC<MapProps> = (props) => {
  const {
    setMap,
    map,
    myPosition,
    setAddToiletPosition,
    addToiletPosition,
    isActive,
    setSelectedToilet,
    selectedToilet,
    setOpenDetails,
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
          toilet={toilet}
          position={[toilet.latitude, toilet.longitude]}
          selectedToilet={selectedToilet}
          setSelectedToilet={setSelectedToilet}
          setOpenDetails={setOpenDetails}
        />
      ))}
      <ToiletMarker
        position={[1.3525, 103.8215]}
        toilet={{
          id: "toilet_id",
          name: "MacRitchie Reservoir Toilet long name sadjasldj lasjdkla ld dsadadasdadasdsa",
          description:
            "Near carpark. Random kinda long description hosdhjioasdiojdoasoiajdosid" +
            "asdjoasjd oaso djaso ji about the toilet that no one is going to read",
          latitude: 1.3525,
          longitude: 103.8215,
          genders: [Gender.Female, Gender.Male],
          hasBidet: true,
          isPaid: false,
          hasHandicap: true,
          bidetTypes: [BidetType.HandHeld],
        }}
        selectedToilet={selectedToilet}
        setSelectedToilet={setSelectedToilet}
        setOpenDetails={setOpenDetails}
      />
    </MapContainer>
  );
};

export default Map;
