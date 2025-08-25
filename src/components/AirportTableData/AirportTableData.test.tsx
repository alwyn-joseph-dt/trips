import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';

import AirportTableData from "./AirportTableData";
import { AirportData } from "../../types/airport";

// Mock Data
const mockRows: AirportData[] = [
  { id: 1, city: "Dubai", iata: "DXB", icao: "OMDB", airport: "Airport 1", elevation: "62", gps: "gps", municipality: "M1", country: "AE", longitude: "55", latitude: "25", popularity: "5", type: "large", nearby: "3",status:"Active" },
  { id: 2, city: "New York", iata: "JFK", icao: "KJFK", airport: "Airport 2", elevation: "13", gps: "gps", municipality: "M2", country: "US", longitude: "-73", latitude: "40", popularity: "4", type: "large", nearby: "2",status:"InActive" },
  { id: 3, city: "London", iata: "LHR", icao: "EGLL", airport: "Airport 3", elevation: "83", gps: "gps", municipality: "M3", country: "UK", longitude: "-0.45", latitude: "51.47", popularity: "3", type: "large", nearby: "1" ,status:"Active"},
];

// ✅ Mock the drawer and search bar to avoid dependency errors
jest.mock("../AddEditAirportDrawer/AddEditAirportDrawer", () => (props: any) => (
  <div data-testid="drawer">{props.open && "Drawer Open"}</div>
));
jest.mock("../SearchandAddButton/SearchandAddButton", () => () => (
  <div>SearchBar</div>
));

describe("AirportTableData Component", () => {
  test("renders initial table rows", () => {
    render(<AirportTableData searchTerm="" rows={mockRows} handleMenuOpen={jest.fn()} row={mockRows[0]} />);
    expect(screen.getByText("DXB")).toBeInTheDocument();
    expect(screen.getByText("JFK")).toBeInTheDocument();
  });

  test("filters rows based on search term", () => {
    render(<AirportTableData searchTerm="Dubai" rows={mockRows} handleMenuOpen={jest.fn()} row={mockRows[0]} />);
    expect(screen.getByText("DXB")).toBeInTheDocument();
    expect(screen.queryByText("JFK")).not.toBeInTheDocument();
  });

  test("selects and deselects all checkboxes", () => {
    render(<AirportTableData searchTerm="" rows={mockRows} handleMenuOpen={jest.fn()} row={mockRows[0]} />);
    const headerCheckbox = screen.getAllByRole("checkbox")[0];
    fireEvent.click(headerCheckbox); // select all
    expect(screen.getByText(/Selected: 2/i)).toBeInTheDocument();

    fireEvent.click(headerCheckbox); // deselect all
    expect(screen.getByText(/Selected: 0/i)).toBeInTheDocument();
  });

  test("pagination changes pages", () => {
    render(<AirportTableData searchTerm="" rows={mockRows} handleMenuOpen={jest.fn()} row={mockRows[0]} />);
    const nextPage = screen.getByRole("button", { name: "Go to page 2" });
    fireEvent.click(nextPage);
    expect(nextPage).toHaveAttribute("aria-current", "true");
  });

  test("menu opens and edit drawer opens", () => {
    render(<AirportTableData searchTerm="" rows={mockRows} handleMenuOpen={jest.fn()} row={mockRows[0]} />);
    const menuButtons = screen.getAllByLabelText("more");
    fireEvent.click(menuButtons[0]);
    fireEvent.click(screen.getByText("Edit"));
    expect(screen.getByTestId("drawer")).toHaveTextContent("Drawer Open");
  });

  test("menu opens and delete removes row", () => {
    render(<AirportTableData searchTerm="" rows={mockRows} handleMenuOpen={jest.fn()} row={mockRows[0]} />);
    const menuButtons = screen.getAllByLabelText("more");
    fireEvent.click(menuButtons[0]);
    fireEvent.click(screen.getByText("Delete"));
    expect(screen.queryByText("DXB")).not.toBeInTheDocument();
  });
});
