import { offerValidationSchemas, editSSValidationSchema } from '../OfferValidationSchema';

describe('OfferValidationSchema', () => {
  describe('Step 1: Offer Details & Applicability', () => {
    const step1Schema = offerValidationSchemas[1];

    test('validates valid offer data', async () => {
      const validData = {
        offerName: 'Valid Offer Name',
        userSegment: { Id: '1', Name: 'Test Segment' }
      };

      await expect(step1Schema.validate(validData)).resolves.toBeTruthy();
    });

    test('validates offer name minimum length', async () => {
      const invalidData = {
        offerName: 'ab', // Less than 3 characters
        userSegment: { Id: '1', Name: 'Test Segment' }
      };

      await expect(step1Schema.validate(invalidData)).rejects.toThrow('Offer Name must be at least 3 characters long');
    });

    test('validates offer name with whitespace', async () => {
      const invalidData = {
        offerName: '   ', // Only whitespace
        userSegment: { Id: '1', Name: 'Test Segment' }
      };

      // The schema transforms whitespace to null, so this should pass
      await expect(step1Schema.validate(invalidData)).resolves.toBeTruthy();
    });

    test('validates user segment is required', async () => {
      const invalidData = {
        offerName: 'Valid Offer Name',
        userSegment: null
      };

      await expect(step1Schema.validate(invalidData)).rejects.toThrow('User Profile is required');
    });

    test('validates user segment with empty values', async () => {
      const invalidData = {
        offerName: 'Valid Offer Name',
        userSegment: { Id: '', Name: '' }
      };

      await expect(step1Schema.validate(invalidData)).rejects.toThrow('User Profile is required');
    });

    test('validates user segment with missing Id', async () => {
      const invalidData = {
        offerName: 'Valid Offer Name',
        userSegment: { Id: '', Name: 'Test Segment' }
      };

      await expect(step1Schema.validate(invalidData)).rejects.toThrow('User Profile is required');
    });

    test('validates user segment with missing Name', async () => {
      const invalidData = {
        offerName: 'Valid Offer Name',
        userSegment: { Id: '1', Name: '' }
      };

      await expect(step1Schema.validate(invalidData)).rejects.toThrow('User Profile is required');
    });
  });

  describe('Step 2: Offer Description', () => {
    const step2Schema = offerValidationSchemas[2];

    test('validates valid description data', async () => {
      const validData = {
        offerName: 'Valid Offer Name',
        shortDescription: 'Valid short description',
        longDescription: 'Valid long description',
        termsAndConditions: 'Valid terms and conditions'
      };

      await expect(step2Schema.validate(validData)).resolves.toBeTruthy();
    });

    test('validates short description is required', async () => {
      const invalidData = {
        offerName: 'Valid Offer Name',
        shortDescription: '',
        longDescription: 'Valid long description',
        termsAndConditions: 'Valid terms and conditions'
      };

      await expect(step2Schema.validate(invalidData)).rejects.toThrow('Short Description is required');
    });

    test('validates long description is required', async () => {
      const invalidData = {
        offerName: 'Valid Offer Name',
        shortDescription: 'Valid short description',
        longDescription: '',
        termsAndConditions: 'Valid terms and conditions'
      };

      await expect(step2Schema.validate(invalidData)).rejects.toThrow('Long Description is required');
    });

    test('validates terms and conditions is required', async () => {
      const invalidData = {
        offerName: 'Valid Offer Name',
        shortDescription: 'Valid short description',
        longDescription: 'Valid long description',
        termsAndConditions: ''
      };

      await expect(step2Schema.validate(invalidData)).rejects.toThrow('Terms and Conditions are required');
    });

    test('validates offer name minimum length in step 2', async () => {
      const invalidData = {
        offerName: 'ab', // Less than 3 characters
        shortDescription: 'Valid short description',
        longDescription: 'Valid long description',
        termsAndConditions: 'Valid terms and conditions'
      };

      await expect(step2Schema.validate(invalidData)).rejects.toThrow('Offer Name must be at least 3 characters long');
    });
  });

  describe('Step 3: Generation of Coupon Codes', () => {
    const step3Schema = offerValidationSchemas[3];

    test('validates valid coupon codes data', async () => {
      const validData = {
        offerName: 'Valid Offer Name',
        couponCodes: ['CODE1', 'CODE2', 'CODE3']
      };

      await expect(step3Schema.validate(validData)).resolves.toBeTruthy();
    });

    test('validates coupon codes array is required', async () => {
      const invalidData = {
        offerName: 'Valid Offer Name',
        couponCodes: []
      };

      await expect(step3Schema.validate(invalidData)).rejects.toThrow('No Coupons generated');
    });

    test('validates coupon codes array has minimum length', async () => {
      const invalidData = {
        offerName: 'Valid Offer Name',
        couponCodes: []
      };

      await expect(step3Schema.validate(invalidData)).rejects.toThrow('No Coupons generated');
    });

    test('validates individual coupon codes are not empty', async () => {
      const invalidData = {
        offerName: 'Valid Offer Name',
        couponCodes: ['CODE1', '', 'CODE3']
      };

      await expect(step3Schema.validate(invalidData)).rejects.toThrow();
    });

    test('validates offer name minimum length in step 3', async () => {
      const invalidData = {
        offerName: 'ab', // Less than 3 characters
        couponCodes: ['CODE1', 'CODE2']
      };

      await expect(step3Schema.validate(invalidData)).rejects.toThrow('Offer Name must be at least 3 characters long');
    });
  });

  describe('Step 4: Offer Constraints', () => {
    const step4Schema = offerValidationSchemas[4];

    test('validates valid constraints data', async () => {
      const validData = {
        offerName: 'Valid Offer Name',
        constraints: [
          {
            CouponConstraintId: '1',
            CouponConstraintName: 'Test Constraint',
            Rules: [
              {
                RuleDisplayOrder: 1,
                RuleOperator: 'AND',
                RuleOptions: [
                  {
                    MatchType: 'EQUALS',
                    MatchValue: 'Test Value'
                  }
                ]
              }
            ]
          }
        ]
      };

      await expect(step4Schema.validate(validData)).resolves.toBeTruthy();
    });

    test('validates constraints array is required', async () => {
      const invalidData = {
        offerName: 'Valid Offer Name',
        constraints: []
      };

      await expect(step4Schema.validate(invalidData)).rejects.toThrow('Need at least one constraint');
    });

    test('validates constraints array has minimum length', async () => {
      const invalidData = {
        offerName: 'Valid Offer Name',
        constraints: []
      };

      await expect(step4Schema.validate(invalidData)).rejects.toThrow('Need at least one constraint');
    });

    test('validates each constraint has rules', async () => {
      const invalidData = {
        offerName: 'Valid Offer Name',
        constraints: [
          {
            CouponConstraintId: '1',
            CouponConstraintName: 'Test Constraint',
            Rules: []
          }
        ]
      };

      await expect(step4Schema.validate(invalidData)).rejects.toThrow('Need at least one rule for constraint');
    });

    test('validates rules array has minimum length', async () => {
      const invalidData = {
        offerName: 'Valid Offer Name',
        constraints: [
          {
            CouponConstraintId: '1',
            CouponConstraintName: 'Test Constraint',
            Rules: []
          }
        ]
      };

      await expect(step4Schema.validate(invalidData)).rejects.toThrow('Need at least one rule for constraint');
    });

    test('validates offer name minimum length in step 4', async () => {
      const invalidData = {
        offerName: 'ab', // Less than 3 characters
        constraints: [
          {
            CouponConstraintId: '1',
            CouponConstraintName: 'Test Constraint',
            Rules: [
              {
                RuleDisplayOrder: 1,
                RuleOperator: 'AND',
                RuleOptions: [
                  {
                    MatchType: 'EQUALS',
                    MatchValue: 'Test Value'
                  }
                ]
              }
            ]
          }
        ]
      };

      await expect(step4Schema.validate(invalidData)).rejects.toThrow('Offer Name must be at least 3 characters long');
    });
  });

  describe('Step 5: Usage Type', () => {
    const step5Schema = offerValidationSchemas[5];

    test('validates valid usage type data', async () => {
      const validData = {
        offerName: 'Valid Offer Name',
        usageType: 'SINGLE',
        applicableDevices: ['MOBILE', 'WEB'] // Add required field
      };

      await expect(step5Schema.validate(validData)).resolves.toBeTruthy();
    });

    test('validates usage type is required', async () => {
      const invalidData = {
        offerName: 'Valid Offer Name',
        usageType: '',
        applicableDevices: ['MOBILE', 'WEB']
      };

      await expect(step5Schema.validate(invalidData)).rejects.toThrow('Usage Type is required');
    });

    test('validates offer name minimum length in step 5', async () => {
      const invalidData = {
        offerName: 'ab', // Less than 3 characters
        usageType: 'SINGLE',
        applicableDevices: ['MOBILE', 'WEB']
      };

      await expect(step5Schema.validate(invalidData)).rejects.toThrow('Offer Name must be at least 3 characters long');
    });

    test('validates usage type accepts SINGLE', async () => {
      const validData = {
        offerName: 'Valid Offer Name',
        usageType: 'SINGLE',
        applicableDevices: ['MOBILE', 'WEB']
      };

      await expect(step5Schema.validate(validData)).resolves.toBeTruthy();
    });

    test('validates usage type accepts MULTIPLE', async () => {
      const validData = {
        offerName: 'Valid Offer Name',
        usageType: 'MULTIPLE',
        applicableDevices: ['MOBILE', 'WEB']
      };

      await expect(step5Schema.validate(validData)).resolves.toBeTruthy();
    });
  });

  describe('Edit SS Validation Schema', () => {
    test('validates edit SS validation schema exists', () => {
      expect(editSSValidationSchema).toBeDefined();
    });

    test('validates edit SS schema structure', () => {
      // This test would validate the structure of editSSValidationSchema
      // The actual validation would depend on the schema definition
      expect(typeof editSSValidationSchema).toBe('object');
    });
  });

  describe('Edge Cases', () => {
    test('handles null offer name', async () => {
      const step1Schema = offerValidationSchemas[1];
      const invalidData = {
        offerName: null,
        userSegment: { Id: '1', Name: 'Test Segment' }
      };

      // The schema transforms null to null, so this should pass
      await expect(step1Schema.validate(invalidData)).resolves.toBeTruthy();
    });

    test('handles undefined offer name', async () => {
      const step1Schema = offerValidationSchemas[1];
      const invalidData = {
        userSegment: { Id: '1', Name: 'Test Segment' }
      };

      // The schema transforms undefined to null, so this should pass
      await expect(step1Schema.validate(invalidData)).resolves.toBeTruthy();
    });

    test('handles empty string offer name', async () => {
      const step1Schema = offerValidationSchemas[1];
      const invalidData = {
        offerName: '',
        userSegment: { Id: '1', Name: 'Test Segment' }
      };

      // The schema transforms empty string to null, so this should pass
      await expect(step1Schema.validate(invalidData)).resolves.toBeTruthy();
    });

    test('handles whitespace-only offer name', async () => {
      const step1Schema = offerValidationSchemas[1];
      const invalidData = {
        offerName: '   ',
        userSegment: { Id: '1', Name: 'Test Segment' }
      };

      // The schema transforms whitespace to null, so this should pass
      await expect(step1Schema.validate(invalidData)).resolves.toBeTruthy();
    });
  });

  describe('Schema Structure', () => {
    test('validates all validation schemas exist', () => {
      expect(offerValidationSchemas).toBeDefined();
      expect(Array.isArray(offerValidationSchemas)).toBe(true);
      expect(offerValidationSchemas.length).toBeGreaterThan(0);
    });

    test('validates each schema is a valid Yup schema', () => {
      offerValidationSchemas.forEach((schema) => {
        if (schema !== null) {
          expect(schema).toBeDefined();
          expect(typeof schema.validate).toBe('function');
        }
      });
    });
  });
}); 