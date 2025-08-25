import { render, screen, fireEvent } from '@testing-library/react';
import AddNewTraveler from './AddNewTraveler';
import React from 'react';

jest.mock('../NavigationBar/NavigationBar', () => {
    return function NavigationBar() {
        return <div>NavigationBar</div>;
    };
});

describe('MyTrip Component', () => {
    test('renders the NavigationBar and Trip Title', () => {
        render(<AddNewTraveler />);

        expect(screen.getByText('NavigationBar')).toBeInTheDocument();

        expect(screen.getByText('Trip to London')).toBeInTheDocument();
    });

    test('renders Add Traveller button', () => {
        render(<AddNewTraveler />);

        expect(screen.getByText('Add Traveller')).toBeInTheDocument();
    });

    test('adds a traveller when Add Traveller button is clicked', () => {
        render(<AddNewTraveler />);

        fireEvent.click(screen.getByText('Add Traveller'));

        expect(screen.getByText('JF')).toBeInTheDocument();
        expect(screen.getByText('Mr. John Fernandez')).toBeInTheDocument();
    });

    test('removes a traveller when CloseIcon is clicked', () => {
        render(<AddNewTraveler />);

        fireEvent.click(screen.getByText('Add Traveller'));

        expect(screen.getByText('JF')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /close/i }));

        expect(screen.queryByText('JF')).toBeNull();
    });

    test('renders product tabs with images and labels', () => {
        render(<AddNewTraveler />);

        expect(screen.getByText('Flights')).toBeInTheDocument();
        expect(screen.getByText('Hotels')).toBeInTheDocument();
        expect(screen.getByText('Visa')).toBeInTheDocument();
        expect(screen.getByText('Holiday')).toBeInTheDocument();
        expect(screen.getByText('Cabs')).toBeInTheDocument();
        expect(screen.getByText('special Requests')).toBeInTheDocument();
    });

    test('tabs switch correctly when clicked', () => {
        render(<AddNewTraveler />);

        const flightsTab = screen.getByText('Flights');
        const hotelsTab = screen.getByText('Hotels');

        fireEvent.click(hotelsTab);

        expect(hotelsTab).toHaveStyle('color: rgb(0, 0, 0)');
        expect(flightsTab).toHaveStyle('color: rgb(103, 103, 103)');
    });

    test('shows correct number of travellers when added', () => {
        render(<AddNewTraveler />);

        fireEvent.click(screen.getByText('Add Traveller'));

        expect(screen.getAllByText('JF').length).toBe(1);

        fireEvent.click(screen.getByText('Add Traveller'));

        expect(screen.getAllByText('JF').length).toBe(2);
    });

    test('does not add more than 9 travellers', () => {
        render(<AddNewTraveler />);

        for (let i = 0; i < 9; i++) {
            fireEvent.click(screen.getByText('Add Traveller'));
        }

        expect(screen.getAllByText('JF').length).toBe(9);

        fireEvent.click(screen.getByText('Add Traveller'));

        expect(screen.getAllByText('JF').length).toBe(9);
    });

    test('renders SpeedDial and opens it when clicked', () => {
        render(<AddNewTraveler />);

        const speedDialButton = screen.getByRole('button');
        fireEvent.click(speedDialButton);

        expect(screen.getByText('Action 1')).toBeInTheDocument();
        expect(screen.getByText('Action 2')).toBeInTheDocument();
    });
});



