import { useMapEvent } from 'react-leaflet'

const SetViewOnClick = ({ animateRef }) => {
  const map = useMapEvent('click', (e) => {
    map.setView(e.latlng, map.getZoom(), {
      animate: animateRef.current || false,
    })
  })

  return null;
}

export default SetViewOnClick;
