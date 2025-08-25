import { TableData } from "../table/Table";
 import  {SwitchProps} from "@mui/material";


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

export interface AirportTableDataProps {
  searchTerm: string;
  rows?: AirportData[];
  row?: TableData;
  handleMenuOpen?: (
    e: React.MouseEvent<HTMLButtonElement>,
    rowId: number
  ) => void;
}
export interface CustomSwitchProps extends SwitchProps {
  checked: boolean;
   row: AirportData;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  size?: "small" | "medium";
}