import React from 'react';
import { Marker } from 'react-leaflet'

const ToiletMarker = ({ id, position }) => {
  
  // TODO: Change marker icon
  return position === null ? null : (
    <Marker position={position} />
  );
};

export default ToiletMarker;
