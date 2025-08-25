import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet-curve";
import "leaflet-rotatedmarker";
import flightIcon from "../../../assets/images/map_flight_icon.png";
import './FlightMap.css';
import AutoFitBounds from "./AutoFitBounds";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { createRoot } from "react-dom/client";
import { FlightPath, MapViewProps } from "../../../utility/types/map/MapView";

const customCircleIcon = (source: string) => new L.DivIcon({
    className: 'custom-circle-icon',
    html: `<div style="margin-top:0.25rem">
    <span style="font-size: 8px; font-weight: bold; margin-top: 4px; text-shadow: 1px 1px 2px white, 0 0 25px white, 0 0 5px white;">  ${source}</span></div>`,
    iconSize: [9, 9],
    iconAnchor: [5, 6],
});


const createCustomNavigateIcon = (color = "red", size = 40) => {
    const iconHtml = document.createElement("div");
    const root = createRoot(iconHtml);
    root.render(
        <LocationOnIcon style={{ color: color, fontSize: size }} />
    );

    return L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-icon", // Optional for styling
        iconSize: [size, size], // Size of the div
        iconAnchor: [size / 2, size], // Anchor position
        popupAnchor: [0, -size], // Popup position
    });
};

const createCustomIcon = (flightDuration: string) => {
    return L.divIcon({
        html: `
          <div style="
            display: flex;
            align-items: center;
            background: white;
            padding: 2px 2px;
            border-radius: 4px;
            box-shadow: 0px 2px 4px rgba(0,0,0,0.2);
            font-size: 8px;
            font-weight: bold;
            white-space: nowrap;
          ">
          <img src="${flightIcon}" " />
          <span style="margin-left: 3px;">${flightDuration}</span>
          </div>
        `,
        className: "custom-flight-icon",
        iconSize: [60, 10], // Adjust width for longer durations
        iconAnchor: [50, 1], // Adjust placement
    });
};



const generateCurve = (start: number[], end: number[]) => {
    if (!start || !end || !Array.isArray(start) || !Array.isArray(end)) {
        console.error("Invalid start or end point:", start, end);
        return [start, end]; // Fallback to straight line
    }
    const [startLat, startLng] = start;
    const [endLat, endLng] = end;
    const distance = L.latLng({ lat: startLat, lng: startLng }).distanceTo(L.latLng({ lat: endLat, lng: endLng }));

    // Adjust the curve intensity based on distance
    let controlFactor = distance > 2000000 ? (distance > 9000000 ? 0.2 : 0.15) : 0.15;

    // Determine direction: East (clockwise) or West (anticlockwise)
    if (endLng < startLng) {
        controlFactor *= -1; // Flip for westward curves (anticlockwise)
    }

    const dx = endLng - startLng;
    const dy = endLat - startLat;
    const control = [
        (startLat + endLat) / 2 + controlFactor * dx,
        (startLng + endLng) / 2 - controlFactor * dy,
    ];

    const curve = [];
    for (let t = 0; t <= 1; t += 0.02) {
        const lat = (1 - t) * (1 - t) * startLat + 2 * (1 - t) * t * control[0] + t * t * endLat;
        const lng = (1 - t) * (1 - t) * startLng + 2 * (1 - t) * t * control[1] + t * t * endLng;
        curve.push([lat, lng]);
    }

    if (curve.length < 2) {
        return [start, end]; // Ensure at least two points
    }
    curve[0] = start;
    curve[curve.length - 1] = end;
    return curve;
};

// Function to calculate bearing between two points
const getBearing = (start: number[], end: number[]) => {
    const lat1 = (Math.PI / 180) * start[0];
    const lat2 = (Math.PI / 180) * end[0];
    const dLng = (Math.PI / 180) * (end[1] - start[1]);

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
};

// Multi-Destination Flight Paths
const MapView = ({ source, destinationPlace, start, destination, height, width, flightTotalDuration }: MapViewProps) => {
    const [flightPaths, setFlightPaths] = useState<FlightPath | null>(null);
    const customLocationIcon = createCustomNavigateIcon("red", 25);
    const customIcon = createCustomIcon(flightTotalDuration);
    useEffect(() => {
        if (!start || !destination) return;

        const paths = () => {
            const curve = generateCurve(start, destination);
            const midIndex = Math.floor(curve.length / 2);
            const midpoint = curve[midIndex];
            const bearing = getBearing(curve[midIndex - 1] || start, curve[midIndex] || destination);
            return { curve, midpoint, bearing, destination };
        };
        const newPaths = paths();
        setFlightPaths(newPaths);

    }, [start, destination]);

    return (
        <MapContainer
            center={start}
            zoom={13}
            style={{ height: height, width: width }}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            <AutoFitBounds flightPath={flightPaths} />

            {/* Multiple Flight Paths */}
            {flightPaths &&
                <Polyline positions={flightPaths.curve} color="blue" weight={3} />
            }

            {/* Flight Markers at Midpoints */}
            {flightPaths &&
                <React.Fragment >
                    {flightPaths.midpoint && <Marker position={flightPaths.midpoint} icon={customIcon} />}
                    {flightPaths.destination && <Marker position={flightPaths.destination} icon={customCircleIcon(destinationPlace)} />}
                    {flightPaths.destination && <Marker position={flightPaths.destination} icon={customLocationIcon} />}
                    {start && <Marker position={start} icon={customCircleIcon(source)} />}
                </React.Fragment>
            }
        </MapContainer>
    );
};

export default MapView;