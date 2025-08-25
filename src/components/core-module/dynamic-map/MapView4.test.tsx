import { render } from "@testing-library/react";
import MapView4 from "./MapView4";

jest.mock("react-leaflet");

describe('Dynamic Map', () => {

test('should render without crashing', () => {
    render(<MapView4 startPoints={[[40.7766, -74.006]]} destinations={[[28.5561, 77.1000]]} height={'200px'} width={'200px'} flightDurations={["2h 30min"]} />);
});

test('without deparature coor', () => {
    render(<MapView4 startPoints={[[40.7766, -74.006]]} destinations={[[40.7766, -79.006]]} height={'200px'} width={'200px'} flightDurations={["2h 30min"]} />);
});

test('without deparature coordinates', () => {
    render(<MapView4 startPoints={[[28.5561, 77.1000], [28.5561, 77.1000]]} destinations={[[40.7766, -74.006]]} height={'200px'} width={'200px'} flightDurations={["2h 30min"]} />);
});

}
);