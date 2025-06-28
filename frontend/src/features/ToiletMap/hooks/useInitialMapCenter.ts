import axios from "axios";
import { LatLng, latLng } from "leaflet";
import { useEffect, useState } from "react";

import { LAST_CENTER_KEY } from "../constants/mapValues";

const useInitialMapCenter = () => {
  const [center, setCenter] = useState<LatLng>(latLng(0, 0));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      // 1. Last viewed map center
      const stored = localStorage.getItem(LAST_CENTER_KEY);
      if (stored) {
        try {
          const { lat, lng } = JSON.parse(stored);
          setCenter(new LatLng(lat, lng));
          setIsLoading(false);
          return;
        } catch {
          console.error("Invalid cached center");
        }
      }

      // 2. IP-based fallback (country-level location)
      const url = "http://ip-api.com/json/";

      try {
        const res = await axios.get(url);
        const { lat, lon } = res.data;
        if (lat && lon) {
          const loc = new LatLng(lat, lon);
          setCenter(loc);
          setIsLoading(false);
          return;
        }
      } catch {
        console.error("IP geolocation failed");
      }

      setIsLoading(false);
    };

    load();
  }, []);

  return { center, isLoading };
};

export default useInitialMapCenter;
