import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AllTrips from './AllTrips';
import { MemoryRouter } from 'react-router-dom';
import { ROUTES } from '../../../utility/constant';
import { useFetchCountMutation, useFetchMyTripsMutation } from "../../../store/musafirMyTripsApi";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


// Mocking API hooks
jest.mock('../../../store/musafirMyTripsApi', () => ({
    useFetchMyTripsMutation: jest.fn(),
    useFetchCountMutation: jest.fn(),
  }));

  const mockNavigate = jest.fn();
  
  // Mocking react-router-dom's useNavigate
  jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => mockNavigate);
  
  // Mocking i18next's useTranslation
  jest.mock('react-i18next', () => ({
    useTranslation: jest.fn(),
  }));

jest.mock('./AllTripsListingJson', () => ({
    jsonData: {
        Response: {
            TripDetails: [
                {
                    id: '1',
                    TripName: 'Trip to New York',
                    StartDate: '2025-01-01',
                    EndDate: '2025-01-15',
                    BookingAmount: '₹ 1,25,000',
                    Status: 'Confirmed',
                    TravellerName: 'John Doe',
                    services: [
                        { service: 'Round Trip from Delhi to New York', status: 'completed' },
                        { service: '7 Nights at The Plaza', status: 'pending' },
                    ],
                    department: 'Human Resources',
                    TripId: '890123',
                    Currency: 'INR',
                },
                {
                    id: '2',
                    TripName: 'Trip to Paris',
                    StartDate: '2025-02-01',
                    EndDate: '2025-02-10',
                    BookingAmount: '₹ 80,000',
                    Status: 'Draft',
                    TravellerName: 'Jane Doe',
                    services: [
                        { service: 'Round Trip from Delhi to Paris', status: 'pending' },
                        { service: '3 Nights at The Ritz', status: 'completed' },
                    ],
                    department: 'Sales',
                    TripId: '453459',
                    Currency: 'INR',
                },
            ],
        },
    },
}));

describe('AllTrips component', () => {
    const mockNavigate = jest.fn();
    const mockFetchTrips = jest.fn();
    const mockFetchCount = jest.fn();
  
    // beforeEach(() => {
    //   // Clear all previous mocks
    //   jest.clearAllMocks();
      
    //   useNavigate.mockReturnValue(mockNavigate);
    //   useFetchMyTripsMutation.mockReturnValue([mockFetchTrips]);
    //   useFetchCountMutation.mockReturnValue([mockFetchCount]);
    //   useTranslation.mockReturnValue({ t: (key) => key }); // Just return the key for simplicity
    // });


    it('renders the component and makes initial API calls on mount', async () => {
        // Mock the API responses
        const mockTripsResponse = { Response: { TripDetails: [{ id: 1, Name: 'Trip 1' }, { id: 2, Name: 'Trip 2' }] } };
        const mockCountResponse = { Response: { TotalCount: 2 } };
        
        mockFetchTrips.mockResolvedValue(mockTripsResponse);
        mockFetchCount.mockResolvedValue(mockCountResponse);
    
        render(<AllTrips />);
    
        // Assert initial loading states
        expect(mockFetchTrips).toHaveBeenCalledTimes(1);
        expect(mockFetchCount).toHaveBeenCalledTimes(1);
    
        // Ensure trips are displayed
        await waitFor(() => {
          expect(screen.getByText('Trip 1')).toBeInTheDocument();
          expect(screen.getByText('Trip 2')).toBeInTheDocument();
        });
      });
    
      it('handles tab change and triggers new API calls', async () => {
        const mockTripsResponse = { Response: { TripDetails: [{ id: 3, Name: 'Trip 3' }] } };
        const mockCountResponse = { Response: { TotalCount: 1 } };
        
        mockFetchTrips.mockResolvedValue(mockTripsResponse);
        mockFetchCount.mockResolvedValue(mockCountResponse);
    
        render(<AllTrips />);
    
        // Initially, the 'upcoming' tab is selected
        expect(mockFetchTrips).toHaveBeenCalledWith(expect.objectContaining({ Request: { FilterName: ['UPCOMING'] } }));
    
        // Simulate tab change
        const tabButton = screen.getByText('Upcoming');
        fireEvent.click(tabButton);
    
        // Verify API call with correct parameters after tab change
        await waitFor(() => {
          expect(mockFetchTrips).toHaveBeenCalledWith(expect.objectContaining({ Request: { FilterName: ['UPCOMING'] } }));
        });
      });
    
      it('handles page change in pagination', async () => {
        const mockTripsResponse = { Response: { TripDetails: [{ id: 1, Name: 'Trip 1' }, { id: 2, Name: 'Trip 2' }] } };
        const mockCountResponse = { Response: { TotalCount: 2 } };
        
        mockFetchTrips.mockResolvedValue(mockTripsResponse);
        mockFetchCount.mockResolvedValue(mockCountResponse);
    
        render(<AllTrips />);
    
        // Initially, there should be 2 items (itemsPerPage = 2)
        await waitFor(() => {
          expect(screen.getByText('Trip 1')).toBeInTheDocument();
          expect(screen.getByText('Trip 2')).toBeInTheDocument();
        });
    
        // Simulate page change to the second page
        const paginationButton = screen.getByLabelText('Go to page 2');
        fireEvent.click(paginationButton);
    
        // Check if pagination updates the page state and shows next trips
        expect(mockFetchTrips).toHaveBeenCalledWith(expect.objectContaining({ Request: { Page: 2 } }));
      });
    
      it('handles search key change and updates the trip list', async () => {
        const mockTripsResponse = { Response: { TripDetails: [{ id: 1, Name: 'Trip 1' }] } };
        const mockCountResponse = { Response: { TotalCount: 1 } };
    
        mockFetchTrips.mockResolvedValue(mockTripsResponse);
        mockFetchCount.mockResolvedValue(mockCountResponse);
    
        render(<AllTrips />);
    
        // Initially, no search key, so all trips should be loaded
        await waitFor(() => {
          expect(screen.getByText('Trip 1')).toBeInTheDocument();
        });
    
        // Simulate search key change
        const searchInput = screen.getByPlaceholderText('Search');
        fireEvent.change(searchInput, { target: { value: 'New Trip' } });
    
        // Verify the API call is triggered with searchKey
        await waitFor(() => {
          expect(mockFetchTrips).toHaveBeenCalledWith(expect.objectContaining({ Request: { SearchKey: 'New Trip' } }));
        });
      });
    
      it('handles error in fetching trips', async () => {
        mockFetchTrips.mockRejectedValue(new Error('Failed to fetch trips'));
    
        render(<AllTrips />);
    
        // Ensure that the error is handled gracefully
        await waitFor(() => {
          expect(mockFetchTrips).toHaveBeenCalledTimes(1);
        });
    
        // Optionally, you can test for any UI changes (like showing an error message)
        expect(screen.getByText('Error fetching trip list:')).toBeInTheDocument();
      });


    test('renders the AllTrips page with trips', async () => {
        render(
            <MemoryRouter>
                <AllTrips />
            </MemoryRouter>
        );

        expect(screen.getByText(/All Trips/i)).toBeInTheDocument();

        expect(screen.getByText(/Trip to New York/i)).toBeInTheDocument();
        expect(screen.getByText(/Trip to Paris/i)).toBeInTheDocument();

        expect(screen.getByText(/₹ 1,25,000/i)).toBeInTheDocument();
        expect(screen.getByText(/₹ 80,000/i)).toBeInTheDocument();

        expect(screen.getByText(/Confirmed/i)).toBeInTheDocument();
        expect(screen.getByText(/Draft/i)).toBeInTheDocument();
    });

    test('clicking on New Trip button navigates to new trip page', async () => {
        render(
            <MemoryRouter initialEntries={[ROUTES.TRIPS]}>
                <AllTrips />
            </MemoryRouter>
        );

        const newTripButton = screen.getByRole('button', { name: /New Trip/i });

        fireEvent.click(newTripButton);

        expect(window.location.pathname).toBe(ROUTES.NEWTRIP);
    });

    test('renders the search input field', () => {
        render(
            <MemoryRouter>
                <AllTrips />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText(/Search Trips, Travels or Locations/i)).toBeInTheDocument();
    });

    test('renders the tab buttons correctly', async () => {
        render(
            <MemoryRouter>
                <AllTrips />
            </MemoryRouter>
        );

        expect(screen.getByText(/Ongoing/i)).toBeInTheDocument();
        expect(screen.getByText(/Upcoming/i)).toBeInTheDocument();
        expect(screen.getByText(/Drafts/i)).toBeInTheDocument();

        fireEvent.click(screen.getByText(/Upcoming/i));

        await waitFor(() => {
            expect(screen.getByText(/Trip to New York/i)).toBeInTheDocument();
        });
    });

    test('menu opens and closes correctly for each trip', () => {
        render(
            <MemoryRouter>
                <AllTrips />
            </MemoryRouter>
        );

        const menuButton = screen.getAllByLabelText(/settings/i)[0];
        fireEvent.click(menuButton);

        expect(screen.getByText(/Manage/i)).toBeInTheDocument();
        expect(screen.getByText(/Share/i)).toBeInTheDocument();
        expect(screen.getByText(/Duplicate/i)).toBeInTheDocument();

        fireEvent.click(screen.getByText(/Manage/i));

        expect(screen.queryByText(/Manage/i)).not.toBeInTheDocument();
    });
});

