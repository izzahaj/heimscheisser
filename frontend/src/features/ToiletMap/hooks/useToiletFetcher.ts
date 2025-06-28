import { LatLngBounds, Map as LeafletMap } from "leaflet";
import { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { useAppDispatch } from "@/redux/hooks";
import { useLazyGetNearbyToiletsQuery } from "@/services/Toilet/ToiletService";

import { addToilets } from "../mapSlice";

const useToiletFetcher = (map: LeafletMap | null) => {
  const dispatch = useAppDispatch();
  const [trigger] = useLazyGetNearbyToiletsQuery();

  const fetchNearbyToilets = useCallback(
    async (bounds: LatLngBounds) => {
      const { lat: minLat, lng: minLng } = bounds.getSouthWest();
      const { lat: maxLat, lng: maxLng } = bounds.getNorthEast();

      try {
        const toilets =
          (await trigger({ minLat, minLng, maxLat, maxLng }).unwrap()) ?? [];
        dispatch(addToilets(toilets));
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch toilets. Please try again later.");
      }
    },
    [trigger, dispatch],
  );

  const debouncedFetch = useDebouncedCallback(fetchNearbyToilets, 900);

  const handleFetchToilets = useCallback(() => {
    if (!map) {
      return;
    }

    const bounds = map.getBounds();
    debouncedFetch(bounds);
  }, [map, debouncedFetch]);

  useEffect(() => {
    if (!map) {
      return;
    }

    map.on("moveend", handleFetchToilets);
    return () => {
      map.off("moveend", handleFetchToilets);
    };
  }, [map, handleFetchToilets]);

  useEffect(() => {
    if (!map) {
      return;
    }

    handleFetchToilets();
  }, [map, handleFetchToilets]);
};

export default useToiletFetcher;
