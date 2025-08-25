import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddEditAirportDrawer from './AddEditAirportDrawer'; // Adjust the path if necessary

describe('AddEditAirportDrawer', () => {
    // Mock functions for props
    const mockOnClose = jest.fn();
    const mockOnSave = jest.fn();

    // Reset mocks before each test
    beforeEach(() => {
        jest.clearAllMocks();
    });

    // Test case 1: Renders in "Create New Airport" mode
    test('renders in create mode when open and no initialData is provided', () => {
        render(
            <AddEditAirportDrawer
                open={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        // Check if the drawer title is "Create New Airport"
        expect(screen.getByText('Create New Airport')).toBeInTheDocument();
        // Check if the "Create Airport" button is present
        expect(screen.getByRole('button', { name: /create airport/i })).toBeInTheDocument();
        // Check if the drawer itself is visible (by data-testid)
        expect(screen.getByTestId('drawer')).toBeInTheDocument();
    });





    // Test case 4: Calls onSave and onClose when "Create Airport" button is clicked
    test('calls onSave and onClose with new data when "Create Airport" is clicked', async () => {
        render(
            <AddEditAirportDrawer
                open={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        // Fill in some required fields
        fireEvent.change(screen.getByTestId('city-select'), { target: { value: 'Dubai' } });
        fireEvent.change(screen.getByLabelText(/iata code/i), { target: { name: 'iata', value: 'DXB' } });
        fireEvent.change(screen.getByPlaceholderText(/icao code/i), { target: { name: 'icao', value: 'OMDB' } });
        fireEvent.change(screen.getByPlaceholderText(/gps code/i), { target: { name: 'gps', value: '25.2528, 55.3644' } });
        fireEvent.change(screen.getByPlaceholderText(/municipality/i), { target: { name: 'municipality', value: 'Dubai' } });
        fireEvent.change(screen.getByPlaceholderText(/country code/i), { target: { name: 'country', value: 'AE' } });
        fireEvent.change(screen.getByPlaceholderText(/longitude/i), { target: { name: 'longitude', value: '55.3644' } });
        fireEvent.change(screen.getByPlaceholderText(/latitude/i), { target: { name: 'latitude', value: '25.2528' } });
        fireEvent.change(screen.getByTestId('popularity-select'), { target: { value: '4' } });


        // Click the "Create Airport" button
        fireEvent.click(screen.getByRole('button', { name: /create airport/i }));

        // Expect onSave to have been called with the form data and isEdit=false
        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalledTimes(1);
            expect(mockOnSave).toHaveBeenCalledWith(
                {
                    city: 'Dubai',
                    iata: 'DXB',
                    icao: 'OMDB',
                    gps: '25.2528, 55.3644',
                    municipality: 'Dubai',
                    country: 'AE',
                    longitude: '55.3644',
                    latitude: '25.2528',
                    popularity: '4',
                },
                false // isEdit should be false for creation
            );
            // Expect onClose to have been called
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

    // Test case 5: Calls onSave and onClose when "Update Airport" button is clicked
    test('calls onSave and onClose with updated data when "Update Airport" is clicked', async () => {
        const initialAirportData = {
            id: 1,
            city: 'New York',
            iata: 'JFK',
            icao: 'KJFK',
            gps: '40.6413, -73.7781',
            municipality: 'Queens',
            airport: "Dubai International",
            elevation: "62 ft",
            type: "large_airport",
            nearby: "3 Selections",
            country: 'US',
            longitude: '-73.7781',
            latitude: '40.6413',
            popularity: '3',
            status:"Active"
        };

        render(
            <AddEditAirportDrawer
                open={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
                initialData={initialAirportData}
            />
        );

        // Change a field
        const iataInput = screen.getByLabelText(/iata code/i);
        fireEvent.change(iataInput, { target: { name: 'iata', value: 'LGA' } });

        // Click the "Update Airport" button
        fireEvent.click(screen.getByRole('button', { name: /update airport/i }));

        // Expect onSave to have been called with the updated data and isEdit=true
        await waitFor(() => {
            expect(mockOnSave).toHaveBeenCalledTimes(1);
            expect(mockOnSave).toHaveBeenCalledWith(
                {
                    ...initialAirportData,
                    iata: 'LGA', // Verify the updated field
                },
                true // isEdit should be true for update
            );
            // Expect onClose to have been called
            expect(mockOnClose).toHaveBeenCalledTimes(1);
        });
    });

    // Test case 6: Calls onClose when "Cancel" button is clicked
    test('calls onClose when "Cancel" button is clicked', () => {
        render(
            <AddEditAirportDrawer
                open={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        // Click the "Cancel" button
        fireEvent.click(screen.getByRole('button', { name: /cancel/i }));

        // Expect onClose to have been called
        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockOnSave).not.toHaveBeenCalled(); // onSave should not be called
    });

    // Test case 7: Calls onClose when close icon button is clicked
    test('calls onClose when close icon button is clicked', () => {
        render(
            <AddEditAirportDrawer
                open={true}
                onClose={mockOnClose}
                onSave={mockOnSave}
            />
        );

        // Click the close icon button
        fireEvent.click(screen.getByLabelText('close'));

        // Expect onClose to have been called
        expect(mockOnClose).toHaveBeenCalledTimes(1);
        expect(mockOnSave).not.toHaveBeenCalled(); // onSave should not be called
    });

    // Test case 8: Drawer is not rendered when open prop is false
    //   test('does not render the drawer when open prop is false', () => {
    //     render(
    //       <AddEditAirportDrawer
    //         open={false}
    //         onClose={mockOnClose}
    //         onSave={mockOnSave}
    //       />
    //     );

    //     // Expect the drawer element not to be in the document
    //     expect(screen.queryByTestId('drawer')).not.toBeInTheDocument();
    //   });
});
