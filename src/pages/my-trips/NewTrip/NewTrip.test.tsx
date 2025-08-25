import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ROUTES } from '../../../utility/constant';
import NewTrip from './NewTrip';

jest.mock('../NavigationBar/NavigationBar', () => {
    return function DummyNavigationBar() {
        return <div>NavigationBar</div>;
    };
});

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('NewTrip', () => {
    it('renders the NewTrip component correctly', () => {
        render(
            <MemoryRouter>
                <NewTrip />
            </MemoryRouter>
        );

        expect(screen.getByText("What would you like to call this trip?")).toBeInTheDocument();
        expect(screen.getByText("Who's Travelling?")).toBeInTheDocument();
        expect(screen.getByRole('button', { name: "Who's Travelling?" })).toBeInTheDocument();
    });

    it('navigates to the correct route when the "Who\'s Travelling?" button is clicked', () => {
        const mockNavigate = jest.fn();
        jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(mockNavigate);

        render(
            <MemoryRouter>
                <NewTrip />
            </MemoryRouter>
        );

        const button = screen.getByRole('button', { name: "Who's Travelling?" });
        fireEvent.click(button);

        expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ADDNEWTRAVELER);
    });
});