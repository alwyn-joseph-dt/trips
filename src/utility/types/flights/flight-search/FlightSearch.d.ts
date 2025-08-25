export interface MultiCitySegment {
  returnDate?: any;
  from: string;
  originCityName: string;
  destinationCityName: string;
  to: string;
  departureDate: string;
  originData: string | null;
  destinationData: string | null;
}

interface Pax {
  adult: number;
}

export type SegmentField = 'from' | 'to' | 'departureDate' | 'returnDate';

export interface FormValues {
  tripType: string;
  pax: Pax;
  returnDate?: any;
  cabinClass: string;
  airlines: string;
  multiCitySegments: MultiCitySegment[]; // Array of objects with 'from', 'to', and 'departureDate'
}

export interface DestinationInfo {
  originCode: string;
  destinationCode: string;
  departureDate: string;
}

export interface DiscountCode {
  tmcId: string;
  organizationId: string;
  supplierCode: string;
}

export interface Filter {
  stopOver: any[];
  cabinPreference: string[];
  airlines: string[]
  discountCodes: DiscountCode[];
  recommendedFlights: string[];
}

export interface Pax {
  adult: number;
  child: number;
  infant: number;
}

export interface FlightSearchPayload {
  [x: string]: unknown;
  currency: string;
  language: string;
  destinationInfo: MultiCitySegment[];
  pax: Pax;
  filters: Filter;
  tripType: string,
}

export interface ModifyFormValues {
  tripType: string;
  returnDate?: any;
  multiCitySegments: MultiCitySegment[];
  pax: Pax;
  cabinClass: string;
  currentDeparatureMonth: CurrentMonth;
  currenReturntMonth: CurrentMonth;
}

export interface CurrentMonth {
  year: number;
  month: number;
}