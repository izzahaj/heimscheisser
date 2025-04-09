import { Marker } from 'react-leaflet'

const CurrentLocationMarker = ({ position }) => {
  
  // TODO: Change marker icon
  return position === null ? null : (
    <Marker position={position} />
  );
};

export default CurrentLocationMarker;
