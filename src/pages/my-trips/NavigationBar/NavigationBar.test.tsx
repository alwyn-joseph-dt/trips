import { render, screen, fireEvent } from '@testing-library/react';
import NavigationBar from './NavigationBar';
import '@testing-library/jest-dom';

jest.mock('../../../assets/images/musafirbiz-logo.svg', () => 'musafirbiz-logo.svg');
jest.mock('../../../assets/images/profile.png', () => 'profile.png');

describe('NavigationBar', () => {
    test('renders the NavigationBar component with default content', () => {
        render(<NavigationBar />);

        const logo = screen.getByAltText('musafirbiz-logo');
        expect(logo).toBeInTheDocument();

        const profileImg = screen.getByAltText('profile');
        expect(profileImg).toBeInTheDocument();

        const homeLink = screen.getByText('Home');
        expect(homeLink).toBeInTheDocument();

        const myTripsLink = screen.getByText('My Trips');
        expect(myTripsLink).toBeInTheDocument();

        const eventsLink = screen.getByText('Events');
        expect(eventsLink).toBeInTheDocument();

        const accountSettingsLink = screen.getByText('Account Settings');
        expect(accountSettingsLink).toBeInTheDocument();
    });

    test('opens and closes the menu when clicking the hamburger icon (on small screens)', () => {
        render(<NavigationBar />);

        const menuItems = screen.queryByText('Home');
        expect(menuItems).not.toBeInTheDocument();

        const menuButton = screen.getByRole('button');
        fireEvent.click(menuButton);

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('My Trips')).toBeInTheDocument();
        expect(screen.getByText('Events')).toBeInTheDocument();

        fireEvent.click(menuButton);

        expect(screen.queryByText('Home')).not.toBeInTheDocument();
    });

    test('renders correct menu items in the dropdown menu on small screens', () => {
        render(<NavigationBar />);

        const menuButton = screen.getByRole('button');
        fireEvent.click(menuButton);

        expect(screen.getByText('Home')).toBeInTheDocument();
        expect(screen.getByText('My Trips')).toBeInTheDocument();
        expect(screen.getByText('Events')).toBeInTheDocument();
        expect(screen.getByText('People')).toBeInTheDocument();
        expect(screen.getByText('Account Settings')).toBeInTheDocument();
        expect(screen.getByText('Help')).toBeInTheDocument();
        expect(screen.getByText('Profile')).toBeInTheDocument();
    });

    test('displays the mobile menu button on small screens', () => {
        global.innerWidth = 500;
        global.dispatchEvent(new Event('resize'));

        render(<NavigationBar />);

        const menuButton = screen.getByRole('button');
        expect(menuButton).toBeInTheDocument();
    });

    test('does not display the mobile menu button on larger screens', () => {
        global.innerWidth = 800;
        global.dispatchEvent(new Event('resize'));

        render(<NavigationBar />);

        const menuButton = screen.queryByRole('button');
        expect(menuButton).not.toBeInTheDocument();
    });
});
