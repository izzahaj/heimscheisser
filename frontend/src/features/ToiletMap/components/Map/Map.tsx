import { MapContainer, TileLayer } from 'react-leaflet'
import { NAVBAR_HEIGHT_REM } from '../../../../common/constants/Dimensions';
import { useRef } from 'react';
import SetViewOnClick from './SetViewOnClick';
import CurrentLocationMarker from './CurrentLocationMarker';

const Map = ({ map, position }) => {
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
      <SetViewOnClick animateRef={animateRef} />
      <CurrentLocationMarker position={position} />
      {/* list of nearby toilet markers here */}
    </MapContainer>
  ); 
};

export default Map;
