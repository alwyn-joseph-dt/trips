import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import StatusActions from "./StatusAction";

describe("StatusActions Component", () => {
  test("renders action buttons and opens/closes filter menu", () => {
    render(<StatusActions selectedCount={0} />);

    // ✅ Check if all 3 action buttons are rendered
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Deactivate")).toBeInTheDocument();
    expect(screen.getByText("Archive")).toBeInTheDocument();

    // ✅ Open the filter menu
    fireEvent.click(screen.getByRole("button", { name: /filters/i }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // ✅ Click a menu item (Active)
    fireEvent.click(screen.getByText("Active"));
     fireEvent.click(screen.getByText("Inactive"));
          fireEvent.click(screen.getByText("Archived"));


    // ✅ Menu should close
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});
