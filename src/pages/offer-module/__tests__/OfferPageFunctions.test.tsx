import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// Extend dayjs with UTC plugin
dayjs.extend(utc);

// Mock utility functions that would be extracted from the OfferPage component
const formatDateTime = (isoString: string) => {
  if (!isoString) return '';
  return dayjs.utc(isoString).format('DD/MM/YYYY HH:mm');
};

const formatDateTimeToUTC = (dateObj: dayjs.Dayjs | null, timeStr: string) => {
  if (!dateObj) return null;
  const [hours, minutes] = timeStr.split(':');
  return dateObj.hour(parseInt(hours)).minute(parseInt(minutes)).utc().format();
};

const convertToISO = (dateStr?: string, timeStr?: string) => {
  if (!dateStr || !timeStr) return null;
  const [hours, minutes] = timeStr.split(':');
  return dayjs(dateStr).hour(parseInt(hours)).minute(parseInt(minutes)).utc().format();
};

interface CouponData {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
}

const formatCouponData = (couponsData: CouponData[] | null | undefined) => {
  if (!couponsData || !Array.isArray(couponsData)) return [];
  return couponsData.map(coupon => ({
    ...coupon,
    isSelected: false,
    formattedStartDate: formatDateTime(coupon.startDate),
    formattedEndDate: formatDateTime(coupon.endDate)
  }));
};

const getFormattedPaymentModes = (paymentModes: string[]) => {
  if (!paymentModes || paymentModes.length === 0) return '';
  return paymentModes.join(', ');
};

const getFormattedApplicablityMethods = (applicability: string[]) => {
  if (!applicability || applicability.length === 0) return '';
  return applicability.join(', ');
};

const getFormattedApplicabilityOn = (applicability: string) => {
  if (!applicability) return '';
  return applicability.replace(/_/g, ' ').toLowerCase();
};

const formatMatchType = (matchType: string) => {
  if (!matchType) return '';
  return matchType.replace(/_/g, ' ').toLowerCase();
};

const formatValues = (values: string | Array<string>) => {
  if (!values) return '';
  if (Array.isArray(values)) {
    return values.join(', ');
  }
  return values;
};

const checkSelectedRows = (selectedRows: any[]) => {
  return selectedRows.length === 1;
};

const getColumnWidth = (columnId: string): number => {
  const columnWidths: { [key: string]: number } = {
    'OfferCouponName': 200,
    'couponCode': 150,
    'name': 200,
    'type': 100,
    'createdBy': 150,
    'dateOfCreation': 150,
    'startDate': 150,
    'endDate': 150,
    'usageType': 100,
    'frequency': 100,
    'users': 100,
    'status': 100,
    'actions': 120
  };
  return columnWidths[columnId] || 150;
};

describe('OfferPage Utility Functions', () => {
  describe('formatDateTime', () => {
    test('formats valid ISO string correctly', () => {
      const isoString = '2023-12-25T10:30:00Z';
      const result = formatDateTime(isoString);
      expect(result).toBe('25/12/2023 10:30');
    });

    test('handles empty string', () => {
      const result = formatDateTime('');
      expect(result).toBe('');
    });

    test('handles null input', () => {
      const result = formatDateTime(null as unknown as string);
      expect(result).toBe('');
    });

    test('handles undefined input', () => {
      const result = formatDateTime(undefined as unknown as string);
      expect(result).toBe('');
    });

    test('formats different date formats', () => {
      const isoString1 = '2023-01-01T00:00:00Z';
      const isoString2 = '2023-12-31T23:59:59Z';
      
      expect(formatDateTime(isoString1)).toBe('01/01/2023 00:00');
      expect(formatDateTime(isoString2)).toBe('31/12/2023 23:59');
    });
  });

  describe('formatDateTimeToUTC', () => {
    test('formats date and time to UTC correctly', () => {
      const dateObj = dayjs('2023-12-25');
      const timeStr = '14:30';
      const result = formatDateTimeToUTC(dateObj, timeStr);
      
      expect(result).toContain('2023-12-25T14:30:00');
    });

    test('handles null date object', () => {
      const result = formatDateTimeToUTC(null, '14:30');
      expect(result).toBeNull();
    });

    test('handles empty time string', () => {
      const dateObj = dayjs('2023-12-25');
      const result = formatDateTimeToUTC(dateObj, '');
      expect(result).toBe('2023-12-25T00:00:00');
    });

    test('handles invalid time format', () => {
      const dateObj = dayjs('2023-12-25');
      expect(() => formatDateTimeToUTC(dateObj, 'invalid')).toThrow();
    });
  });

  describe('convertToISO', () => {
    test('converts date and time strings to ISO format', () => {
      const dateStr = '2023-12-25';
      const timeStr = '14:30';
      const result = convertToISO(dateStr, timeStr);
      
      expect(result).toContain('2023-12-25T14:30:00');
    });

    test('handles missing date string', () => {
      const result = convertToISO(undefined, '14:30');
      expect(result).toBeNull();
    });

    test('handles missing time string', () => {
      const result = convertToISO('2023-12-25', undefined);
      expect(result).toBeNull();
    });

    test('handles empty strings', () => {
      const result = convertToISO('', '');
      expect(result).toBeNull();
    });
  });

  describe('formatCouponData', () => {
    test('formats coupon data correctly', () => {
      const mockCoupons = [
        {
          id: '1',
          name: 'Coupon 1',
          startDate: '2023-12-25T10:30:00Z',
          endDate: '2023-12-26T10:30:00Z'
        },
        {
          id: '2',
          name: 'Coupon 2',
          startDate: '2023-12-27T10:30:00Z',
          endDate: '2023-12-28T10:30:00Z'
        }
      ];

      const result = formatCouponData(mockCoupons);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('isSelected', false);
      expect(result[0]).toHaveProperty('formattedStartDate', '25/12/2023 10:30');
      expect(result[0]).toHaveProperty('formattedEndDate', '26/12/2023 10:30');
      expect(result[1]).toHaveProperty('formattedStartDate', '27/12/2023 10:30');
      expect(result[1]).toHaveProperty('formattedEndDate', '28/12/2023 10:30');
    });

    test('handles empty array', () => {
      const result = formatCouponData([]);
      expect(result).toEqual([]);
    });

    test('handles null input', () => {
      const result = formatCouponData(null);
      expect(result).toEqual([]);
    });

    test('handles undefined input', () => {
      const result = formatCouponData(undefined);
      expect(result).toEqual([]);
    });
  });

  describe('getFormattedPaymentModes', () => {
    test('formats payment modes array correctly', () => {
      const paymentModes = ['CREDIT_CARD', 'DEBIT_CARD', 'CASH'];
      const result = getFormattedPaymentModes(paymentModes);
      expect(result).toBe('CREDIT_CARD, DEBIT_CARD, CASH');
    });

    test('handles empty array', () => {
      const result = getFormattedPaymentModes([]);
      expect(result).toBe('');
    });

    test('handles null input', () => {
      const result = getFormattedPaymentModes(null as unknown as string[]);
      expect(result).toBe('');
    });

    test('handles undefined input', () => {
      const result = getFormattedPaymentModes(undefined as unknown as string[]);
      expect(result).toBe('');
    });

    test('handles single item array', () => {
      const result = getFormattedPaymentModes(['CREDIT_CARD']);
      expect(result).toBe('CREDIT_CARD');
    });
  });

  describe('getFormattedApplicablityMethods', () => {
    test('formats applicability methods array correctly', () => {
      const applicability = ['MOBILE', 'WEB', 'DESKTOP'];
      const result = getFormattedApplicablityMethods(applicability);
      expect(result).toBe('MOBILE, WEB, DESKTOP');
    });

    test('handles empty array', () => {
      const result = getFormattedApplicablityMethods([]);
      expect(result).toBe('');
    });

    test('handles null input', () => {
      const result = getFormattedApplicablityMethods(null as unknown as string[]);
      expect(result).toBe('');
    });

    test('handles undefined input', () => {
      const result = getFormattedApplicablityMethods(undefined as unknown as string[]);
      expect(result).toBe('');
    });
  });

  describe('getFormattedApplicabilityOn', () => {
    test('formats applicability string correctly', () => {
      const applicability = 'FLIGHT_BOOKING';
      const result = getFormattedApplicabilityOn(applicability);
      expect(result).toBe('flight booking');
    });

    test('handles empty string', () => {
      const result = getFormattedApplicabilityOn('');
      expect(result).toBe('');
    });

    test('handles null input', () => {
      const result = getFormattedApplicabilityOn(null as unknown as string);
      expect(result).toBe('');
    });

    test('handles undefined input', () => {
      const result = getFormattedApplicabilityOn(undefined as unknown as string);
      expect(result).toBe('');
    });

    test('handles string without underscores', () => {
      const result = getFormattedApplicabilityOn('FLIGHT');
      expect(result).toBe('flight');
    });
  });

  describe('formatMatchType', () => {
    test('formats match type string correctly', () => {
      const matchType = 'EQUALS_TO';
      const result = formatMatchType(matchType);
      expect(result).toBe('equals to');
    });

    test('handles empty string', () => {
      const result = formatMatchType('');
      expect(result).toBe('');
    });

    test('handles null input', () => {
      const result = formatMatchType(null as unknown as string);
      expect(result).toBe('');
    });

    test('handles undefined input', () => {
      const result = formatMatchType(undefined as unknown as string);
      expect(result).toBe('');
    });

    test('handles string without underscores', () => {
      const result = formatMatchType('EQUALS');
      expect(result).toBe('equals');
    });
  });

  describe('formatValues', () => {
    test('formats array of strings correctly', () => {
      const values = ['value1', 'value2', 'value3'];
      const result = formatValues(values);
      expect(result).toBe('value1, value2, value3');
    });

    test('formats single string correctly', () => {
      const values = 'single value';
      const result = formatValues(values);
      expect(result).toBe('single value');
    });

    test('handles empty array', () => {
      const result = formatValues([]);
      expect(result).toBe('');
    });

    test('handles empty string', () => {
      const result = formatValues('');
      expect(result).toBe('');
    });

    test('handles null input', () => {
      const result = formatValues(null as unknown as string | string[]);
      expect(result).toBe('');
    });

    test('handles undefined input', () => {
      const result = formatValues(undefined as unknown as string | string[]);
      expect(result).toBe('');
    });

    test('handles single item array', () => {
      const result = formatValues(['single']);
      expect(result).toBe('single');
    });
  });

  describe('checkSelectedRows', () => {
    test('returns true for single selected row', () => {
      const selectedRows = [{ id: '1', name: 'Test' }];
      const result = checkSelectedRows(selectedRows);
      expect(result).toBe(true);
    });

    test('returns false for multiple selected rows', () => {
      const selectedRows = [
        { id: '1', name: 'Test 1' },
        { id: '2', name: 'Test 2' }
      ];
      const result = checkSelectedRows(selectedRows);
      expect(result).toBe(false);
    });

    test('returns false for no selected rows', () => {
      const selectedRows: any[] = [];
      const result = checkSelectedRows(selectedRows);
      expect(result).toBe(false);
    });
  });

  describe('getColumnWidth', () => {
    test('returns correct width for known column', () => {
      const result = getColumnWidth('OfferCouponName');
      expect(result).toBe(200);
    });

    test('returns default width for unknown column', () => {
      const result = getColumnWidth('UnknownColumn');
      expect(result).toBe(150);
    });

    test('returns correct width for different columns', () => {
      expect(getColumnWidth('couponCode')).toBe(150);
      expect(getColumnWidth('name')).toBe(200);
      expect(getColumnWidth('type')).toBe(100);
      expect(getColumnWidth('actions')).toBe(120);
    });
  });

  describe('Integration Tests', () => {
    test('formats complete coupon data with all utilities', () => {
      const mockCoupon = {
        id: '1',
        name: 'Test Coupon',
        startDate: '2023-12-25T10:30:00Z',
        endDate: '2023-12-26T10:30:00Z',
        paymentModes: ['CREDIT_CARD', 'DEBIT_CARD'],
        applicability: ['MOBILE', 'WEB'],
        applicabilityOn: 'FLIGHT_BOOKING'
      };

      const formattedCoupon = formatCouponData([mockCoupon])[0];
      const formattedPaymentModes = getFormattedPaymentModes(mockCoupon.paymentModes);
      const formattedApplicability = getFormattedApplicablityMethods(mockCoupon.applicability);
      const formattedApplicabilityOn = getFormattedApplicabilityOn(mockCoupon.applicabilityOn);

      expect(formattedCoupon.formattedStartDate).toBe('25/12/2023 10:30');
      expect(formattedCoupon.formattedEndDate).toBe('26/12/2023 10:30');
      expect(formattedPaymentModes).toBe('CREDIT_CARD, DEBIT_CARD');
      expect(formattedApplicability).toBe('MOBILE, WEB');
      expect(formattedApplicabilityOn).toBe('flight booking');
    });

    test('handles edge cases in integration', () => {
      const mockCoupon = {
        id: '1',
        name: 'Test Coupon',
        startDate: '',
        endDate: null,
        paymentModes: [],
        applicability: null,
        applicabilityOn: ''
      };

      const formattedCoupon = formatCouponData([mockCoupon])[0];
      const formattedPaymentModes = getFormattedPaymentModes(mockCoupon.paymentModes);
      const formattedApplicability = getFormattedApplicablityMethods(mockCoupon.applicability);
      const formattedApplicabilityOn = getFormattedApplicabilityOn(mockCoupon.applicabilityOn);

      expect(formattedCoupon.formattedStartDate).toBe('');
      expect(formattedCoupon.formattedEndDate).toBe('');
      expect(formattedPaymentModes).toBe('');
      expect(formattedApplicability).toBe('');
      expect(formattedApplicabilityOn).toBe('');
    });
  });
}); 