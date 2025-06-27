import { LatLngBounds, latLngBounds, Map as LeafletMap } from "leaflet";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useDebouncedCallback } from "use-debounce";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useLazyGetNearbyToiletsQuery } from "@/services/Toilet/ToiletService";

import { MIN_ZOOM } from "../constants/mapValues";
import { addToilets, selectToilets } from "../mapSlice";
import { Toilet } from "../types/Toilet.types";

type Tile = {
  x: number;
  y: number;
  z: number; // zoom
};

const getTileKey = (tile: Tile) => {
  return `${tile.z}-${tile.x}-${tile.y}`;
};

// convert tile coordinates to LatLngBounds
const tileToBounds = (tile: Tile): LatLngBounds => {
  const { x, y, z } = tile;
  const n = 2 ** z;

  const lng1 = (x / n) * 360 - 180;
  const lat1 =
    (Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n))) * 180) / Math.PI;

  const lng2 = ((x + 1) / n) * 360 - 180;
  const lat2 =
    (Math.atan(Math.sinh(Math.PI * (1 - (2 * (y + 1)) / n))) * 180) / Math.PI;

  return latLngBounds([lat2, lng1], [lat1, lng2]);
};

// calculate tiles covering the given bounds at zoom level
const getTilesInBounds = (bounds: LatLngBounds, zoom: number) => {
  const n = 2 ** zoom;

  function lng2tile(lng: number) {
    return Math.floor(((lng + 180) / 360) * n);
  }
  function lat2tile(lat: number) {
    const latRad = (lat * Math.PI) / 180;
    return Math.floor(
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) *
        n,
    );
  }

  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();

  const xMin = lng2tile(sw.lng);
  const xMax = lng2tile(ne.lng);
  const yMin = lat2tile(ne.lat);
  const yMax = lat2tile(sw.lat);

  const tiles: Tile[] = [];

  for (let x = xMin; x <= xMax; x++) {
    for (let y = yMin; y <= yMax; y++) {
      tiles.push({ x, y, z: zoom });
    }
  }

  return tiles;
};

const useToiletFetcher = (map: LeafletMap | null) => {
  const fetchedTilesRef = useRef<Set<string>>(new Set());
  const toilets = useAppSelector(selectToilets);
  const dispatch = useAppDispatch();

  const [trigger] = useLazyGetNearbyToiletsQuery();

  const mergeToilets = useCallback(
    (newToilets: Toilet[]) => {
      dispatch(addToilets(newToilets));
    },
    [dispatch],
  );

  const shouldFetch = useCallback((tiles: Tile[]) => {
    return tiles.some((tile) => {
      return !fetchedTilesRef.current.has(getTileKey(tile));
    });
  }, []);

  const debouncedFetch = useDebouncedCallback(async (bounds: LatLngBounds) => {
    const paddedBounds = bounds.pad(0.2);
    const tiles = getTilesInBounds(paddedBounds, map?.getZoom() ?? MIN_ZOOM);

    if (!shouldFetch(tiles)) {
      return;
    }

    const tilesToFetch = tiles.filter(
      (tile) => !fetchedTilesRef.current.has(getTileKey(tile)),
    );

    if (tilesToFetch.length === 0) {
      return;
    }

    const unionBounds = tilesToFetch.reduce(
      (acc, tile) => {
        return acc.extend(tileToBounds(tile));
      },
      latLngBounds([90, 180], [-90, -180]),
    );

    try {
      const { lat: minLat, lng: minLng } = unionBounds.getSouthWest();
      const { lat: maxLat, lng: maxLng } = unionBounds.getNorthEast();
      const result = await trigger({ minLat, minLng, maxLat, maxLng }).unwrap();

      mergeToilets(result);
      tilesToFetch.forEach((tile) => {
        fetchedTilesRef.current.add(getTileKey(tile));
      });
    } catch (err) {
      console.log(err);
      toast.error("Failed to fetch toilets. Please try again later.");
    }
  }, 900);

  const handleMapMoveEnd = useCallback(() => {
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

    map.on("moveend", handleMapMoveEnd);
    return () => {
      map.off("moveend", handleMapMoveEnd);
    };
  }, [map, handleMapMoveEnd]);

  return toilets;
};

export default useToiletFetcher;
