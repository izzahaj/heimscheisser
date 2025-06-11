import { useEffect, useState } from "react";

const breakpoints: Record<string, string> = {
  sm: "(min-width: 640px)",
  md: "(min-width: 768px)",
  lg: "(min-width: 1024px)",
  xl: "(min-width: 1280px)",
  "2xl": "(min-width: 1536px)",
};

const useMediaQuery = (queryOrBreakpoint: string): boolean => {
  const query = breakpoints[queryOrBreakpoint] ?? queryOrBreakpoint;
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    // Define the listener as a separate function to avoid recreating it on each render
    const listener = () => setMatches(media.matches);

    // Use 'change' instead of 'resize' for better performance
    media.addEventListener("change", listener);

    // Cleanup function to remove the event listener
    return () => media.removeEventListener("change", listener);
  }, [matches, query]); // Only recreate the listener when 'matches' or 'query' changes

  return matches;
};

export default useMediaQuery;
