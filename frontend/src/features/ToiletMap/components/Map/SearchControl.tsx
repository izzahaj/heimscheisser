import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import { useEffect } from "react";
import { useMap } from "react-leaflet"

const SearchControl = () => {
  const map = useMap();

  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider: new OpenStreetMapProvider(),
      style: 'bar',
      showMarker: true,
      searchLabel: 'Search',
      keepResult: true,
      animateZoom: true,
      notFoundMessage: 'Sorry, that address could not be found.'
    });

    map.addControl(searchControl)
    return () => map.removeControl(searchControl);
  }, [])

  return null;
}

export default SearchControl;
