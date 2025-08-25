import { render } from "@testing-library/react";
import MapView from "./Map";

jest.mock("react-leaflet");

describe('Dynamic Map', () => {

test('should render without crashing', () => {
    render(<MapView source={"Delhi"} destinationPlace={"Dubai"} start={[40.7766, -74.006]} destination={[28.5561, 77.1000]} height={'200px'} width={'200px'} flightTotalDuration={"2h 30min"} />);
});

test('without deparature coor', () => {
    render(<MapView source={"Delhi"} destinationPlace={"Dubai"} start={[40.7766, -74.006]} destination={[40.7766, -74.006]} height={'200px'} width={'200px'} flightTotalDuration={"2h 30min"} />);
});

test('without deparature coordinates', () => {
    render(<MapView source={"Delhi"} destinationPlace={"Dubai"} start={[28.5561, 77.1000]} destination={[40.7766, -74.006]} height={'200px'} width={'200px'} flightTotalDuration={"2h 30min"} />);
});

}
);