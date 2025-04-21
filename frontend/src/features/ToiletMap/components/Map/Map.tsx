import { MapContainer, TileLayer } from 'react-leaflet'
import { NAVBAR_HEIGHT_REM } from '../../../../common/constants/Dimensions';
import { useRef, useState } from 'react';
import CurrentLocationMarker from './CurrentLocationMarker';
import SearchControl from './SearchControl';
import AddToiletMarker from './AddToiletMarker';

const Map = ({ map, position, addToiletPosition, setAddToiletPosition, isAddingToilet }) => {
  const [toilets, setToilets] = useState([]);
  const animateRef = useRef(false);

  // api call to retrieve list of toilets here

  return (
    <MapContainer
      style={{ height: `calc(100vh - ${NAVBAR_HEIGHT_REM * 2}rem)` }}
      center={[1.3521, 103.8198]} // SG coords
      zoom={13}
      ref={map}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SearchControl />
      {/* <SetViewOnClick animateRef={animateRef} /> */}
      <CurrentLocationMarker position={position} />
      <AddToiletMarker setPosition={setAddToiletPosition} position={addToiletPosition} isActive={isAddingToilet} />
      {/* list of nearby toilet markers here */}
    </MapContainer>
  ); 
};

export default Map;
