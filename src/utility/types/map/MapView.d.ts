export interface FlightPath {
    curve: any[];
    midpoint: any;
    bearing: any;
    destination: any;
    curvePoints?: any[];
}

export interface MapViewProps {
    start: any;
    destination: any;
    height: any;
    width: any;
    flightTotalDuration: string;
    source:any;
    destinationPlace:any;
}