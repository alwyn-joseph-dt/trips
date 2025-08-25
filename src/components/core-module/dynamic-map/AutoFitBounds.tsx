import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

const AutoFitBounds = ({ flightPath,isHome=false }: { flightPath: any,isHome?:boolean }) => {
  const map = useMap(); // Access the map instance
  useEffect(() => {
        //for future refrence
    // if (!flightPath || !flightPath.curve) return;
        // const allPoints = flightPath.curve;
  if (!flightPath ) return;
      // Check if flightPath is an array or a single object
      const paths = Array.isArray(flightPath) ? flightPath : [flightPath];
      const allPoints: L.LatLngExpression[] = paths?.flatMap((path) =>
         Array.isArray(path?.curve) ? path?.curve : []
       );
    if (allPoints?.length > 0) {
      const bounds = L.latLngBounds(allPoints);
      map?.fitBounds(bounds,
        !isHome
          ? { padding: [10, 10] }
          : {
            paddingTopLeft: [50, 100],
            paddingBottomRight: [250, 350],
          }
      );
    }
  }, [flightPath, map]);

  return null; // This component does not render anything
};

export default AutoFitBounds;
