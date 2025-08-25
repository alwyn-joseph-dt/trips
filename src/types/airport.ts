export interface AirportData {
  status: string;
  id: number;
  city: string;
  iata: string;
  icao: string;
  airport: string;
  elevation: string;
  gps: string;
  municipality: string;
  country: string;
  longitude: string;
  latitude: string;
  popularity: string;
  type: string;
  nearby: string;
}

// Define types
type CustomSwitchProps = {
  paginatedRow: {
    Status: string;
  };
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};