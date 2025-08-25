import React, {useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet-curve";
import "leaflet-rotatedmarker";
import flightIcon from "../../../assets/images/flightMap.png";
import './FlightMap.css';
import AutoFitBounds from "./AutoFitBounds";
import { useFetchAirportsMutation } from "../../../store/musafirFlightLookupApi";

const customCircleIcon = (index: number) => new L.DivIcon({
    className: index < 1 ? 'custom-circle-icon3' : 'custom-circle-icon2',
    html: '',
    iconSize: index < 1 ? [9, 9] : [6, 6],
    iconAnchor: [3, 4],
});

const largeCircleIcon = (index: number) => new L.DivIcon({
    className: index < 1 ? 'custom-circle-icon-large' : '',
    html: '',
    iconSize: [33, 33],
    iconAnchor: [15, 15],
});

const customFlightIcon = (rotationAngle: number) => new L.DivIcon({
    className: '',
    html: `
      <div style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transform: rotate(${rotationAngle}deg);
        width: 28px;
        height: 28px;
        background: url(${flightIcon}) no-repeat center;
        background-size: contain;
      ">
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [14, 14],
});

const createCustomIcon = (flightDuration: string) => {

    return L.divIcon({
        html: `
          <div style="
           display: inline-block;
          background: #0087FACC;
          color: #FFFFFF;
          padding: 2px 4px;
          border-radius: 2px;
          font-size: 12px;
          font-weight: bold;
          white-space: nowrap;
          ">
          <span style="margin-left: 3px;">${flightDuration}</span>
          </div>
        `,
        className: "custom-flight-icon",
        iconSize: [60, 10], // Adjust width for longer durations
        iconAnchor: [35, 1], // Adjust placement
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
const MapView3 = ({ height, width,coordinates }: any) => {
    const [startPoints, setStartPoints] = useState<any>([])
    const [destinations, setDestinations] = useState<any>([]);
    const [fetchAirports] = useFetchAirportsMutation();
    const removeConsecutiveDuplicates = (arr: string[]): string[] => {
        if (!Array.isArray(arr)) return [];

        return arr?.filter((item, index) => index === 0 || item !== arr[index - 1]);

    }
    const filteredCoordinates = removeConsecutiveDuplicates(coordinates)
    const payload = filteredCoordinates.map(code =>
        code?.replace(/^from-/, '')?.replace(/^to-/, '')
    );
    const airportDetails = async () => {
        const airportPayload = {
            "Context": {
                "UserAgent": "Mozilla/5.0",
                "TrackingId": "de2ade5e6a0b4c75b44ab079f4f0b0cb",
                "TransactionId": "de2ade5e6a0b4c75b44ab079f4f0b0cb",
                "IpAddress": "192.168.1.1",
                "CountryCode": "IN"
            },
            "Request": {
                "Codes": payload,
                "Language": "en"
            }
        }
        try {
            const response = await fetchAirports(airportPayload).unwrap();
            if (response?.Response) {
                // Sort response in the same order as coordinates
                const orderedAirports = filteredCoordinates.map((entry: string) => {
                    const [type, code] = entry?.split('-'); // split into ['from', 'DEL']
                    const airport = response?.Response?.find((item: any) => item.Code === code);
                    return airport ? { ...airport, type } : null;
                })?.filter(Boolean); 
                const segmentStartPoints = [];
                const segmentDestinations = [];

                if (orderedAirports?.length === 1) {
                 segmentStartPoints.push({"cityName":`${orderedAirports[0]?.CityName} (${orderedAirports[0]?.Code})`,"coordinates":[orderedAirports[0]?.Latitude, orderedAirports[0]?.Longitude]});
                }
                else {
                    for (let i = 0; i < orderedAirports?.length - 1; i++) {
                        const start = orderedAirports[i];

                        if (start.type === 'from') {
                            // Find the next 'to' airport after this 'from'
                            for (let j = i + 1; j < orderedAirports?.length; j++) {
                                const dest = orderedAirports[j];
                                if (dest.type === 'to') {
                                    //future refrence
                                    // segmentStartPoints.push([start.Latitude, start.Longitude]);
                                    // segmentDestinations.push([dest.Latitude, dest.Longitude]);
                                    segmentStartPoints.push({"cityName":`${start?.CityName} (${start?.Code})`,"coordinates":[start?.Latitude, start?.Longitude]});
                                    segmentDestinations.push({"cityName":`${dest?.CityName} (${dest?.Code})`,"coordinates":[dest?.Latitude, dest?.Longitude]});
                                    i = j;
                                    break;
                                }
                            }
                        }
                    }
                }

                setStartPoints(segmentStartPoints);
                setDestinations(segmentDestinations);

            } else {
            console.error('Error in api response format');
            }
        } catch (error) {
            console.error('Error fetching airports:', error);
        }
    }
    useEffect(() => {
        airportDetails();
    }, [coordinates]);
    const flightPaths = useMemo(() => {
        if (
            !startPoints.length ||
            !destinations.length ||
            startPoints.length !== destinations.length
        ) return [];

        return startPoints.map((start: any, index: number) => {
            const destinationCords = destinations[index];
            if (!start || !destinationCords) return null;
            const startCoords = start?.coordinates;
            const destination = destinationCords?.coordinates;
            const curve = generateCurve(startCoords, destination);
            const midIndex = Math.floor(curve?.length / 2);
            const midpoint = curve[midIndex];
            const bearing = getBearing(
                curve[midIndex - 1] || startCoords,
                curve[midIndex] || destination
            );

            return {
                curve,
                midpoint,
                bearing,
                destination,
            };
        }).filter(Boolean);
    }, [startPoints, destinations]);
    if (
        !startPoints[0] ||
        !startPoints[0].coordinates ||
        !startPoints[0].coordinates[0] ||
        !startPoints[0].coordinates[1]
    ) {
        return null;
    }
    //future refrence
    // if (!startPoints[0] || !startPoints[0][0] || !startPoints[0][1]) {
    //     return null;
    // }
   return (
       <MapContainer center={startPoints[0]?.coordinates} zoom={4} style={{ height: height, width: width }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <AutoFitBounds flightPath={flightPaths} isHome={true}/>

            {/* Render Circles only if Start Points are provided */}
            {startPoints?.map((startPoint:any, index:any) => (
                <Marker key={`start-${index}`} position={startPoint?.coordinates} icon={customCircleIcon(index)} />
            ))}

            {/* Render Curves and Destination Markers only when Destinations are provided */}
            {destinations?.length > 0 &&(
                flightPaths?.map((flight:any, index:any) => (
                    <React.Fragment key={index}>
                        <Polyline positions={flight.curve} color="#0087FA" weight={3} />
                        {flight.midpoint && (
                            <Marker position={flight.midpoint} icon={customFlightIcon(flight.bearing + 65)} />
                        )}
                        <Marker position={flight.destination} icon={customCircleIcon(index)} />
                        <Marker position={startPoints[index]?.coordinates} icon={largeCircleIcon(index)} />
                        {startPoints?.[index] && (
                            
                                <Marker
                                    position={startPoints[index]?.coordinates}
                                    icon={createCustomIcon(startPoints[index]?.cityName)}
                                />)}
                                {destinations?.[index] && (
                                <Marker
                                    position={flight.destination}
                                    icon={createCustomIcon(destinations[index]?.cityName)}
                                />
                            
                        )}
                    </React.Fragment>
                )))}
        </MapContainer>
    );
};



export default MapView3;