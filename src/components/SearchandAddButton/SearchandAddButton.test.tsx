// src/components/SearchandAddButton/SearchandAddButton.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AirportSearchBar from "./SearchandAddButton";

jest.mock("../AddEditAirportDrawer/AddEditAirportDrawer", () => (props: any) => (
  <div data-testid="drawer">{props.open ? "open" : "closed"}</div>
));

describe("AirportSearchBar Component (Unit)", () => {
  const mockSearch = jest.fn();

  it("renders multiple headings", () => {
    render(<AirportSearchBar onSearch={mockSearch} />);
    const headings = screen.getAllByText("Airline Master Data");
    expect(headings.length).toBeGreaterThan(0);
  });

  it("calls onSearch when typing in search input", () => {
    render(<AirportSearchBar onSearch={mockSearch} />);
    const searchInput = screen.getAllByPlaceholderText(
      /Search airports by IATA code, name, or city/i
    )[0];

    fireEvent.change(searchInput, { target: { value: "DXB" } });
    expect(mockSearch).toHaveBeenCalledWith("DXB");
  });

  it("opens drawer when New Airport button is clicked", () => {
    render(<AirportSearchBar onSearch={mockSearch} />);
    fireEvent.click(screen.getAllByText("New Airport")[0]);
    expect(screen.getByTestId("drawer")).toHaveTextContent("open");
  });
});
