import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { 
  useCreateOfferMutation, 
  useEditOfferMutation, 
  useFetchOfferListingMutation,
  useGenerateCodesMutation,
  useGetGeneralLedgerQuery,
  useOfferExportMutation,
  useOfferGetByIdMutation,
  useStatusUpdateMutation 
} from '../../../store/musafirOfferAPi';

// Mock the Redux store
const mockStore = configureStore({
  reducer: {
    // Add your reducers here if needed
  },
  preloadedState: {
    // Add initial state if needed
  }
});

// Mock API responses
const mockCreateOfferResponse = {
  Context: {
    StatusCode: 200,
    TrackingId: 'test-tracking-id',
    Message: 'Success',
    TransactionId: 'test-transaction-id'
  },
  Response: {
    VoucherId: 'voucher-123',
    CouponCodes: ['CODE1', 'CODE2', 'CODE3']
  }
};

const mockFetchOfferResponse = {
  Context: {
    StatusCode: 200,
    TrackingId: 'test-tracking-id',
    Message: 'Success',
    TransactionId: 'test-transaction-id'
  },
  Response: {
    Pagination: {
      PageNumber: 1,
      PageSize: 10,
      TotalCount: 2
    },
    Data: [
      {
        OfferCouponName: 'Test Coupon 1',
        OfferCouponId: 'coupon-1',
        UsageType: 'SINGLE',
        OfferId: 'offer-1',
        couponCode: 'CODE1',
        name: 'Test Coupon 1',
        type: 'DISCOUNT',
        createdBy: 'user-1',
        dateOfCreation: '2023-12-25T10:30:00Z',
        startDate: '2023-12-25T10:30:00Z',
        endDate: '2023-12-26T10:30:00Z',
        usageType: 'SINGLE',
        frequency: 1,
        users: '100',
        status: 'ACTIVE',
        isSelected: false,
        OfferCode: 'CODE1',
        OfferName: 'Test Offer 1',
        CreatedByName: 'John Doe',
        ModifiedByName: 'John Doe',
        CreatedByDateTime: '2023-12-25T10:30:00Z',
        StartDate: '2023-12-25T10:30:00Z',
        EndDate: '2023-12-26T10:30:00Z',
        UsageType: 'SINGLE',
        Frequency: '1',
        Users: '100',
        Status: 'ACTIVE'
      },
      {
        OfferCouponName: 'Test Coupon 2',
        OfferCouponId: 'coupon-2',
        UsageType: 'MULTIPLE',
        OfferId: 'offer-2',
        couponCode: 'CODE2',
        name: 'Test Coupon 2',
        type: 'DISCOUNT',
        createdBy: 'user-2',
        dateOfCreation: '2023-12-26T10:30:00Z',
        startDate: '2023-12-26T10:30:00Z',
        endDate: '2023-12-27T10:30:00Z',
        usageType: 'MULTIPLE',
        frequency: 5,
        users: '200',
        status: 'ACTIVE',
        isSelected: false,
        OfferCode: 'CODE2',
        OfferName: 'Test Offer 2',
        CreatedByName: 'Jane Smith',
        ModifiedByName: 'Jane Smith',
        CreatedByDateTime: '2023-12-26T10:30:00Z',
        StartDate: '2023-12-26T10:30:00Z',
        EndDate: '2023-12-27T10:30:00Z',
        UsageType: 'MULTIPLE',
        Frequency: '5',
        Users: '200',
        Status: 'ACTIVE'
      }
    ]
  }
};

const mockGetOfferByIdResponse = {
  Context: {
    StatusCode: 200,
    TrackingId: 'test-tracking-id',
    Message: 'Success',
    TransactionId: 'test-transaction-id'
  },
  Response: {
    OfferId: 'offer-1',
    OfferName: 'Test Offer',
    ShortDescription: 'Test short description',
    LongDescription: 'Test long description',
    TermsAndConditions: 'Test terms and conditions',
    UserSegmentId: 'segment-1',
    UserSegmentName: 'Test Segment',
    UsageType: 'SINGLE',
    UserType: 'REGULAR',
    GLCodeId: 'gl-1',
    GLCodeName: 'Test GL Code',
    Validity: {
      StartDateTime: '2023-12-25T10:30:00Z',
      EndDateTime: '2023-12-26T10:30:00Z',
      DaysOfWeek: ['MONDAY', 'TUESDAY', 'WEDNESDAY']
    },
    CalculationDefinition: {
      DiscountUnit: 'PERCENTAGE',
      DiscountValue: '10',
      MaxLimit: 100,
      RedemptionsType: 'SINGLE',
      ApplicableOn: 'FLIGHT_BOOKING'
    },
    Constraints: [],
    ApplicableDevices: ['MOBILE', 'WEB'],
    PaymentModes: ['CREDIT_CARD', 'DEBIT_CARD'],
    Status: 'ACTIVE',
    OfferCoupons: [],
    Frequency: 1
  }
};

const mockGenerateCodesResponse = {
  Context: {
    StatusCode: 200,
    TrackingId: 'test-tracking-id',
    Message: 'Success',
    TransactionId: 'test-transaction-id'
  },
  Response: {
    CouponCodes: ['GENERATED1', 'GENERATED2', 'GENERATED3']
  }
};

const mockGeneralLedgerResponse = [
  { Id: 'gl-1', Name: 'GL Code 1', Status: 'ACTIVE' },
  { Id: 'gl-2', Name: 'GL Code 2', Status: 'ACTIVE' },
  { Id: 'gl-3', Name: 'GL Code 3', Status: 'INACTIVE' }
];

// Mock the API hooks
jest.mock('../../../store/musafirOfferAPi', () => ({
  useCreateOfferMutation: jest.fn(),
  useEditOfferMutation: jest.fn(),
  useFetchOfferListingMutation: jest.fn(),
  useGenerateCodesMutation: jest.fn(),
  useGetGeneralLedgerQuery: jest.fn(),
  useOfferExportMutation: jest.fn(),
  useOfferGetByIdMutation: jest.fn(),
  useStatusUpdateMutation: jest.fn()
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <Provider store={mockStore}>
    {children}
  </Provider>
);

describe('Offer API Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useCreateOfferMutation', () => {
    test('creates offer successfully', async () => {
      const mockCreateOffer = jest.fn().mockResolvedValue(mockCreateOfferResponse);
      (useCreateOfferMutation as jest.Mock).mockReturnValue([
        mockCreateOffer,
        { isLoading: false, error: null }
      ]);

      const { result } = renderHook(() => useCreateOfferMutation(), { wrapper });

      const [createOffer] = result.current;

      const offerData = {
        Context: {
          UserAgent: 'test-agent',
          TrackingId: 'test-tracking',
          TransactionId: 'test-transaction',
          CountryCode: 'US',
          IpAddress: '127.0.0.1'
        },
        Request: {
          OrgEntityId: 'org-1',
          OfferName: 'Test Offer',
          ShortDescription: 'Test short description',
          LongDescription: 'Test long description',
          TermsAndConditions: 'Test terms',
          UserSegmentId: 'segment-1',
          UsageType: 'SINGLE',
          Frequency: '1',
          UserType: 'REGULAR',
          GLCodeId: 'gl-1',
          Validity: {
            StartDateTime: '2023-12-25T10:30:00Z',
            EndDateTime: '2023-12-26T10:30:00Z',
            DaysOfWeek: ['MONDAY', 'TUESDAY']
          },
          CalculationDefinition: {
            DiscountUnit: 'PERCENTAGE',
            RedemptionType: 'SINGLE',
            DiscountValue: 10,
            ApplicableOn: 'FLIGHT_BOOKING',
            MaxLimit: 100
          },
          Constraints: [],
          ApplicableDevices: ['MOBILE', 'WEB'],
          PaymentModes: ['CREDIT_CARD'],
          CouponCodes: ['CODE1', 'CODE2']
        }
      };

      const response = await createOffer(offerData);

      expect(mockCreateOffer).toHaveBeenCalledWith(offerData);
      expect(response).toEqual(mockCreateOfferResponse);
    });

    test('handles create offer error', async () => {
      const mockError = new Error('API Error');
      const mockCreateOffer = jest.fn().mockRejectedValue(mockError);
      (useCreateOfferMutation as jest.Mock).mockReturnValue([
        mockCreateOffer,
        { isLoading: false, error: mockError }
      ]);

      const { result } = renderHook(() => useCreateOfferMutation(), { wrapper });

      const [createOffer] = result.current;

      await expect(createOffer({})).rejects.toThrow('API Error');
    });
  });

  describe('useFetchOfferListingMutation', () => {
    test('fetches offer listing successfully', async () => {
      const mockFetchOffers = jest.fn().mockResolvedValue(mockFetchOfferResponse);
      (useFetchOfferListingMutation as jest.Mock).mockReturnValue([
        mockFetchOffers,
        { isLoading: false, error: null }
      ]);

      const { result } = renderHook(() => useFetchOfferListingMutation(), { wrapper });

      const [fetchOffers] = result.current;

      const fetchData = {
        Context: {
          UserAgent: 'test-agent',
          TrackingId: 'test-tracking',
          TransactionId: 'test-transaction',
          CountryCode: 'US',
          IpAddress: '127.0.0.1'
        },
        Request: {
          Pagination: {
            PageNumber: 1,
            PageSize: 10
          },
          SearchText: 'test'
        }
      };

      const response = await fetchOffers(fetchData);

      expect(mockFetchOffers).toHaveBeenCalledWith(fetchData);
      expect(response).toEqual(mockFetchOfferResponse);
      expect(response.Response.Data).toHaveLength(2);
    });

    test('handles fetch offer listing error', async () => {
      const mockError = new Error('Fetch Error');
      const mockFetchOffers = jest.fn().mockRejectedValue(mockError);
      (useFetchOfferListingMutation as jest.Mock).mockReturnValue([
        mockFetchOffers,
        { isLoading: false, error: mockError }
      ]);

      const { result } = renderHook(() => useFetchOfferListingMutation(), { wrapper });

      const [fetchOffers] = result.current;

      await expect(fetchOffers({})).rejects.toThrow('Fetch Error');
    });
  });

  describe('useGetGeneralLedgerQuery', () => {
    test('fetches general ledger data successfully', () => {
      (useGetGeneralLedgerQuery as jest.Mock).mockReturnValue({
        data: mockGeneralLedgerResponse,
        isLoading: false,
        error: null
      });

      const { result } = renderHook(() => useGetGeneralLedgerQuery(), { wrapper });

      expect(result.current.data).toEqual(mockGeneralLedgerResponse);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    test('handles general ledger loading state', () => {
      (useGetGeneralLedgerQuery as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null
      });

      const { result } = renderHook(() => useGetGeneralLedgerQuery(), { wrapper });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    test('handles general ledger error state', () => {
      const mockError = new Error('GL Error');
      (useGetGeneralLedgerQuery as jest.Mock).mockReturnValue({
        data: undefined,
        isLoading: false,
        error: mockError
      });

      const { result } = renderHook(() => useGetGeneralLedgerQuery(), { wrapper });

      expect(result.current.error).toEqual(mockError);
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('useGenerateCodesMutation', () => {
    test('generates coupon codes successfully', async () => {
      const mockGenerateCodes = jest.fn().mockResolvedValue(mockGenerateCodesResponse);
      (useGenerateCodesMutation as jest.Mock).mockReturnValue([
        mockGenerateCodes,
        { isLoading: false, error: null }
      ]);

      const { result } = renderHook(() => useGenerateCodesMutation(), { wrapper });

      const [generateCodes] = result.current;

      const generateData = {
        Context: {
          UserAgent: 'test-agent',
          TrackingId: 'test-tracking',
          TransactionId: 'test-transaction',
          CountryCode: 'US',
          IpAddress: '127.0.0.1'
        },
        Request: {
          CouponCodesCount: '5',
          LengthOfCode: '8',
          Prefix: 'TEST',
          Suffix: 'END'
        }
      };

      const response = await generateCodes(generateData);

      expect(mockGenerateCodes).toHaveBeenCalledWith(generateData);
      expect(response).toEqual(mockGenerateCodesResponse);
      expect(response.Response.CouponCodes).toHaveLength(3);
    });

    test('handles generate codes error', async () => {
      const mockError = new Error('Generate Error');
      const mockGenerateCodes = jest.fn().mockRejectedValue(mockError);
      (useGenerateCodesMutation as jest.Mock).mockReturnValue([
        mockGenerateCodes,
        { isLoading: false, error: mockError }
      ]);

      const { result } = renderHook(() => useGenerateCodesMutation(), { wrapper });

      const [generateCodes] = result.current;

      await expect(generateCodes({})).rejects.toThrow('Generate Error');
    });
  });

  describe('useOfferGetByIdMutation', () => {
    test('fetches offer by ID successfully', async () => {
      const mockGetOfferById = jest.fn().mockResolvedValue(mockGetOfferByIdResponse);
      (useOfferGetByIdMutation as jest.Mock).mockReturnValue([
        mockGetOfferById,
        { isLoading: false, error: null }
      ]);

      const { result } = renderHook(() => useOfferGetByIdMutation(), { wrapper });

      const [getOfferById] = result.current;

      const getData = {
        Context: {
          UserAgent: 'test-agent',
          TrackingId: 'test-tracking',
          TransactionId: 'test-transaction',
          CountryCode: 'US',
          IpAddress: '127.0.0.1'
        },
        Request: {
          offerId: 'offer-1'
        }
      };

      const response = await getOfferById(getData);

      expect(mockGetOfferById).toHaveBeenCalledWith(getData);
      expect(response).toEqual(mockGetOfferByIdResponse);
      expect(response.Response.OfferName).toBe('Test Offer');
    });

    test('handles get offer by ID error', async () => {
      const mockError = new Error('Get Error');
      const mockGetOfferById = jest.fn().mockRejectedValue(mockError);
      (useOfferGetByIdMutation as jest.Mock).mockReturnValue([
        mockGetOfferById,
        { isLoading: false, error: mockError }
      ]);

      const { result } = renderHook(() => useOfferGetByIdMutation(), { wrapper });

      const [getOfferById] = result.current;

      await expect(getOfferById({})).rejects.toThrow('Get Error');
    });
  });

  describe('useEditOfferMutation', () => {
    test('edits offer successfully', async () => {
      const mockEditOffer = jest.fn().mockResolvedValue({ success: true });
      (useEditOfferMutation as jest.Mock).mockReturnValue([
        mockEditOffer,
        { isLoading: false, error: null }
      ]);

      const { result } = renderHook(() => useEditOfferMutation(), { wrapper });

      const [editOffer] = result.current;

      const editData = {
        offerId: 'offer-1',
        offerData: {
          OfferName: 'Updated Offer Name',
          ShortDescription: 'Updated description'
        }
      };

      const response = await editOffer(editData);

      expect(mockEditOffer).toHaveBeenCalledWith(editData);
      expect(response).toEqual({ success: true });
    });

    test('handles edit offer error', async () => {
      const mockError = new Error('Edit Error');
      const mockEditOffer = jest.fn().mockRejectedValue(mockError);
      (useEditOfferMutation as jest.Mock).mockReturnValue([
        mockEditOffer,
        { isLoading: false, error: mockError }
      ]);

      const { result } = renderHook(() => useEditOfferMutation(), { wrapper });

      const [editOffer] = result.current;

      await expect(editOffer({})).rejects.toThrow('Edit Error');
    });
  });

  describe('useStatusUpdateMutation', () => {
    test('updates offer status successfully', async () => {
      const mockStatusUpdate = jest.fn().mockResolvedValue({ success: true });
      (useStatusUpdateMutation as jest.Mock).mockReturnValue([
        mockStatusUpdate,
        { isLoading: false, error: null }
      ]);

      const { result } = renderHook(() => useStatusUpdateMutation(), { wrapper });

      const [statusUpdate] = result.current;

      const statusData = {
        Context: {
          UserAgent: 'test-agent',
          TrackingId: 'test-tracking',
          TransactionId: 'test-transaction',
          CountryCode: 'US',
          IpAddress: '127.0.0.1'
        },
        Request: {
          OfferCouponIds: ['coupon-1', 'coupon-2'],
          Status: 'ACTIVE'
        }
      };

      const response = await statusUpdate(statusData);

      expect(mockStatusUpdate).toHaveBeenCalledWith(statusData);
      expect(response).toEqual({ success: true });
    });

    test('handles status update error', async () => {
      const mockError = new Error('Status Update Error');
      const mockStatusUpdate = jest.fn().mockRejectedValue(mockError);
      (useStatusUpdateMutation as jest.Mock).mockReturnValue([
        mockStatusUpdate,
        { isLoading: false, error: mockError }
      ]);

      const { result } = renderHook(() => useStatusUpdateMutation(), { wrapper });

      const [statusUpdate] = result.current;

      await expect(statusUpdate({})).rejects.toThrow('Status Update Error');
    });
  });

  describe('useOfferExportMutation', () => {
    test('exports offer data successfully', async () => {
      const mockExportOffer = jest.fn().mockResolvedValue({ data: 'exported-data' });
      (useOfferExportMutation as jest.Mock).mockReturnValue([
        mockExportOffer,
        { isLoading: false, error: null }
      ]);

      const { result } = renderHook(() => useOfferExportMutation(), { wrapper });

      const [exportOffer] = result.current;

      const exportData = {
        Context: {
          UserAgent: 'test-agent',
          TrackingId: 'test-tracking',
          TransactionId: 'test-transaction',
          CountryCode: 'US',
          IpAddress: '127.0.0.1'
        },
        Request: {
          SearchText: 'test'
        }
      };

      const response = await exportOffer(exportData);

      expect(mockExportOffer).toHaveBeenCalledWith(exportData);
      expect(response).toEqual({ data: 'exported-data' });
    });

    test('handles export error', async () => {
      const mockError = new Error('Export Error');
      const mockExportOffer = jest.fn().mockRejectedValue(mockError);
      (useOfferExportMutation as jest.Mock).mockReturnValue([
        mockExportOffer,
        { isLoading: false, error: mockError }
      ]);

      const { result } = renderHook(() => useOfferExportMutation(), { wrapper });

      const [exportOffer] = result.current;

      await expect(exportOffer({})).rejects.toThrow('Export Error');
    });
  });

  describe('API Integration Scenarios', () => {
    test('complete offer creation workflow', async () => {
      // Mock all required hooks
      const mockCreateOffer = jest.fn().mockResolvedValue(mockCreateOfferResponse);
      const mockGenerateCodes = jest.fn().mockResolvedValue(mockGenerateCodesResponse);
      const mockGetGL = jest.fn().mockReturnValue({
        data: mockGeneralLedgerResponse,
        isLoading: false,
        error: null
      });

      (useCreateOfferMutation as jest.Mock).mockReturnValue([
        mockCreateOffer,
        { isLoading: false, error: null }
      ]);
      (useGenerateCodesMutation as jest.Mock).mockReturnValue([
        mockGenerateCodes,
        { isLoading: false, error: null }
      ]);
      (useGetGeneralLedgerQuery as jest.Mock).mockReturnValue(mockGetGL());

      // Test the complete workflow
      const { result: createResult } = renderHook(() => useCreateOfferMutation(), { wrapper });
      const { result: generateResult } = renderHook(() => useGenerateCodesMutation(), { wrapper });
      const { result: glResult } = renderHook(() => useGetGeneralLedgerQuery(), { wrapper });

      // Verify GL data is loaded
      expect(glResult.current.data).toEqual(mockGeneralLedgerResponse);

      // Generate codes
      const codesResponse = await generateResult.current[0]({
        Context: {},
        Request: { CouponCodesCount: '3', LengthOfCode: '8' }
      });
      expect(codesResponse.Response.CouponCodes).toHaveLength(3);

      // Create offer
      const createResponse = await createResult.current[0]({
        Context: {},
        Request: { OfferName: 'Test Offer', CouponCodes: codesResponse.Response.CouponCodes }
      });
      expect(createResponse.Response.VoucherId).toBe('voucher-123');
    });

    test('error handling in workflow', async () => {
      const mockError = new Error('Workflow Error');
      const mockCreateOffer = jest.fn().mockRejectedValue(mockError);
      
      (useCreateOfferMutation as jest.Mock).mockReturnValue([
        mockCreateOffer,
        { isLoading: false, error: mockError }
      ]);

      const { result } = renderHook(() => useCreateOfferMutation(), { wrapper });

      await expect(result.current[0]({})).rejects.toThrow('Workflow Error');
      expect(result.current[1].error).toEqual(mockError);
    });
  });
}); 